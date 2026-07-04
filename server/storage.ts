import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { tasks, godparents, budgetItems } from "@shared/schema";
import type { Task, InsertTask, Godparent, InsertGodparent, BudgetItem, InsertBudgetItem } from "@shared/schema";
import { eq } from "drizzle-orm";

const sqlite = new Database("data.db");
export const db = drizzle(sqlite);

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    due_date TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    assigned_to TEXT,
    notes TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS godparents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    pledge_amount REAL NOT NULL DEFAULT 0,
    paid_amount REAL NOT NULL DEFAULT 0,
    color TEXT NOT NULL DEFAULT '#e8a0b0'
  );

  CREATE TABLE IF NOT EXISTS budget_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    estimated_cost REAL NOT NULL DEFAULT 0,
    actual_cost REAL NOT NULL DEFAULT 0,
    paid INTEGER NOT NULL DEFAULT 0,
    godparent_id INTEGER
  );
`);

// Seed default data if empty
const taskCount = db.select().from(tasks).all().length;
if (taskCount === 0) {
  const defaultTasks: InsertTask[] = [
    { title: "Comprar el vestido", category: "attire", dueDate: "2026-07-01", completed: true, assignedTo: "Familia", notes: "Vestido rosa claro — ¡ya listo!", sortOrder: 1 },
    { title: "Reservar el salón de eventos", category: "venue", dueDate: "2026-08-15", completed: false, assignedTo: null, notes: null, sortOrder: 2 },
    { title: "Contratar DJ / Banda", category: "music", dueDate: "2026-09-01", completed: false, assignedTo: null, notes: null, sortOrder: 3 },
    { title: "Elegir menú con el catering", category: "catering", dueDate: "2026-09-15", completed: false, assignedTo: null, notes: null, sortOrder: 4 },
    { title: "Invitaciones impresas", category: "other", dueDate: "2026-10-01", completed: false, assignedTo: null, notes: null, sortOrder: 5 },
    { title: "Contratar fotógrafo / videógrafo", category: "photo", dueDate: "2026-09-01", completed: false, assignedTo: null, notes: null, sortOrder: 6 },
    { title: "Decoración del salón", category: "decor", dueDate: "2026-11-01", completed: false, assignedTo: null, notes: null, sortOrder: 7 },
    { title: "Ensayo de vals y coreografía", category: "other", dueDate: "2026-11-15", completed: false, assignedTo: null, notes: null, sortOrder: 8 },
    { title: "Arreglo floral y bouquet", category: "decor", dueDate: "2026-11-01", completed: false, assignedTo: null, notes: null, sortOrder: 9 },
    { title: "Maquillaje y peinado", category: "attire", dueDate: "2026-12-01", completed: false, assignedTo: null, notes: null, sortOrder: 10 },
    { title: "Pastel de quinceañera", category: "catering", dueDate: "2026-12-10", completed: false, assignedTo: null, notes: null, sortOrder: 11 },
    { title: "Cotización de limousina / transporte", category: "venue", dueDate: "2026-10-15", completed: false, assignedTo: null, notes: null, sortOrder: 12 },
    { title: "Lista de invitados final", category: "other", dueDate: "2026-11-01", completed: false, assignedTo: null, notes: null, sortOrder: 13 },
    { title: "Accesorios y tiara", category: "attire", dueDate: "2026-11-15", completed: false, assignedTo: null, notes: null, sortOrder: 14 },
    { title: "Misa religiosa — confirmar fecha", category: "other", dueDate: "2026-08-01", completed: false, assignedTo: null, notes: null, sortOrder: 15 },
  ];
  for (const t of defaultTasks) {
    db.insert(tasks).values(t).run();
  }
}

const godparentCount = db.select().from(godparents).all().length;
if (godparentCount === 0) {
  const defaultGodparents: InsertGodparent[] = [
    { name: "Tía Rosa & Tío Carlos", role: "Padrinos de Vestido", email: "", phone: "", pledgeAmount: 8000, paidAmount: 8000, color: "#e8a0b0" },
    { name: "Familia González", role: "Padrinos de Salón", email: "", phone: "", pledgeAmount: 15000, paidAmount: 5000, color: "#f5c842" },
    { name: "Madrina Lupita", role: "Madrina de Pastel", email: "", phone: "", pledgeAmount: 3500, paidAmount: 0, color: "#c084fc" },
    { name: "Padrino Roberto", role: "Padrino de Música", email: "", phone: "", pledgeAmount: 6000, paidAmount: 3000, color: "#60a5fa" },
    { name: "Familia Herrera", role: "Padrinos de Recuerdos", email: "", phone: "", pledgeAmount: 4000, paidAmount: 4000, color: "#34d399" },
  ];
  for (const g of defaultGodparents) {
    db.insert(godparents).values(g).run();
  }
}

const budgetCount = db.select().from(budgetItems).all().length;
if (budgetCount === 0) {
  const defaultBudget: InsertBudgetItem[] = [
    { category: "attire", description: "Vestido de quinceañera", estimatedCost: 8000, actualCost: 8000, paid: true, godparentId: 1 },
    { category: "venue", description: "Salón de eventos", estimatedCost: 15000, actualCost: 0, paid: false, godparentId: 2 },
    { category: "catering", description: "Catering / banquete", estimatedCost: 12000, actualCost: 0, paid: false, godparentId: null },
    { category: "music", description: "DJ y sistema de sonido", estimatedCost: 6000, actualCost: 0, paid: false, godparentId: 4 },
    { category: "photo", description: "Fotografía y video", estimatedCost: 7000, actualCost: 0, paid: false, godparentId: null },
    { category: "decor", description: "Decoración y flores", estimatedCost: 5000, actualCost: 0, paid: false, godparentId: null },
    { category: "catering", description: "Pastel de quinceañera", estimatedCost: 3500, actualCost: 0, paid: false, godparentId: 3 },
    { category: "other", description: "Invitaciones", estimatedCost: 2000, actualCost: 0, paid: false, godparentId: null },
    { category: "attire", description: "Accesorios y tiara", estimatedCost: 2500, actualCost: 0, paid: false, godparentId: null },
    { category: "other", description: "Recuerdos / souvenirs", estimatedCost: 4000, actualCost: 4000, paid: true, godparentId: 5 },
  ];
  for (const b of defaultBudget) {
    db.insert(budgetItems).values(b).run();
  }
}

// ── Storage Interface ──────────────────────────────────────────────────────
export interface IStorage {
  // Tasks
  getTasks(): Task[];
  createTask(task: InsertTask): Task;
  updateTask(id: number, data: Partial<InsertTask>): Task | undefined;
  deleteTask(id: number): void;

  // Godparents
  getGodparents(): Godparent[];
  createGodparent(g: InsertGodparent): Godparent;
  updateGodparent(id: number, data: Partial<InsertGodparent>): Godparent | undefined;
  deleteGodparent(id: number): void;

  // Budget
  getBudgetItems(): BudgetItem[];
  createBudgetItem(item: InsertBudgetItem): BudgetItem;
  updateBudgetItem(id: number, data: Partial<InsertBudgetItem>): BudgetItem | undefined;
  deleteBudgetItem(id: number): void;
}

export const storage: IStorage = {
  getTasks: () => db.select().from(tasks).all(),
  createTask: (task) => db.insert(tasks).values(task).returning().get(),
  updateTask: (id, data) => db.update(tasks).set(data).where(eq(tasks.id, id)).returning().get(),
  deleteTask: (id) => { db.delete(tasks).where(eq(tasks.id, id)).run(); },

  getGodparents: () => db.select().from(godparents).all(),
  createGodparent: (g) => db.insert(godparents).values(g).returning().get(),
  updateGodparent: (id, data) => db.update(godparents).set(data).where(eq(godparents.id, id)).returning().get(),
  deleteGodparent: (id) => { db.delete(godparents).where(eq(godparents.id, id)).run(); },

  getBudgetItems: () => db.select().from(budgetItems).all(),
  createBudgetItem: (item) => db.insert(budgetItems).values(item).returning().get(),
  updateBudgetItem: (id, data) => db.update(budgetItems).set(data).where(eq(budgetItems.id, id)).returning().get(),
  deleteBudgetItem: (id) => { db.delete(budgetItems).where(eq(budgetItems.id, id)).run(); },
};
