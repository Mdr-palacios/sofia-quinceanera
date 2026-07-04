import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Task, InsertTask } from "@shared/schema";
import { CheckCircle2, Circle, Plus, Trash2, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { key: "all", label: "Todas", emoji: "🌸" },
  { key: "attire", label: "Vestimenta", emoji: "👗" },
  { key: "venue", label: "Salón", emoji: "🏛️" },
  { key: "music", label: "Música", emoji: "🎵" },
  { key: "catering", label: "Catering", emoji: "🍽️" },
  { key: "decor", label: "Decoración", emoji: "🌸" },
  { key: "photo", label: "Foto/Video", emoji: "📸" },
  { key: "other", label: "Otros", emoji: "✨" },
];

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function formatDate(d: string) {
  const dt = new Date(d + "T12:00:00");
  return `${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
}

export default function Tasks() {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<InsertTask>>({ category: "other", completed: false, sortOrder: 99 });

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    queryFn: () => apiRequest("GET", "/api/tasks").then(r => r.json()),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      apiRequest("PATCH", `/api/tasks/${id}`, { completed }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/tasks"] }),
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertTask) => apiRequest("POST", "/api/tasks", data).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setShowForm(false);
      setForm({ category: "other", completed: false, sortOrder: 99 });
      toast({ title: "Tarea creada ✨", description: "Nueva tarea añadida al checklist" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/tasks/${id}`).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/tasks"] }),
  });

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.category === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.sortOrder - b.sortOrder;
  });

  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-6)" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"var(--space-4)" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-xl)", fontWeight:800, color:"var(--color-text)" }}>
            Checklist de Planning 📋
          </h1>
          <p style={{ fontSize:"var(--text-sm)", color:"var(--color-text-muted)", marginTop:"var(--space-1)" }}>
            {done} de {total} tareas completadas · {pct}% listo
          </p>
        </div>
        <button
          data-testid="button-add-task"
          onClick={() => setShowForm(v => !v)}
          style={{
            display:"flex", alignItems:"center", gap:"var(--space-2)",
            padding:"var(--space-3) var(--space-5)",
            borderRadius:"var(--radius-lg)",
            background:"var(--color-primary)",
            color:"white", fontWeight:600, fontSize:"var(--text-sm)",
            boxShadow:"var(--shadow-sm)",
          }}
        >
          <Plus size={16}/> Nueva tarea
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ background:"var(--color-surface-offset)", borderRadius:"var(--radius-full)", height:10, overflow:"hidden" }}>
        <div style={{
          height:"100%",
          width:`${pct}%`,
          background:"linear-gradient(90deg, hsl(340,55%,62%), hsl(42,80%,62%))",
          borderRadius:"var(--radius-full)",
          transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
        }}/>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{
          background:"var(--color-surface)",
          border:"2px solid hsl(340,55%,62%,0.3)",
          borderRadius:"var(--radius-xl)",
          padding:"var(--space-6)",
          boxShadow:"var(--shadow-md)",
        }}>
          <h3 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-lg)", fontWeight:700, marginBottom:"var(--space-4)", color:"var(--color-primary)" }}>
            Nueva tarea
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--space-4)" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", fontSize:"var(--text-xs)", fontWeight:600, marginBottom:"var(--space-1)", color:"var(--color-text-muted)", textTransform:"uppercase" }}>
                Título *
              </label>
              <input
                data-testid="input-task-title"
                value={form.title || ""}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="ej. Reservar el salón..."
                style={{
                  width:"100%", padding:"var(--space-3)", borderRadius:"var(--radius-md)",
                  border:"1px solid var(--color-border)", background:"var(--color-surface-offset)",
                  fontSize:"var(--text-sm)",
                }}
              />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"var(--text-xs)", fontWeight:600, marginBottom:"var(--space-1)", color:"var(--color-text-muted)", textTransform:"uppercase" }}>
                Categoría
              </label>
              <select
                data-testid="select-task-category"
                value={form.category || "other"}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{
                  width:"100%", padding:"var(--space-3)", borderRadius:"var(--radius-md)",
                  border:"1px solid var(--color-border)", background:"var(--color-surface-offset)",
                  fontSize:"var(--text-sm)",
                }}
              >
                {CATEGORIES.filter(c => c.key !== "all").map(c => (
                  <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:"var(--text-xs)", fontWeight:600, marginBottom:"var(--space-1)", color:"var(--color-text-muted)", textTransform:"uppercase" }}>
                Fecha límite
              </label>
              <input
                data-testid="input-task-duedate"
                type="date"
                value={form.dueDate || ""}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                style={{
                  width:"100%", padding:"var(--space-3)", borderRadius:"var(--radius-md)",
                  border:"1px solid var(--color-border)", background:"var(--color-surface-offset)",
                  fontSize:"var(--text-sm)",
                }}
              />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", fontSize:"var(--text-xs)", fontWeight:600, marginBottom:"var(--space-1)", color:"var(--color-text-muted)", textTransform:"uppercase" }}>
                Notas
              </label>
              <input
                data-testid="input-task-notes"
                value={form.notes || ""}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Notas adicionales..."
                style={{
                  width:"100%", padding:"var(--space-3)", borderRadius:"var(--radius-md)",
                  border:"1px solid var(--color-border)", background:"var(--color-surface-offset)",
                  fontSize:"var(--text-sm)",
                }}
              />
            </div>
          </div>
          <div style={{ display:"flex", gap:"var(--space-3)", marginTop:"var(--space-5)" }}>
            <button
              data-testid="button-submit-task"
              onClick={() => {
                if (!form.title) return;
                createMutation.mutate(form as InsertTask);
              }}
              style={{
                padding:"var(--space-3) var(--space-6)", borderRadius:"var(--radius-md)",
                background:"var(--color-primary)", color:"white", fontWeight:600, fontSize:"var(--text-sm)",
              }}
            >
              {createMutation.isPending ? "Guardando..." : "Guardar tarea"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding:"var(--space-3) var(--space-6)", borderRadius:"var(--radius-md)",
                background:"var(--color-surface-offset)", color:"var(--color-text-muted)", fontWeight:600, fontSize:"var(--text-sm)",
                border:"1px solid var(--color-border)",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Category filters */}
      <div style={{ display:"flex", gap:"var(--space-2)", flexWrap:"wrap" }}>
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            data-testid={`filter-${c.key}`}
            onClick={() => setFilter(c.key)}
            style={{
              display:"flex", alignItems:"center", gap:"var(--space-1)",
              padding:"var(--space-2) var(--space-4)", borderRadius:"var(--radius-full)",
              fontSize:"var(--text-xs)", fontWeight:600,
              background: filter === c.key ? "var(--color-primary)" : "var(--color-surface)",
              color: filter === c.key ? "white" : "var(--color-text-muted)",
              border: filter === c.key ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
              transition:"all 0.18s ease",
            }}
          >
            {c.emoji} {c.label}
            <span style={{
              marginLeft:"var(--space-1)",
              background: filter === c.key ? "rgba(255,255,255,0.25)" : "var(--color-surface-offset)",
              borderRadius:"var(--radius-full)",
              padding:"1px 6px",
              fontSize:10,
            }}>
              {c.key === "all" ? tasks.length : tasks.filter(t => t.category === c.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      {isLoading ? (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-3)" }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height:72, background:"var(--color-surface-offset)", borderRadius:"var(--radius-lg)", animation:"pulse 1.5s ease infinite" }}/>
          ))}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-3)" }}>
          {sorted.map(task => (
            <TaskRow key={task.id} task={task}
              onToggle={() => toggleMutation.mutate({ id: task.id, completed: !task.completed })}
              onDelete={() => deleteMutation.mutate(task.id)}
            />
          ))}
          {sorted.length === 0 && (
            <div style={{ textAlign:"center", padding:"var(--space-12)", color:"var(--color-text-muted)", fontSize:"var(--text-sm)" }}>
              No hay tareas en esta categoría
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  const CATEGORY_EMOJI: Record<string,string> = {
    attire:"👗", venue:"🏛️", music:"🎵", catering:"🍽️", decor:"🌸", photo:"📸", other:"✨",
  };

  return (
    <div
      data-testid={`row-task-${task.id}`}
      style={{
        display:"flex", alignItems:"center", gap:"var(--space-4)",
        padding:"var(--space-4) var(--space-5)",
        background:"var(--color-surface)",
        border:`1px solid ${task.completed ? "hsl(142,30%,78%)" : "var(--color-border)"}`,
        borderRadius:"var(--radius-lg)",
        boxShadow:"var(--shadow-sm)",
        transition:"all 0.2s ease",
        opacity: task.completed ? 0.7 : 1,
      }}
    >
      <button
        data-testid={`button-toggle-task-${task.id}`}
        onClick={onToggle}
        style={{ flexShrink:0, color: task.completed ? "hsl(142,50%,40%)" : "var(--color-text-faint)" }}
      >
        {task.completed
          ? <CheckCircle2 size={24}/>
          : <Circle size={24}/>
        }
      </button>

      <span style={{ fontSize:20, flexShrink:0 }}>{CATEGORY_EMOJI[task.category] || "✨"}</span>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{
          fontSize:"var(--text-sm)", fontWeight:500,
          textDecoration: task.completed ? "line-through" : "none",
          color: task.completed ? "var(--color-text-muted)" : "var(--color-text)",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
        }}>
          {task.title}
        </div>
        <div style={{ display:"flex", gap:"var(--space-3)", marginTop:"var(--space-1)", flexWrap:"wrap" }}>
          {task.dueDate && (
            <span style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)" }}>
              📅 {formatDate(task.dueDate)}
            </span>
          )}
          {task.assignedTo && (
            <span style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)" }}>
              👤 {task.assignedTo}
            </span>
          )}
          {task.notes && (
            <span style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)", overflow:"hidden", textOverflow:"ellipsis", maxWidth:200 }}>
              💬 {task.notes}
            </span>
          )}
        </div>
      </div>

      {task.completed && (
        <span style={{
          fontSize:"var(--text-xs)", fontWeight:600, padding:"2px 10px",
          borderRadius:"var(--radius-full)",
          background:"hsl(142,40%,90%)", color:"hsl(142,30%,30%)",
          flexShrink:0,
        }}>
          Listo ✓
        </span>
      )}

      <button
        data-testid={`button-delete-task-${task.id}`}
        onClick={onDelete}
        style={{ flexShrink:0, color:"var(--color-text-faint)", opacity:0.5 }}
      >
        <Trash2 size={16}/>
      </button>
    </div>
  );
}
