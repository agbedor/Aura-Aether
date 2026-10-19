import { PrismaClient } from "@prisma/client";
import { initialProducts, initialCategories } from "./data";
import { Product, Category, Order, User } from "@/types";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// In-memory persistent fallback store for development resilience
interface MemoryStore {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
}

const memoryStore: MemoryStore = {
  products: [...initialProducts],
  categories: [...initialCategories],
  orders: [],
  users: [
    {
      id: "usr-admin-demo",
      name: "Aura Admin",
      email: "admin@aura-aether.com",
      role: "ADMIN",
      phone: "+233 24 123 4567",
      address: "Ridge Luxury Tower, Airport Residential",
      city: "Accra",
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr-customer-demo",
      name: "Amara Mensah",
      email: "amara@example.com",
      role: "CUSTOMER",
      phone: "+233 20 987 6543",
      address: "14 Senchi Street, Airport Residential",
      city: "Accra",
      createdAt: new Date().toISOString(),
    },
  ],
};

// Test if PostgreSQL Prisma connection is active
let isPostgresAvailable: boolean | null = null;

async function checkPostgres(): Promise<boolean> {
  if (isPostgresAvailable !== null) return isPostgresAvailable;
  try {
    // Quick probe with timeout
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000)),
    ]);
    isPostgresAvailable = true;
    return true;
  } catch {
    // Do not cache a failed connection check forever. The database may become
    // available after startup, so retry it on the next request.
    isPostgresAvailable = null;
    return false;
  }
}

// ========================
// PRODUCTS & CATEGORIES
// ========================

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  giftSets?: boolean;
  search?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "name";
}): Promise<Product[]> {
  const useDb = await checkPostgres();

  if (useDb) {
    try {
      const where: Record<string, unknown> = {};
      if (options?.featured) where.isFeatured = true;
      if (options?.giftSets !== undefined) where.isGiftSet = options.giftSets;
      if (options?.category) {
        where.category = { slug: options.category };
      }
      if (options?.search) {
        where.OR = [
          { name: { contains: options.search, mode: "insensitive" } },
          { description: { contains: options.search, mode: "insensitive" } },
          { scentNotes: { contains: options.search, mode: "insensitive" } },
        ];
      }

      let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
      if (options?.sort === "price-asc") orderBy = { price: "asc" };
      if (options?.sort === "price-desc") orderBy = { price: "desc" };
      if (options?.sort === "name") orderBy = { name: "asc" };

      const dbProducts = await prisma.product.findMany({
        where,
        orderBy,
        include: { category: true },
      });

      if (dbProducts.length > 0) {
        return dbProducts.map((p) => ({
          ...p,
          category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : undefined,
        }));
      }
    } catch (e) {
      console.warn("Falling back to internal product catalog:", e);
    }
  }

  // Memory fallback with filtering & sorting
  let list = [...memoryStore.products];

  if (options?.featured) {
    list = list.filter((p) => p.isFeatured);
  }
  if (options?.giftSets !== undefined) {
    list = list.filter((p) => p.isGiftSet === options.giftSets);
  }
  if (options?.category) {
    const cat = memoryStore.categories.find((c) => c.slug === options.category);
    if (cat) {
      list = list.filter((p) => p.categoryId === cat.id);
    }
  }
  if (options?.search) {
    const query = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.scentNotes.toLowerCase().includes(query)
    );
  }

  if (options?.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (options?.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (options?.sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      });
      if (product) {
        return {
          ...product,
          category: product.category ? { id: product.category.id, name: product.category.name, slug: product.category.slug } : undefined,
        };
      }
    } catch {
      // fallback
    }
  }

  return memoryStore.products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const p = await prisma.product.findUnique({ where: { id }, include: { category: true } });
      if (p) return p;
    } catch {
      // fallback
    }
  }
  return memoryStore.products.find((p) => p.id === id) || null;
}

export async function getCategories(): Promise<Category[]> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const cats = await prisma.category.findMany();
      if (cats.length > 0) return cats;
    } catch {
      // fallback
    }
  }
  return memoryStore.categories;
}

// ========================
// ORDERS & INVENTORY
// ========================

export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const created = await prisma.order.create({
        data: {
          id: newOrder.id,
          orderNumber: newOrder.orderNumber,
          userId: newOrder.userId || null,
          customerName: newOrder.customerName,
          customerEmail: newOrder.customerEmail,
          customerPhone: newOrder.customerPhone,
          deliveryAddress: newOrder.deliveryAddress,
          city: newOrder.city,
          notes: newOrder.notes,
          subtotal: newOrder.subtotal,
          deliveryFee: newOrder.deliveryFee,
          totalAmount: newOrder.totalAmount,
          status: newOrder.status,
          paymentStatus: newOrder.paymentStatus,
          paymentReference: newOrder.paymentReference,
          items: {
            create: newOrder.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productPrice: item.productPrice,
              quantity: item.quantity,
              size: item.size,
              image: item.image,
            })),
          },
        },
        include: { items: true, payment: true },
      });
      return {
        ...created,
        status: created.status as Order["status"],
        paymentStatus: created.paymentStatus as Order["paymentStatus"],
        items: created.items,
        payment: created.payment ? {
          ...created.payment,
          status: created.payment.status as "PENDING" | "SUCCESS" | "FAILED" | "REVERSED",
        } : null,
      };
    } catch (e) {
      console.error("Prisma order creation failed; order was not saved:", e);
      throw new Error("Order could not be saved to PostgreSQL. Check the database connection and Prisma schema.");
    }
  }

  // Orders must be persisted in PostgreSQL. Never report success for an
  // in-memory-only order because it disappears when the server restarts.
  throw new Error("PostgreSQL is unavailable; refusing to save the order only in memory.");
}

export async function getOrderByReference(reference: string): Promise<Order | null> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const order = await prisma.order.findUnique({
        where: { paymentReference: reference },
        include: { items: true, payment: true },
      });
      if (order) {
        return {
          ...order,
          status: order.status as Order["status"],
          paymentStatus: order.paymentStatus as Order["paymentStatus"],
          items: order.items,
          payment: order.payment ? {
            ...order.payment,
            status: order.payment.status as "PENDING" | "SUCCESS" | "FAILED" | "REVERSED",
          } : null,
        };
      }
    } catch {
      // fallback
    }
  }
  return memoryStore.orders.find((o) => o.paymentReference === reference) || null;
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true, payment: true },
      });
      if (order) {
        return {
          ...order,
          status: order.status as Order["status"],
          paymentStatus: order.paymentStatus as Order["paymentStatus"],
          items: order.items,
          payment: order.payment ? {
            ...order.payment,
            status: order.payment.status as "PENDING" | "SUCCESS" | "FAILED" | "REVERSED",
          } : null,
        };
      }
    } catch {
      // fallback
    }
  }
  return memoryStore.orders.find((o) => o.orderNumber === orderNumber) || null;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true, payment: true },
      });
      if (order) {
        return {
          ...order,
          status: order.status as Order["status"],
          paymentStatus: order.paymentStatus as Order["paymentStatus"],
          items: order.items,
          payment: order.payment ? {
            ...order.payment,
            status: order.payment.status as "PENDING" | "SUCCESS" | "FAILED" | "REVERSED",
          } : null,
        };
      }
    } catch {
      // fallback
    }
  }
  return memoryStore.orders.find((o) => o.id === id) || null;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: { items: true, payment: true },
        orderBy: { createdAt: "desc" },
      });
      return orders.map((o) => ({
        ...o,
        status: o.status as Order["status"],
        paymentStatus: o.paymentStatus as Order["paymentStatus"],
        items: o.items,
        payment: o.payment ? {
          ...o.payment,
          status: o.payment.status as "PENDING" | "SUCCESS" | "FAILED" | "REVERSED",
        } : null,
      }));
    } catch {
      // fallback
    }
  }
  return memoryStore.orders.filter((o) => o.userId === userId);
}

export async function getAllOrders(): Promise<Order[]> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const orders = await prisma.order.findMany({
        include: { items: true, payment: true },
        orderBy: { createdAt: "desc" },
      });
      return orders.map((o) => ({
        ...o,
        status: o.status as Order["status"],
        paymentStatus: o.paymentStatus as Order["paymentStatus"],
        items: o.items,
        payment: o.payment ? {
          ...o.payment,
          status: o.payment.status as "PENDING" | "SUCCESS" | "FAILED" | "REVERSED",
        } : null,
      }));
    } catch {
      // fallback
    }
  }
  return memoryStore.orders;
}

export async function updateOrderPaymentSuccess({
  reference,
  paystackId,
  channel,
  amount,
}: {
  reference: string;
  paystackId?: string;
  channel?: string;
  amount: number;
}): Promise<Order | null> {
  const order = await getOrderByReference(reference);
  if (!order) return null;

  // Idempotency check: if already marked paid, return current order
  if (order.paymentStatus === "SUCCESS" && order.status === "PAID") {
    return order;
  }

  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const updated = await prisma.order.update({
        where: { paymentReference: reference },
        data: {
          status: "PAID",
          paymentStatus: "SUCCESS",
          payment: {
            upsert: {
              create: {
                reference,
                paystackId,
                amount,
                channel,
                status: "SUCCESS",
                paidAt: new Date(),
              },
              update: {
                paystackId,
                status: "SUCCESS",
                channel,
                paidAt: new Date(),
              },
            },
          },
        },
        include: { items: true, payment: true },
      });

      // Safely decrement inventory in DB
      for (const item of updated.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return {
        ...updated,
        status: updated.status as Order["status"],
        paymentStatus: updated.paymentStatus as Order["paymentStatus"],
        items: updated.items,
        payment: updated.payment ? {
          ...updated.payment,
          status: updated.payment.status as "PENDING" | "SUCCESS" | "FAILED" | "REVERSED",
        } : null,
      };
    } catch (e) {
      console.warn("Prisma payment update fallback:", e);
    }
  }

  // Memory update
  order.status = "PAID";
  order.paymentStatus = "SUCCESS";
  order.payment = {
    id: `pay-${Date.now()}`,
    orderId: order.id,
    reference,
    paystackId,
    amount,
    currency: "GHS",
    status: "SUCCESS",
    channel,
    paidAt: new Date().toISOString(),
  };

  // Decrement inventory in memory
  for (const item of order.items) {
    const prod = memoryStore.products.find((p) => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
      if (prod.stock === 0) prod.inStock = false;
    }
  }

  return order;
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order | null> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      const updated = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: { items: true, payment: true },
      });
      return {
        ...updated,
        status: updated.status as Order["status"],
        paymentStatus: updated.paymentStatus as Order["paymentStatus"],
        items: updated.items,
        payment: updated.payment ? {
          ...updated.payment,
          status: updated.payment.status as "PENDING" | "SUCCESS" | "FAILED" | "REVERSED",
        } : null,
      };
    } catch {
      // fallback
    }
  }

  const order = memoryStore.orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
  }
  return order || null;
}

// ========================
// PRODUCT ADMIN OPERATIONS
// ========================

export async function createProduct(productData: Omit<Product, "id">): Promise<Product> {
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
  };

  const useDb = await checkPostgres();
  if (useDb) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { category, ...prismaData } = newProduct;
      const created = await prisma.product.create({
        data: prismaData,
        include: { category: true },
      });
      return created;
    } catch {
      // fallback
    }
  }

  memoryStore.products.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { category, ...prismaUpdateData } = productData;
      const updated = await prisma.product.update({
        where: { id },
        data: prismaUpdateData,
        include: { category: true },
      });
      return updated;
    } catch {
      // fallback
    }
  }

  const index = memoryStore.products.findIndex((p) => p.id === id);
  if (index !== -1) {
    memoryStore.products[index] = { ...memoryStore.products[index], ...productData };
    return memoryStore.products[index];
  }
  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const useDb = await checkPostgres();
  if (useDb) {
    try {
      await prisma.product.delete({ where: { id } });
      return true;
    } catch {
      // fallback
    }
  }

  const index = memoryStore.products.findIndex((p) => p.id === id);
  if (index !== -1) {
    memoryStore.products.splice(index, 1);
    return true;
  }
  return false;
}
