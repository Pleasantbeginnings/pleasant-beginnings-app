import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const galleryTable = pgTable("gallery", {
  id: serial("id").primaryKey(),
  objectPath: text("object_path").notNull(),
  caption: text("caption").notNull().default(""),
  category: text("category").notNull().default("General"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type GalleryImage = typeof galleryTable.$inferSelect;
export type InsertGalleryImage = typeof galleryTable.$inferInsert;
