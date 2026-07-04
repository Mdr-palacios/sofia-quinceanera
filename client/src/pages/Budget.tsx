import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BudgetItem, InsertBudgetItem } from "@shared/schema";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { key:"attire",   label:"Attire",      emoji:"👗", color:"hsl(340,55%,62%)" },
  { key:"venue",    label:"Venue",       emoji:"🏛️", color:"hsl(220,70%,55%)" },
  { key:"music",    label:"Music",       emoji:"🎵", color:"hsl(280,60%,60%)" },
  { key:"catering", label:"Catering",   emoji:"🍽️", color:"hsl(25,80%,55%)"  },
  { key:"decor",    label:"Décor",       emoji:"🌸", color:"hsl(330,60%,65%)" },
  { key:"photo",    label:"Photo/Video", emoji:"📸", color:"hsl(200,65%,50%)" },
  { key:"other",    label:"Other",       emoji:"✨", color:"hsl(160,50%,45%)" },
];

export default function Budget() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<InsertBudgetItem>>({ category:"other", estimatedCost:0, actualCost:0, paid:false });

  const { data: items = [], isLoading } = useQuery<BudgetItem[]>({
    queryKey: ["/api/budget"],
    queryFn: () => apiRequest("GET", "/api/budget").then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertBudgetItem) => apiRequest("POST", "/api/budget", data).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budget"] });
      setShowForm(false);
      setForm({ category:"other", estimatedCost:0, actualCost:0, paid:false });
      toast({ title: "Expense added 💰" });
    },
  });

  const togglePaidMutation = useMutation({
    mutationFn: ({ id, paid }: { id:number; paid:boolean }) =>
      apiRequest("PATCH", `/api/budget/${id}`, { paid }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/budget"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id:number) => apiRequest("DELETE", `/api/budget/${id}`).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/budget"] }),
  });

  const totalEst   = items.reduce((s,i) => s + i.estimatedCost, 0);
  const totalAct   = items.reduce((s,i) => s + i.actualCost, 0);
  const totalPaid  = items.filter(i => i.paid).reduce((s,i) => s + i.actualCost, 0);
  const pct        = totalEst > 0 ? Math.min(100, Math.round((totalAct/totalEst)*100)) : 0;

  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    items: items.filter(i => i.category === cat.key),
    total: items.filter(i => i.category === cat.key).reduce((s,i) => s + i.estimatedCost, 0),
    spent: items.filter(i => i.category === cat.key).reduce((s,i) => s + i.actualCost, 0),
  })).filter(g => g.items.length > 0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-6)" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"var(--space-4)" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-xl)", fontWeight:800, color:"var(--color-text)" }}>
            Budget Tracker 💸
          </h1>
          <p style={{ fontSize:"var(--text-sm)", color:"var(--color-text-muted)", marginTop:"var(--space-1)" }}>
            Track estimated vs actual costs
          </p>
        </div>
        <button
          data-testid="button-add-budget"
          onClick={() => setShowForm(v => !v)}
          style={{
            display:"flex", alignItems:"center", gap:"var(--space-2)",
            padding:"var(--space-3) var(--space-5)", borderRadius:"var(--radius-lg)",
            background:"var(--color-primary)", color:"white", fontWeight:600, fontSize:"var(--text-sm)",
          }}
        >
          <Plus size={16}/> Add expense
        </button>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"var(--space-4)" }}>
        {[
          { label:"Total budget",    value:`$${totalEst.toLocaleString()}`,              color:"var(--color-text)"          },
          { label:"Actual cost",     value:`$${totalAct.toLocaleString()}`,              color:"hsl(340,55%,62%)"           },
          { label:"Paid",            value:`$${totalPaid.toLocaleString()}`,             color:"hsl(142,50%,40%)"           },
          { label:"Still owed",      value:`$${(totalAct-totalPaid).toLocaleString()}`,  color:"hsl(42,80%,45%)"            },
        ].map(s => (
          <div key={s.label} className="card-lift" style={{
            background:"var(--color-surface)", border:"1px solid var(--color-border)",
            borderRadius:"var(--radius-xl)", padding:"var(--space-5)", boxShadow:"var(--shadow-sm)",
          }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-xl)", fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)", marginTop:"var(--space-1)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Budget progress */}
      <div style={{
        background:"var(--color-surface)", border:"1px solid var(--color-border)",
        borderRadius:"var(--radius-xl)", padding:"var(--space-6)", boxShadow:"var(--shadow-sm)",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"var(--space-3)" }}>
          <span style={{ fontSize:"var(--text-sm)", fontWeight:600 }}>Budget used</span>
          <span style={{ fontSize:"var(--text-sm)", fontWeight:700, color:"var(--color-primary)" }}>{pct}%</span>
        </div>
        <div style={{ height:14, background:"var(--color-surface-offset)", borderRadius:"var(--radius-full)", overflow:"hidden" }}>
          <div style={{
            height:"100%", width:`${pct}%`,
            background:"linear-gradient(90deg, hsl(340,55%,62%), hsl(42,80%,62%))",
            borderRadius:"var(--radius-full)", transition:"width 0.8s ease",
          }}/>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"var(--space-3)", marginTop:"var(--space-4)" }}>
          {CATEGORIES.map(cat => {
            const catItems = items.filter(i => i.category === cat.key);
            if (!catItems.length) return null;
            const catTotal = catItems.reduce((s,i) => s + i.estimatedCost, 0);
            const catPct = totalEst > 0 ? Math.round((catTotal/totalEst)*100) : 0;
            return (
              <div key={cat.key} style={{ display:"flex", alignItems:"center", gap:6, fontSize:"var(--text-xs)", color:"var(--color-text-muted)" }}>
                <div style={{ width:10, height:10, borderRadius:2, background:cat.color, flexShrink:0 }}/>
                {cat.emoji} {cat.label} <strong style={{ color:"var(--color-text)" }}>{catPct}%</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{
          background:"var(--color-surface)", border:"2px solid hsl(340,55%,62%,0.3)",
          borderRadius:"var(--radius-xl)", padding:"var(--space-6)", boxShadow:"var(--shadow-md)",
        }}>
          <h3 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-lg)", fontWeight:700, marginBottom:"var(--space-4)", color:"var(--color-primary)" }}>
            New Expense
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--space-4)" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={labelStyle}>Description *</label>
              <input data-testid="input-budget-desc" value={form.description||""} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
                placeholder="e.g. Floral arrangements..." style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select data-testid="select-budget-cat" value={form.category||"other"} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={inputStyle}>
                {CATEGORIES.map(c=><option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Estimated Cost ($)</label>
              <input data-testid="input-budget-est" type="number" value={form.estimatedCost||0}
                onChange={e=>setForm(f=>({...f,estimatedCost:Number(e.target.value)}))} style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Actual Cost ($)</label>
              <input data-testid="input-budget-act" type="number" value={form.actualCost||0}
                onChange={e=>setForm(f=>({...f,actualCost:Number(e.target.value)}))} style={inputStyle}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:"var(--space-3)", marginTop:"var(--space-5)" }}>
            <button data-testid="button-submit-budget" onClick={()=>{
              if(!form.description) return;
              createMutation.mutate(form as InsertBudgetItem);
            }} style={{ padding:"var(--space-3) var(--space-6)", borderRadius:"var(--radius-md)", background:"var(--color-primary)", color:"white", fontWeight:600, fontSize:"var(--text-sm)" }}>
              {createMutation.isPending?"Saving...":"Save"}
            </button>
            <button onClick={()=>setShowForm(false)} style={{ padding:"var(--space-3) var(--space-6)", borderRadius:"var(--radius-md)", background:"var(--color-surface-offset)", color:"var(--color-text-muted)", fontWeight:600, fontSize:"var(--text-sm)", border:"1px solid var(--color-border)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grouped items */}
      {isLoading ? (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-4)" }}>
          {[1,2,3].map(i=><div key={i} style={{ height:100, background:"var(--color-surface-offset)", borderRadius:"var(--radius-xl)" }}/>)}
        </div>
      ) : grouped.length === 0 ? (
        <div style={{ textAlign:"center", padding:"var(--space-12)", color:"var(--color-text-muted)", fontSize:"var(--text-sm)" }}>
          No expenses recorded yet
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-5)" }}>
          {grouped.map(cat => (
            <div key={cat.key} style={{
              background:"var(--color-surface)", border:"1px solid var(--color-border)",
              borderRadius:"var(--radius-xl)", overflow:"hidden", boxShadow:"var(--shadow-sm)",
            }}>
              <div style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"var(--space-4) var(--space-5)", background:cat.color, color:"white",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:"var(--space-2)", fontWeight:700 }}>
                  <span>{cat.emoji}</span> {cat.label}
                </div>
                <div style={{ fontSize:"var(--text-sm)" }}>
                  <span style={{ opacity:0.8 }}>Est: </span>${cat.total.toLocaleString()}
                  {cat.spent > 0 && <span> · <span style={{ opacity:0.8 }}>Actual: </span>${cat.spent.toLocaleString()}</span>}
                </div>
              </div>
              {cat.items.map(item => (
                <div key={item.id} data-testid={`row-budget-${item.id}`} style={{
                  display:"flex", alignItems:"center", gap:"var(--space-3)",
                  padding:"var(--space-4) var(--space-5)", borderBottom:"1px solid var(--color-border)",
                }}>
                  <button data-testid={`button-toggle-paid-${item.id}`}
                    onClick={()=>togglePaidMutation.mutate({id:item.id,paid:!item.paid})}
                    style={{ color: item.paid ? "hsl(142,50%,40%)" : "var(--color-text-faint)", flexShrink:0 }}>
                    {item.paid ? <CheckCircle2 size={20}/> : <Circle size={20}/>}
                  </button>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"var(--text-sm)", fontWeight:500, textDecoration: item.paid ? "line-through" : "none", color: item.paid ? "var(--color-text-muted)" : "var(--color-text)" }}>
                      {item.description}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:"var(--text-sm)", fontWeight:600 }}>${item.estimatedCost.toLocaleString()}</div>
                    {item.actualCost > 0 && <div style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)" }}>actual: ${item.actualCost.toLocaleString()}</div>}
                  </div>
                  {item.paid && (
                    <span style={{ fontSize:"var(--text-xs)", padding:"2px 8px", borderRadius:"var(--radius-full)", background:"hsl(142,40%,90%)", color:"hsl(142,30%,30%)", fontWeight:600, flexShrink:0 }}>
                      Paid
                    </span>
                  )}
                  <button data-testid={`button-delete-budget-${item.id}`} onClick={()=>deleteMutation.mutate(item.id)} style={{ color:"var(--color-text-faint)", opacity:0.5, flexShrink:0 }}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display:"block", fontSize:"var(--text-xs)", fontWeight:600, marginBottom:"var(--space-1)",
  color:"var(--color-text-muted)", textTransform:"uppercase" as const, letterSpacing:"0.05em",
};
const inputStyle: React.CSSProperties = {
  width:"100%", padding:"var(--space-3)", borderRadius:"var(--radius-md)",
  border:"1px solid var(--color-border)", background:"var(--color-surface-offset)",
  fontSize:"var(--text-sm)",
};
