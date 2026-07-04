import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Tasks / Checklist ──────────────────────────────────────────────────────
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'venue','attire','music','catering','decor','photo','other'
  dueDate: text("due_date"),            // ISO date string
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  assignedTo: text("assigned_to"),      // godparent name
  notes: text("notes"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// ── Godparents / Padrinos ──────────────────────────────────────────────────
export const godparents = sqliteTable("godparents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),         // e.g. "Padrino de Vestido", "Madrina de Música"
  email: text("email"),
  phone: text("phone"),
  pledgeAmount: real("pledge_amount").notNull().default(0),
  paidAmount: real("paid_amount").notNull().default(0),
  color: text("color").notNull().default("#e8a0b0"),
});

export const insertGodparentSchema = createInsertSchema(godparents).omit({ id: true });
export type InsertGodparent = z.infer<typeof insertGodparentSchema>;
export type Godparent = typeof godparents.$inferSelect;

// ── Budget items ───────────────────────────────────────────────────────────
export const budgetItems = sqliteTable("budget_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  description: text("description").notNull(),
  estimatedCost: real("estimated_cost").notNull().default(0),
  actualCost: real("actual_cost").notNull().default(0),
  paid: integer("paid", { mode: "boolean" }).notNull().default(false),
  godparentId: integer("godparent_id"),
});

export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({ id: true });
export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type BudgetItem = typeof budgetItems.$inferSelect;
