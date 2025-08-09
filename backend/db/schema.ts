import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const todoTable = pgTable("todo", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  profile_url: varchar("profile_url", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  isDone: boolean("is_done").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const ownerTable = pgTable("owner", {
  id: varchar("id", { length: 50 }).primaryKey(),
  Name: varchar("name", { length: 255 }).notNull(),
  course_id: varchar("course_id", { length: 20 }).notNull(),
  section: varchar("section", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});
