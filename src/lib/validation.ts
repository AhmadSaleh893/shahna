import { z } from "zod";
import type { Dictionary } from "./i18n";
import { CATEGORIES } from "./types";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v ?? null);

// Messages come from the visitor's dictionary so errors show in their language.
function productSchema(t: Dictionary) {
  const e = t.admin.form.errors;
  const s = t.product.specs;
  // Treat a blank input as missing rather than letting coercion turn it into 0.
  const specNumber = (label: string, max: number) =>
    z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.coerce.number({ error: e.specRequired(label) }).min(0, e.specNegative(label)).max(max, e.tooLarge),
    );
  const optionalText = (max: number) => z.preprocess(emptyToNull, z.string().trim().max(max, e.tooLong).nullable());

  return z.object({
    name: z.string().trim().min(2, e.nameShort).max(100, e.tooLong),
    nameEn: optionalText(100),
    slug: z.string().trim().toLowerCase().max(80, e.tooLong).regex(/^[a-z0-9-]*$/, e.slugFormat),
    brand: z.string().trim().min(1, e.brand).max(60, e.tooLong),
    category: z.enum(CATEGORIES, { error: e.category }),
    price: z.coerce.number().positive(e.price).max(1_000_000, e.tooLarge),
    compareAtPrice: z.preprocess(emptyToNull, z.coerce.number().positive(e.price).max(1_000_000, e.tooLarge).nullable()),
    description: z.string().trim().min(10, e.description).max(3000, e.tooLong),
    descriptionEn: optionalText(3000),
    imageUrl: z.preprocess(
      emptyToNull,
      z
        .string()
        .trim()
        .max(500, e.tooLong)
        .refine((v) => v.startsWith("/") || v.startsWith("https://"), e.image)
        .nullable(),
    ),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, e.color),
    specs: z.object({
      motorWatts: specNumber(s.motor, 5000),
      batteryWh: specNumber(s.battery, 5000),
      rangeKm: specNumber(s.range, 1000),
      topSpeedKmh: specNumber(s.topSpeed, 100),
      weightKg: specNumber(s.weight, 200),
    }),
    stock: z.coerce.number().int(e.stock).min(0, e.stock).max(100_000, e.tooLarge),
    featured: z.boolean(),
    active: z.boolean(),
  });
}

export function productFromForm(formData: FormData, t: Dictionary) {
  const get = (key: string) => formData.get(key) ?? "";
  return productSchema(t).safeParse(
    {
      name: get("name"),
      nameEn: get("nameEn"),
      slug: get("slug"),
      brand: get("brand"),
      category: get("category"),
      price: get("price"),
      compareAtPrice: get("compareAtPrice"),
      description: get("description"),
      descriptionEn: get("descriptionEn"),
      imageUrl: get("imageUrl"),
      accentColor: get("accentColor"),
      specs: {
        motorWatts: get("motorWatts"),
        batteryWh: get("batteryWh"),
        rangeKm: get("rangeKm"),
        topSpeedKmh: get("topSpeedKmh"),
        weightKg: get("weightKg"),
      },
      stock: get("stock"),
      featured: formData.get("featured") === "on",
      active: formData.get("active") === "on",
    },
    { error: () => t.admin.form.errors.invalid },
  );
}

export function parseCheckout(data: unknown, t: Dictionary) {
  const e = t.cart.errors;
  const schema = z.object({
    items: z
      .array(
        z.object({
          productId: z.string().regex(/^[a-f0-9]{24}$/),
          qty: z.number().int().min(1).max(10),
        }),
      )
      .min(1, e.empty)
      .max(20),
    customer: z.object({
      name: z.string().trim().min(2, e.name).max(80, e.tooLong),
      phone: z
        .string()
        .trim()
        .regex(/^\+?[\d\s()-]{7,20}$/, e.phone),
      city: z.string().trim().min(2, e.city).max(60, e.tooLong),
      address: z.string().trim().max(200, e.tooLong),
      notes: z.string().trim().max(500, e.tooLong),
    }),
  });
  return schema.safeParse(data, { error: () => e.invalid });
}

/** Flattens zod issues into { "customer.phone": "message" } style keys. */
export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    errors[key] ??= issue.message;
  }
  return errors;
}
