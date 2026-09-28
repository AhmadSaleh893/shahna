import "server-only";
import { randomBytes } from "node:crypto";
import { ObjectId, type Filter } from "mongodb";
import { ordersCollection, type OrderDoc } from "./db";
import type { Customer, Order, OrderItem, OrderStatus } from "./types";

function toOrder({ _id, ...doc }: OrderDoc): Order {
  return { id: _id.toHexString(), ...doc };
}

// Short, readable, unambiguous (no 0/O/1/I) order numbers like SH-7K3QXM.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
function generateOrderNumber() {
  const bytes = randomBytes(6);
  let code = "";
  for (const b of bytes) code += ALPHABET[b % ALPHABET.length];
  return `SH-${code}`;
}

export async function createOrder(items: OrderItem[], customer: Customer) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const doc: OrderDoc = {
    _id: new ObjectId(),
    number: generateOrderNumber(),
    items,
    total,
    customer,
    status: "new",
    createdAt: new Date(),
  };
  await (await ordersCollection()).insertOne(doc);
  return toOrder(doc);
}

export async function listOrders(status?: OrderStatus) {
  const filter: Filter<OrderDoc> = status ? { status } : {};
  const docs = await (await ordersCollection()).find(filter).sort({ createdAt: -1 }).limit(200).toArray();
  return docs.map(toOrder);
}

export async function listRecentOrders(limit = 5) {
  const docs = await (await ordersCollection()).find().sort({ createdAt: -1 }).limit(limit).toArray();
  return docs.map(toOrder);
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  if (!ObjectId.isValid(id)) return;
  await (await ordersCollection()).updateOne({ _id: new ObjectId(id) }, { $set: { status } });
}

export async function getOrderCounts() {
  const rows = await (await ordersCollection())
    .aggregate<{ _id: OrderStatus; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    .toArray();
  const counts: Record<OrderStatus | "all", number> = { all: 0, new: 0, contacted: 0, completed: 0, cancelled: 0 };
  for (const row of rows) {
    counts[row._id] = row.count;
    counts.all += row.count;
  }
  return counts;
}
