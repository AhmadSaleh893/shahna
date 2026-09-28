"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ProductImage } from "@/components/product-image";
import { CATEGORIES, type Category, type Product } from "@/lib/types";
import { saveProduct, type ProductFormState } from "../actions";

const SPEC_FIELDS = [
  { name: "motorWatts", label: "motor", unit: "w" },
  { name: "batteryWh", label: "battery", unit: "wh" },
  { name: "rangeKm", label: "range", unit: "km" },
  { name: "topSpeedKmh", label: "topSpeed", unit: "kmh" },
  { name: "weightKg", label: "weight", unit: "kg" },
] as const;

export function ProductForm({ product }: { product?: Product }) {
  const { t } = useI18n();
  const f = t.admin.form;
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    saveProduct.bind(null, product?.id ?? null),
    {},
  );
  const [category, setCategory] = useState<Category>(product?.category ?? "city");
  const [accentColor, setAccentColor] = useState(product?.accentColor ?? "#d4fb3a");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const errors = state.errors ?? {};
  const previewImage = imageUrl.startsWith("https://") || imageUrl.startsWith("/") ? imageUrl : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
      noValidate
      className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-6">
        <Section title={f.sections.basics}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={f.name} error={errors.name}>
              <input name="name" dir="auto" value={name} onChange={(e) => setName(e.target.value)} className="field" required />
            </Field>
            <Field label={f.nameEn} hint={f.englishHint} error={errors.nameEn}>
              <input name="nameEn" dir="ltr" defaultValue={product?.nameEn ?? ""} className="field" />
            </Field>
            <Field label={f.brand} error={errors.brand}>
              <input name="brand" dir="auto" defaultValue={product?.brand ?? "Shahna"} className="field" required />
            </Field>
            <Field label={f.category} error={errors.category}>
              <select name="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className="field">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t.categories[c]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={f.slug} hint={f.slugHint} error={errors.slug} className="sm:col-span-2">
              <div dir="ltr" className="flex items-center rounded-xl border border-line bg-paper focus-within:border-ink">
                <span className="ps-3.5 text-sm text-muted">/bikes/</span>
                <input
                  name="slug"
                  defaultValue={product?.slug}
                  placeholder="urban-glide-500"
                  className="field border-0 bg-transparent ps-1 focus:ring-0"
                />
              </div>
            </Field>
            <Field label={f.description} error={errors.description} className="sm:col-span-2">
              <textarea name="description" dir="auto" defaultValue={product?.description} rows={5} className="field" required />
            </Field>
            <Field label={f.descriptionEn} hint={f.englishHint} error={errors.descriptionEn} className="sm:col-span-2">
              <textarea name="descriptionEn" dir="ltr" defaultValue={product?.descriptionEn ?? ""} rows={4} className="field" />
            </Field>
          </div>
        </Section>

        <Section title={f.sections.priceStock}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={f.price} error={errors.price}>
              <input name="price" type="number" min={0} step="1" defaultValue={product?.price} className="field" required />
            </Field>
            <Field label={f.compareAt} hint={f.compareAtHint} error={errors.compareAtPrice}>
              <input
                name="compareAtPrice"
                type="number"
                min={0}
                step="1"
                defaultValue={product?.compareAtPrice ?? ""}
                className="field"
              />
            </Field>
            <Field label={f.stock} error={errors.stock}>
              <input name="stock" type="number" min={0} step="1" defaultValue={product?.stock ?? 0} className="field" required />
            </Field>
          </div>
        </Section>

        <Section title={f.sections.specs}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {SPEC_FIELDS.map((s) => (
              <Field key={s.name} label={`${t.product.specs[s.label]} (${t.units[s.unit]})`} error={errors[`specs.${s.name}`]}>
                <input
                  name={s.name}
                  type="number"
                  min={0}
                  step="any"
                  defaultValue={product?.specs[s.name]}
                  className="field"
                  required
                />
              </Field>
            ))}
          </div>
        </Section>
      </div>

      <div className="space-y-6 lg:sticky lg:top-6">
        <Section title={f.sections.look}>
          <ProductImage
            name={name || f.preview}
            category={category}
            accentColor={accentColor}
            imageUrl={previewImage}
            sizes="320px"
            className="aspect-[4/3] rounded-2xl"
          />
          <div className="mt-4 space-y-4">
            <Field label={f.accent} hint={f.accentHint} error={errors.accentColor}>
              <div className="flex items-center gap-3">
                <input
                  name="accentColor"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-line bg-card p-1"
                />
                <span className="font-mono text-sm text-muted" dir="ltr">
                  {accentColor}
                </span>
              </div>
            </Field>
            <Field label={f.photo} hint={f.photoHint} error={errors.imageUrl}>
              <input
                name="imageUrl"
                dir="ltr"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
                className="field"
              />
            </Field>
          </div>
        </Section>

        <Section title={f.sections.visibility}>
          <div className="space-y-3">
            <Toggle name="active" defaultChecked={product?.active ?? true} label={f.active} />
            <Toggle name="featured" defaultChecked={product?.featured ?? false} label={f.featured} />
          </div>
        </Section>

        {state.message && (
          <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {state.message}
          </p>
        )}
        <div className="flex gap-3">
          <button type="submit" disabled={pending} className="btn-primary flex-1 py-3">
            {pending ? f.saving : product ? f.save : f.create}
          </button>
          <Link href="/admin/products" className="btn-outline py-3">
            {f.cancel}
          </Link>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-3xl border border-line bg-card p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="label">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-danger">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>
      )}
    </label>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
      {label}
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-volt after:absolute after:top-0.5 after:start-0.5 after:size-5 after:rounded-full after:bg-card after:transition peer-checked:after:translate-x-5 peer-checked:after:bg-volt rtl:peer-checked:after:-translate-x-5" />
    </label>
  );
}
