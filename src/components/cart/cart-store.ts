"use client";

import { useSyncExternalStore } from "react";
import type { Category } from "@/lib/types";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  nameEn?: string | null;
  category: Category;
  price: number;
  accentColor: string;
  imageUrl: string | null;
  qty: number;
}

export const MAX_QTY = 10;
const STORAGE_KEY = "shahna-cart-v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isCartItem(value: unknown): value is CartItem {
  const v = value as CartItem;
  return (
    typeof v === "object" &&
    v !== null &&
    typeof v.productId === "string" &&
    typeof v.name === "string" &&
    typeof v.price === "number" &&
    Number.isInteger(v.qty) &&
    v.qty > 0
  );
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    items = Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: the cart still works for this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep carts in sync across open tabs.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

export const cart = {
  add(item: Omit<CartItem, "qty">, qty = 1) {
    load();
    const existing = items.find((i) => i.productId === item.productId);
    if (existing) {
      cart.setQty(item.productId, existing.qty + qty);
    } else {
      commit([...items, { ...item, qty: Math.min(qty, MAX_QTY) }]);
    }
  },
  setQty(productId: string, qty: number) {
    load();
    if (qty <= 0) return cart.remove(productId);
    commit(items.map((i) => (i.productId === productId ? { ...i, qty: Math.min(qty, MAX_QTY) } : i)));
  },
  remove(productId: string) {
    load();
    commit(items.filter((i) => i.productId !== productId));
  },
  clear() {
    commit(EMPTY);
  },
};

export function useCart() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const count = current.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = current.reduce((sum, i) => sum + i.qty * i.price, 0);
  return { items: current, count, subtotal };
}

const noopSubscribe = () => () => {};

/** False during server render and hydration, true once running in the browser. */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
