import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertGodparentSchema, insertBudgetItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // ── Tasks ────────────────────────────────────────────────────────────────
  app.get("/api/tasks", (_req, res) => {
    res.json(storage.getTasks());
  });

  app.post("/api/tasks", (req, res) => {
    const parsed = insertTaskSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    res.json(storage.createTask(parsed.data));
  });

  app.patch("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = storage.updateTask(id, req.body);
    if (!task) return res.status(404).json({ error: "Not found" });
    res.json(task);
  });

  app.delete("/api/tasks/:id", (req, res) => {
    storage.deleteTask(Number(req.params.id));
    res.json({ ok: true });
  });

  // ── Godparents ───────────────────────────────────────────────────────────
  app.get("/api/godparents", (_req, res) => {
    res.json(storage.getGodparents());
  });

  app.post("/api/godparents", (req, res) => {
    const parsed = insertGodparentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    res.json(storage.createGodparent(parsed.data));
  });

  app.patch("/api/godparents/:id", (req, res) => {
    const id = Number(req.params.id);
    const g = storage.updateGodparent(id, req.body);
    if (!g) return res.status(404).json({ error: "Not found" });
    res.json(g);
  });

  app.delete("/api/godparents/:id", (req, res) => {
    storage.deleteGodparent(Number(req.params.id));
    res.json({ ok: true });
  });

  // ── Budget ───────────────────────────────────────────────────────────────
  app.get("/api/budget", (_req, res) => {
    res.json(storage.getBudgetItems());
  });

  app.post("/api/budget", (req, res) => {
    const parsed = insertBudgetItemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    res.json(storage.createBudgetItem(parsed.data));
  });

  app.patch("/api/budget/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = storage.updateBudgetItem(id, req.body);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  });

  app.delete("/api/budget/:id", (req, res) => {
    storage.deleteBudgetItem(Number(req.params.id));
    res.json({ ok: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
