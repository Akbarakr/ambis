import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

// Re-export auth models
export * from "./models/auth";

// Students table for mobile/OTP auth
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  mobile: text("mobile").notNull().unique(),
  email: text("email"),
  name: text("name"),
  otp: text("otp"),
  otpExpiry: timestamp("otp_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admins table for mobile/password auth
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  mobile: text("mobile").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStudentSchema = createInsertSchema(students).omit({ id: true, createdAt: true, otp: true, otpExpiry: true });
export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true });

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // using decimal for money
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References auth.users.id (which is varchar)
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // cod, gpay
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  priceAtTime: decimal("price_at_time", { precision: 10, scale: 2 }).notNull(),
});

// Relations
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Schemas
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true, paymentStatus: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Complex Types for API
export type CreateOrderRequest = {
  items: { productId: number; quantity: number }[];
  paymentMethod: 'cod' | 'gpay';
};

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};
