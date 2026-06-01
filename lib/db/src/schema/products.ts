import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  version: text("version").notNull(),
  status: text("status").notNull().default("Active"),
  features: text("features").array().notNull().default([]),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  apkUrl: text("apk_url"),
  githubUrl: text("github_url"),
  telegramUrl: text("telegram_url"),
  screenshot1Url: text("screenshot1_url"),
  screenshot2Url: text("screenshot2_url"),
  screenshot3Url: text("screenshot3_url"),
  screenshot4Url: text("screenshot4_url"),
  accentColor: text("accent_color").notNull().default("bg-violet-600"),
  publishedState: text("published_state").notNull().default("published"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
