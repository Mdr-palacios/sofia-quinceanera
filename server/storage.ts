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
    { title: "Buy the dress",                         category: "attire",   dueDate: "2026-07-01", completed: true,  assignedTo: "Family",   notes: "Light pink dress — already done!",           sortOrder: 1  },
    { title: "Confirm church / ceremony date",        category: "other",    dueDate: "2026-08-01", completed: false, assignedTo: null,        notes: "Reach out to the parish to reserve the date", sortOrder: 2  },
    { title: "Book the event venue",                  category: "venue",    dueDate: "2026-08-15", completed: false, assignedTo: null,        notes: "Get contract and deposit amount",              sortOrder: 3  },
    { title: "Hire DJ / Band",                        category: "music",    dueDate: "2026-09-01", completed: false, assignedTo: null,        notes: "Ask for playlist input from Sofia",            sortOrder: 4  },
    { title: "Book photographer & videographer",      category: "photo",    dueDate: "2026-09-01", completed: false, assignedTo: null,        notes: "Include Quince photo session + event coverage", sortOrder: 5  },
    { title: "Schedule quinceañera photo session",    category: "photo",    dueDate: "2026-09-15", completed: false, assignedTo: null,        notes: "Coordinate with photographer, select outfit",  sortOrder: 6  },
    { title: "Choose catering menu",                  category: "catering", dueDate: "2026-09-15", completed: false, assignedTo: null,        notes: "Taste testing + confirm guest count",          sortOrder: 7  },
    { title: "Design & print invitations",            category: "other",    dueDate: "2026-10-01", completed: false, assignedTo: null,        notes: "Send out at least 8 weeks before the event",   sortOrder: 8  },
    { title: "Hire security team",                    category: "venue",    dueDate: "2026-10-01", completed: false, assignedTo: null,        notes: "Confirm number of guards for venue capacity",  sortOrder: 9  },
    { title: "Book limo / transportation",            category: "venue",    dueDate: "2026-10-15", completed: false, assignedTo: null,        notes: "For Sofia and chambelanes",                    sortOrder: 10 },
    { title: "Finalize guest list",                   category: "other",    dueDate: "2026-11-01", completed: false, assignedTo: null,        notes: "Confirm RSVPs and dietary restrictions",       sortOrder: 11 },
    { title: "Venue decoration & floral setup",       category: "decor",    dueDate: "2026-11-01", completed: false, assignedTo: null,        notes: "Blush pink & gold theme — centerpieces, arch", sortOrder: 12 },
    { title: "Waltz & chambelanes choreography",      category: "other",    dueDate: "2026-11-15", completed: false, assignedTo: null,        notes: "Weekly rehearsals starting October",           sortOrder: 13 },
    { title: "Hair, makeup & accessories",            category: "attire",   dueDate: "2026-12-01", completed: false, assignedTo: null,        notes: "Trial run before event day",                  sortOrder: 14 },
    { title: "Order quinceañera cake",                category: "catering", dueDate: "2026-12-10", completed: false, assignedTo: null,        notes: "Confirm flavor, design, and delivery time",   sortOrder: 15 },
  ];
  for (const t of defaultTasks) {
    db.insert(tasks).values(t).run();
  }
}

const godparentCount = db.select().from(godparents).all().length;
if (godparentCount === 0) {
  const defaultGodparents: InsertGodparent[] = [
    { name: "Bianca Shaw",        role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#e8a0b0" },
    { name: "Amber Sherman",      role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#f5c842" },
    { name: "Selam G.",           role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#c084fc" },
    { name: "Jennifer Rencones",  role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#60a5fa" },
    { name: "Dr. Monica Brown",   role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#34d399" },
    { name: "Lana",               role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#fb923c" },
    { name: "Isabel O.",          role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#a78bfa" },
    { name: "Brian Nuñez",        role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#38bdf8" },
    { name: "Andres Parra",       role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#4ade80" },
    { name: "Lorena Quiroz",      role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#f472b6" },
    { name: "Dr. Robert Robinson",role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#fbbf24" },
    { name: "Christian Bello",    role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#e8a0b0" },
    { name: "Paul Glaze",         role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#6ee7b7" },
    { name: "Genny Castillo",     role: "Padrino", email: "", phone: "", pledgeAmount: 0, paidAmount: 0, color: "#f9a8d4" },
  ];
  for (const g of defaultGodparents) {
    db.insert(godparents).values(g).run();
  }
}

const budgetCount = db.select().from(budgetItems).all().length;
if (budgetCount === 0) {
  const defaultBudget: InsertBudgetItem[] = [
    { category: "venue",    description: "Event venue rental",               estimatedCost: 15000, actualCost: 0,    paid: false, godparentId: null },
    { category: "photo",    description: "Photography & videography",         estimatedCost: 7000,  actualCost: 0,    paid: false, godparentId: null },
    { category: "photo",    description: "Quinceañera photo session / studio", estimatedCost: 2500,  actualCost: 0,    paid: false, godparentId: null },
    { category: "music",    description: "DJ & sound system",                 estimatedCost: 6000,  actualCost: 0,    paid: false, godparentId: null },
    { category: "catering", description: "Catering & banquet service",        estimatedCost: 12000, actualCost: 0,    paid: false, godparentId: null },
    { category: "catering", description: "Quinceañera cake",                  estimatedCost: 3500,  actualCost: 0,    paid: false, godparentId: null },
    { category: "venue",    description: "Security team",                     estimatedCost: 2000,  actualCost: 0,    paid: false, godparentId: null },
    { category: "other",    description: "Invitations design & printing",     estimatedCost: 1800,  actualCost: 0,    paid: false, godparentId: null },
    { category: "attire",   description: "Quinceañera dress",                 estimatedCost: 8000,  actualCost: 8000, paid: true,  godparentId: null },
    { category: "decor",    description: "Floral arrangements & venue decor", estimatedCost: 5000,  actualCost: 0,    paid: false, godparentId: null },
  ];
  for (const b of defaultBudget) {
    db.insert(budgetItems).values(b).run();
  }
}

// ── Storage Interface ──────────────────────────────────────────────────────
export interface IStorage {
  getTasks(): Task[];
  createTask(task: InsertTask): Task;
  updateTask(id: number, data: Partial<InsertTask>): Task | undefined;
  deleteTask(id: number): void;

  getGodparents(): Godparent[];
  createGodparent(g: InsertGodparent): Godparent;
  updateGodparent(id: number, data: Partial<InsertGodparent>): Godparent | undefined;
  deleteGodparent(id: number): void;

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
