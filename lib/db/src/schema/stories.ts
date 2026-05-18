import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const successStoriesTable = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  quote: text("quote").notNull(),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSuccessStorySchema = createInsertSchema(successStoriesTable).omit({ id: true, createdAt: true });
export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;
export type SuccessStory = typeof successStoriesTable.$inferSelect;
