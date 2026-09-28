import "server-only";
import { MongoClient, type Db, type ObjectId } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";
import type { Category, Customer, OrderItem, OrderStatus, ProductSpecs } from "./types";

export interface ProductDoc {
  _id: ObjectId;
  slug: string;
  name: string;
  // Optional English translations (missing on bikes created before they existed).
  nameEn?: string | null;
  brand: string;
  category: Category;
  price: number;
  compareAtPrice: number | null;
  description: string;
  descriptionEn?: string | null;
  imageUrl: string | null;
  accentColor: string;
  specs: ProductSpecs;
  stock: number;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderDoc {
  _id: ObjectId;
  number: string;
  items: OrderItem[];
  total: number;
  customer: Customer;
  status: OrderStatus;
  createdAt: Date;
}

// Reuse one client per server instance (and across hot reloads in dev).
const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
  mongoIndexes?: Promise<void>;
};

function getClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.");
  }
  if (!globalForMongo.mongoClient) {
    const client = new MongoClient(uri, { appName: "shahna" });
    // Lets Vercel Fluid compute close idle connections before a function is suspended.
    attachDatabasePool(client);
    globalForMongo.mongoClient = client;
  }
  return globalForMongo.mongoClient;
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("products").createIndex({ slug: 1 }, { unique: true }),
    db.collection("products").createIndex({ active: 1, category: 1, price: 1 }),
    db.collection("orders").createIndex({ number: 1 }, { unique: true }),
    db.collection("orders").createIndex({ createdAt: -1 }),
  ]);
}

export async function getDb() {
  const db = getClient().db(process.env.MONGODB_DB || "shahna");
  globalForMongo.mongoIndexes ??= ensureIndexes(db).catch((err) => {
    globalForMongo.mongoIndexes = undefined;
    throw err;
  });
  await globalForMongo.mongoIndexes;
  return db;
}

export async function productsCollection() {
  return (await getDb()).collection<ProductDoc>("products");
}

export async function ordersCollection() {
  return (await getDb()).collection<OrderDoc>("orders");
}
