import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Godparent, InsertGodparent } from "@shared/schema";
import { Plus, Trash2, Users, Heart, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ROLE_OPTIONS = [
  "Dress Sponsors",
  "Venue Sponsors",
  "Cake Sponsors",
  "Music Sponsors",
  "Photo & Video Sponsors",
  "Décor Sponsors",
  "Keepsake Sponsors",
  "Invitation Sponsors",
  "Catering Sponsors",
  "Other",
];

const COLORS = ["#e8a0b0","#f5c842","#c084fc","#60a5fa","#34d399","#f97316","#a78bfa","#fb7185"];

export default function Godparents() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<InsertGodparent>>({ color: COLORS[0], pledgeAmount: 0, paidAmount: 0 });

  const { data: godparents = [], isLoading } = useQuery<Godparent[]>({
    queryKey: ["/api/godparents"],
    queryFn: () => apiRequest("GET", "/api/godparents").then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertGodparent) => apiRequest("POST", "/api/godparents", data).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/godparents"] });
      setShowForm(false);
      setForm({ color: COLORS[0], pledgeAmount: 0, paidAmount: 0 });
      toast({ title: "Godparent added 💖", description: "Successfully registered" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertGodparent> }) =>
      apiRequest("PATCH", `/api/godparents/${id}`, data).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/godparents"] });
      toast({ title: "Updated ✓" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/godparents/${id}`).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/godparents"] }),
  });

  const totalPledged = godparents.reduce((s, g) => s + g.pledgeAmount, 0);
  const totalPaid = godparents.reduce((s, g) => s + g.paidAmount, 0);
  const pct = totalPledged > 0 ? Math.round((totalPaid / totalPledged) * 100) : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-6)" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"var(--space-4)" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-xl)", fontWeight:800, color:"var(--color-text)" }}>
            Godparents 💖
          </h1>
          <p style={{ fontSize:"var(--text-sm)", color:"var(--color-text-muted)", marginTop:"var(--space-1)" }}>
            Track contributions from family and friends
          </p>
        </div>
        <button
          data-testid="button-add-godparent"
          onClick={() => setShowForm(v => !v)}
          style={{
            display:"flex", alignItems:"center", gap:"var(--space-2)",
            padding:"var(--space-3) var(--space-5)", borderRadius:"var(--radius-lg)",
            background:"var(--color-primary)", color:"white", fontWeight:600, fontSize:"var(--text-sm)",
          }}
        >
          <Plus size={16}/> Add godparent
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"var(--space-4)" }}>
        <SummaryCard icon={<Users size={20} color="hsl(340,55%,62%)"/>} label="Total godparents" value={String(godparents.length)} />
        <SummaryCard icon={<Heart size={20} color="hsl(42,80%,55%)"/>} label="Total pledged" value={`$${totalPledged.toLocaleString()}`} gold />
        <SummaryCard icon={<TrendingUp size={20} color="hsl(142,50%,40%)"/>} label="Received" value={`$${totalPaid.toLocaleString()}`} green />
        <SummaryCard icon={<span style={{ fontSize:20 }}>💰</span>} label="Still pending" value={`$${(totalPledged - totalPaid).toLocaleString()}`} />
      </div>

      {/* Progress */}
      <div style={{
        background:"var(--color-surface)", border:"1px solid var(--color-border)",
        borderRadius:"var(--radius-xl)", padding:"var(--space-6)", boxShadow:"var(--shadow-sm)",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"var(--space-3)" }}>
          <span style={{ fontSize:"var(--text-sm)", fontWeight:600 }}>Funds collected</span>
          <span style={{ fontSize:"var(--text-sm)", fontWeight:700, color:"var(--color-primary)" }}>{pct}%</span>
        </div>
        <div style={{ height:14, background:"var(--color-surface-offset)", borderRadius:"var(--radius-full)", overflow:"hidden" }}>
          <div style={{
            height:"100%", width:`${Math.min(100,pct)}%`,
            background:"linear-gradient(90deg, hsl(340,55%,62%), hsl(42,80%,62%))",
            borderRadius:"var(--radius-full)", transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
          }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"var(--space-2)" }}>
          <span style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)" }}>$0</span>
          <span style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)" }}>${totalPledged.toLocaleString()}</span>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{
          background:"var(--color-surface)", border:"2px solid hsl(340,55%,62%,0.3)",
          borderRadius:"var(--radius-xl)", padding:"var(--space-6)", boxShadow:"var(--shadow-md)",
        }}>
          <h3 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-lg)", fontWeight:700, marginBottom:"var(--space-4)", color:"var(--color-primary)" }}>
            New Godparent
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--space-4)" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={labelStyle}>Name *</label>
              <input data-testid="input-godparent-name" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                placeholder="e.g. Aunt Rosa & Uncle Carlos" style={inputStyle}/>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={labelStyle}>Sponsorship Role</label>
              <select data-testid="select-godparent-role" value={form.role||""} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={inputStyle}>
                <option value="">Select a role...</option>
                {ROLE_OPTIONS.map(r=><option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Amount Pledged ($)</label>
              <input data-testid="input-godparent-pledge" type="number" value={form.pledgeAmount||0}
                onChange={e=>setForm(f=>({...f,pledgeAmount:Number(e.target.value)}))} style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Amount Received ($)</label>
              <input data-testid="input-godparent-paid" type="number" value={form.paidAmount||0}
                onChange={e=>setForm(f=>({...f,paidAmount:Number(e.target.value)}))} style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input data-testid="input-godparent-email" type="email" value={form.email||""} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                placeholder="email@example.com" style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input data-testid="input-godparent-phone" value={form.phone||""} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                placeholder="+1 ..." style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Color</label>
              <div style={{ display:"flex", gap:"var(--space-2)", marginTop:"var(--space-1)" }}>
                {COLORS.map(c=>(
                  <button key={c} onClick={()=>setForm(f=>({...f,color:c}))} style={{
                    width:28, height:28, borderRadius:"50%", background:c, flexShrink:0,
                    border: form.color===c ? "3px solid var(--color-text)" : "2px solid transparent",
                  }}/>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:"var(--space-3)", marginTop:"var(--space-5)" }}>
            <button data-testid="button-submit-godparent" onClick={()=>{
              if(!form.name||!form.role) return;
              createMutation.mutate(form as InsertGodparent);
            }} style={{ padding:"var(--space-3) var(--space-6)", borderRadius:"var(--radius-md)", background:"var(--color-primary)", color:"white", fontWeight:600, fontSize:"var(--text-sm)" }}>
              {createMutation.isPending?"Saving...":"Save"}
            </button>
            <button onClick={()=>setShowForm(false)} style={{ padding:"var(--space-3) var(--space-6)", borderRadius:"var(--radius-md)", background:"var(--color-surface-offset)", color:"var(--color-text-muted)", fontWeight:600, fontSize:"var(--text-sm)", border:"1px solid var(--color-border)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Godparent cards */}
      {isLoading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"var(--space-4)" }}>
          {[1,2,3].map(i=><div key={i} style={{ height:180, background:"var(--color-surface-offset)", borderRadius:"var(--radius-xl)" }}/>)}
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"var(--space-4)" }}>
          {godparents.map(g=>(
            <GodparentCard key={g.id} godparent={g}
              onDelete={()=>deleteMutation.mutate(g.id)}
              onUpdatePaid={(paid)=>updateMutation.mutate({id:g.id, data:{paidAmount:paid}})}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GodparentCard({ godparent: g, onDelete, onUpdatePaid }:
  { godparent: Godparent; onDelete:()=>void; onUpdatePaid:(p:number)=>void }) {
  const [editingPaid, setEditingPaid] = useState(false);
  const [paidVal, setPaidVal] = useState(String(g.paidAmount));
  const pct = g.pledgeAmount > 0 ? Math.min(100, Math.round((g.paidAmount/g.pledgeAmount)*100)) : 0;

  return (
    <div data-testid={`card-godparent-${g.id}`} className="card-lift" style={{
      background:"var(--color-surface)", border:"1px solid var(--color-border)",
      borderRadius:"var(--radius-xl)", overflow:"hidden", boxShadow:"var(--shadow-sm)",
    }}>
      <div style={{ height:8, background:g.color }}/>
      <div style={{ padding:"var(--space-5)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"var(--space-3)" }}>
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-lg)", fontWeight:700, color:"var(--color-text)", lineHeight:1.2 }}>{g.name}</div>
            <div style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)", marginTop:"var(--space-1)" }}>{g.role}</div>
          </div>
          <div style={{ width:36, height:36, borderRadius:"50%", background:g.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
            💝
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--space-3)", marginBottom:"var(--space-4)" }}>
          <div style={{ textAlign:"center", padding:"var(--space-3)", background:"var(--color-surface-offset)", borderRadius:"var(--radius-md)" }}>
            <div style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)", marginBottom:2 }}>Pledged</div>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"var(--color-text)" }}>${g.pledgeAmount.toLocaleString()}</div>
          </div>
          <div onClick={()=>setEditingPaid(true)} style={{ textAlign:"center", padding:"var(--space-3)", background:"hsl(142,40%,90%)", borderRadius:"var(--radius-md)", cursor:"pointer" }}>
            <div style={{ fontSize:"var(--text-xs)", color:"hsl(142,30%,35%)", marginBottom:2 }}>Received ✏️</div>
            {editingPaid ? (
              <input autoFocus type="number" value={paidVal}
                onChange={e=>setPaidVal(e.target.value)}
                onBlur={()=>{ onUpdatePaid(Number(paidVal)); setEditingPaid(false); }}
                onKeyDown={e=>{ if(e.key==="Enter"){ onUpdatePaid(Number(paidVal)); setEditingPaid(false); }}}
                style={{ width:"100%", background:"transparent", border:"none", textAlign:"center", fontFamily:"var(--font-display)", fontWeight:700, fontSize:"var(--text-sm)", color:"hsl(142,30%,25%)" }}
              />
            ) : (
              <div style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"hsl(142,30%,25%)" }}>${g.paidAmount.toLocaleString()}</div>
            )}
          </div>
        </div>

        <div style={{ marginBottom:"var(--space-4)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"var(--space-1)" }}>
            <span style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)" }}>Progress</span>
            <span style={{ fontSize:"var(--text-xs)", fontWeight:600, color: pct===100?"hsl(142,50%,40%)" : "var(--color-text-muted)" }}>{pct}%</span>
          </div>
          <div style={{ height:8, background:"var(--color-surface-offset)", borderRadius:"var(--radius-full)", overflow:"hidden" }}>
            <div style={{
              height:"100%", width:`${pct}%`,
              background: pct===100 ? "hsl(142,50%,40%)" : g.color,
              borderRadius:"var(--radius-full)", transition:"width 0.8s ease",
            }}/>
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)" }}>
            {g.email && <span>✉️ {g.email}</span>}
            {!g.email && g.phone && <span>📞 {g.phone}</span>}
          </div>
          <button data-testid={`button-delete-godparent-${g.id}`} onClick={onDelete} style={{ color:"var(--color-text-faint)", opacity:0.5 }}>
            <Trash2 size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, gold, green }:
  { icon:React.ReactNode; label:string; value:string; gold?:boolean; green?:boolean }) {
  return (
    <div className="card-lift" style={{
      background:"var(--color-surface)", border:"1px solid var(--color-border)",
      borderRadius:"var(--radius-xl)", padding:"var(--space-5)", boxShadow:"var(--shadow-sm)",
    }}>
      <div style={{ marginBottom:"var(--space-2)" }}>{icon}</div>
      <div style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-xl)", fontWeight:800,
        color: gold ? "hsl(42,80%,45%)" : green ? "hsl(142,50%,35%)" : "var(--color-text)" }}>
        {value}
      </div>
      <div style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)", marginTop:"var(--space-1)" }}>{label}</div>
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
