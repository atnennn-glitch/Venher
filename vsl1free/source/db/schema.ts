import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("vsl-popup"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
