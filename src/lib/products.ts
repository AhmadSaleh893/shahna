import "server-only";
import { ObjectId, type Filter, type Sort } from "mongodb";
import { productsCollection, type ProductDoc } from "./db";
import type { Category, Product, ProductInput } from "./types";

function toProduct({ _id, ...doc }: ProductDoc): Product {
  return { id: _id.toHexString(), ...doc, nameEn: doc.nameEn ?? null, descriptionEn: doc.descriptionEn ?? null };
}

function toObjectId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Labels for these live in the i18n dictionaries under listing.sort.
export const SORT_OPTIONS = {
  featured: { featured: -1, createdAt: -1 },
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  range: { "specs.rangeKm": -1 },
} satisfies Record<string, Sort>;

export type SortKey = keyof typeof SORT_OPTIONS;

export interface ProductQuery {
  category?: Category;
  maxPrice?: number;
  search?: string;
  sort?: SortKey;
}

// ---- Storefront ----

export async function listProducts(query: ProductQuery = {}) {
  const filter: Filter<ProductDoc> = { active: true };
  if (query.category) filter.category = query.category;
  if (query.maxPrice) filter.price = { $lte: query.maxPrice };
  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [
      { name: pattern },
      { nameEn: pattern },
      { brand: pattern },
      { description: pattern },
      { descriptionEn: pattern },
    ];
  }
  const sort = SORT_OPTIONS[query.sort ?? "featured"];
  const docs = await (await productsCollection()).find(filter).sort(sort).toArray();
  return docs.map(toProduct);
}

export async function listFeaturedProducts(limit = 4) {
  const docs = await (await productsCollection())
    .find({ active: true })
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(toProduct);
}

export async function listRelatedProducts(product: Product, limit = 3) {
  const docs = await (await productsCollection())
    .find({ active: true, category: product.category, _id: { $ne: new ObjectId(product.id) } })
    .limit(limit)
    .toArray();
  return docs.map(toProduct);
}

export async function getProductBySlug(slug: string) {
  const doc = await (await productsCollection()).findOne({ slug, active: true });
  return doc ? toProduct(doc) : null;
}

export async function getActiveProductsByIds(ids: string[]) {
  const objectIds = ids.map(toObjectId).filter((id): id is ObjectId => id !== null);
  const docs = await (await productsCollection())
    .find({ _id: { $in: objectIds }, active: true })
    .toArray();
  return docs.map(toProduct);
}

export async function getCategoryCounts() {
  const rows = await (await productsCollection())
    .aggregate<{ _id: Category; count: number }>([
      { $match: { active: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ])
    .toArray();
  return Object.fromEntries(rows.map((r) => [r._id, r.count])) as Partial<Record<Category, number>>;
}

// ---- Admin ----

export async function listAllProducts() {
  const docs = await (await productsCollection()).find().sort({ createdAt: -1 }).toArray();
  return docs.map(toProduct);
}

export async function getProductById(id: string) {
  const _id = toObjectId(id);
  if (!_id) return null;
  const doc = await (await productsCollection()).findOne({ _id });
  return doc ? toProduct(doc) : null;
}

export async function createProduct(input: ProductInput) {
  const now = new Date();
  const result = await (await productsCollection()).insertOne({
    _id: new ObjectId(),
    ...input,
    createdAt: now,
    updatedAt: now,
  });
  return result.insertedId.toHexString();
}

export async function updateProduct(id: string, input: ProductInput) {
  const _id = toObjectId(id);
  if (!_id) return false;
  const result = await (await productsCollection()).updateOne(
    { _id },
    { $set: { ...input, updatedAt: new Date() } },
  );
  return result.matchedCount === 1;
}

export async function deleteProduct(id: string) {
  const _id = toObjectId(id);
  if (!_id) return;
  await (await productsCollection()).deleteOne({ _id });
}

export async function insertProducts(inputs: ProductInput[]) {
  const collection = await productsCollection();
  const existing = new Set(
    (await collection.find({}, { projection: { slug: 1 } }).toArray()).map((d) => d.slug),
  );
  const fresh = inputs.filter((p) => !existing.has(p.slug));
  if (fresh.length === 0) return 0;
  // Stagger timestamps so "newest" sorting keeps the sample order stable.
  const base = Date.now();
  await collection.insertMany(
    fresh.map((p, i) => {
      const at = new Date(base - i * 1000);
      return { _id: new ObjectId(), ...p, createdAt: at, updatedAt: at };
    }),
  );
  return fresh.length;
}

export async function getProductStats() {
  const collection = await productsCollection();
  const [total, active, outOfStock] = await Promise.all([
    collection.countDocuments(),
    collection.countDocuments({ active: true }),
    collection.countDocuments({ active: true, stock: { $lte: 0 } }),
  ]);
  return { total, active, outOfStock };
}
