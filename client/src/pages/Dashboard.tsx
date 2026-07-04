import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Task, Godparent, BudgetItem } from "@shared/schema";
import { CheckCircle2, Circle, Star, Heart, TrendingUp } from "lucide-react";

const CATEGORY_EMOJI: Record<string, string> = {
  attire: "👗", venue: "🏛️", music: "🎵", catering: "🍽️",
  decor: "🌸", photo: "📸", other: "✨",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getMiniCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function formatDate(d: string) {
  const dt = new Date(d + "T12:00:00");
  return `${MONTHS[dt.getMonth()]} ${dt.getDate()}`;
}

export default function Dashboard() {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    queryFn: () => apiRequest("GET", "/api/tasks").then(r => r.json()),
  });
  const { data: godparents = [] } = useQuery<Godparent[]>({
    queryKey: ["/api/godparents"],
    queryFn: () => apiRequest("GET", "/api/godparents").then(r => r.json()),
  });
  const { data: budget = [] } = useQuery<BudgetItem[]>({
    queryKey: ["/api/budget"],
    queryFn: () => apiRequest("GET", "/api/budget").then(r => r.json()),
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalPledged = godparents.reduce((s, g) => s + g.pledgeAmount, 0);
  const totalPaid = godparents.reduce((s, g) => s + g.paidAmount, 0);
  const fundingPct = totalPledged > 0 ? Math.round((totalPaid / totalPledged) * 100) : 0;

  const totalBudget = budget.reduce((s, b) => s + b.estimatedCost, 0);
  const totalSpent = budget.reduce((s, b) => s + b.actualCost, 0);

  const upcoming = tasks
    .filter(t => !t.completed && t.dueDate)
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
    .slice(0, 5);

  const calYear = 2026, calMonth = 11; // Dec
  const taskDatesSet = new Set(tasks.map(t => t.dueDate).filter(Boolean) as string[]);
  const { firstDay, daysInMonth } = getMiniCalendarDays(calYear, calMonth);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      {/* Hero header */}
      <div style={{
        background: "linear-gradient(135deg, hsl(340,55%,62%) 0%, hsl(42,80%,62%) 60%, hsl(340,55%,72%) 100%)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-10) var(--space-8)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
      }}>
        <div style={{ position:"absolute", right:-40, top:-40, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }}/>
        <div style={{ position:"absolute", right:60, bottom:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <p style={{ fontSize:"var(--text-sm)", opacity:0.85, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"var(--space-2)" }}>
            🌸 Welcome to the Planning Portal
          </p>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-2xl)", fontWeight:900, lineHeight:1.1, marginBottom:"var(--space-3)" }}>
            Sofia's Quinceañera
          </h1>
          <p style={{ fontSize:"var(--text-base)", opacity:0.9 }}>
            December 26, 2026 · Light pink dress — already done ✓
          </p>
          <div style={{ marginTop:"var(--space-6)", display:"flex", gap:"var(--space-6)", flexWrap:"wrap" }}>
            <StatChip label="Tasks completed" value={`${completedTasks}/${totalTasks}`} />
            <StatChip label="Funds received" value={`${fundingPct}%`} />
            <StatChip label="Godparents" value={String(godparents.length)} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"var(--space-4)" }}>
        <KpiCard
          icon={<CheckCircle2 size={22} color="hsl(340,55%,62%)"/>}
          label="Overall Progress"
          value={`${progressPct}%`}
          sub={`${completedTasks} of ${totalTasks} tasks done`}
          pct={progressPct}
        />
        <KpiCard
          icon={<Heart size={22} color="hsl(42,80%,55%)"/>}
          label="Funds Raised"
          value={`$${totalPaid.toLocaleString()}`}
          sub={`of $${totalPledged.toLocaleString()} pledged`}
          pct={fundingPct}
          goldBar
        />
        <KpiCard
          icon={<TrendingUp size={22} color="hsl(200,60%,50%)"/>}
          label="Budget Spent"
          value={`$${totalSpent.toLocaleString()}`}
          sub={`of $${totalBudget.toLocaleString()} estimated`}
          pct={totalBudget > 0 ? Math.round((totalSpent/totalBudget)*100) : 0}
          blueBar
        />
        <KpiCard
          icon={<Star size={22} color="hsl(280,60%,60%)"/>}
          label="Dress Status"
          value="✓ Done"
          sub="Light pink dress"
          pct={100}
          purpleBar
        />
      </div>

      {/* Calendar + Upcoming */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--space-6)" }}>
        {/* Mini calendar Dec 2026 */}
        <div className="card-lift" style={{
          background:"var(--color-surface)",
          border:"1px solid var(--color-border)",
          borderRadius:"var(--radius-xl)",
          padding:"var(--space-6)",
          boxShadow:"var(--shadow-sm)",
        }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-lg)", fontWeight:700, marginBottom:"var(--space-4)", color:"var(--color-primary)" }}>
            📅 December 2026
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, textAlign:"center" }}>
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <div key={i} style={{ fontSize:"var(--text-xs)", fontWeight:600, color:"var(--color-text-muted)", paddingBottom:4 }}>{d}</div>
            ))}
            {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`}/>)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `2026-12-${String(day).padStart(2,"0")}`;
              const isParty = day === 26;
              const hasTask = taskDatesSet.has(dateStr);
              return (
                <div key={day} style={{
                  aspectRatio:"1",
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                  borderRadius:isParty ? "50%" : hasTask ? "var(--radius-sm)" : undefined,
                  background: isParty ? "hsl(340,55%,62%)" : hasTask ? "hsl(42,80%,62%,0.2)" : "transparent",
                  color: isParty ? "white" : "var(--color-text)",
                  fontSize:"var(--text-xs)",
                  fontWeight: isParty ? 700 : 400,
                  position:"relative",
                }}>
                  {day}
                  {isParty && <span style={{ position:"absolute", bottom:-8, left:"50%", transform:"translateX(-50%)", fontSize:8 }}>🎉</span>}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:"var(--space-4)", display:"flex", gap:"var(--space-3)", flexWrap:"wrap" }}>
            <Legend color="hsl(340,55%,62%)" label="Party day" />
            <Legend color="hsl(42,80%,62%,0.5)" label="Task due" />
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="card-lift" style={{
          background:"var(--color-surface)",
          border:"1px solid var(--color-border)",
          borderRadius:"var(--radius-xl)",
          padding:"var(--space-6)",
          boxShadow:"var(--shadow-sm)",
        }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-lg)", fontWeight:700, marginBottom:"var(--space-4)", color:"var(--color-primary)" }}>
            ⏰ Upcoming Tasks
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-3)" }}>
            {upcoming.length === 0 && (
              <p style={{ color:"var(--color-text-muted)", fontSize:"var(--text-sm)" }}>All tasks complete! 🎊</p>
            )}
            {upcoming.map(t => (
              <div key={t.id} style={{
                display:"flex", alignItems:"center", gap:"var(--space-3)",
                padding:"var(--space-3)", borderRadius:"var(--radius-md)",
                background:"var(--color-surface-offset)", border:"1px solid var(--color-border)",
              }}>
                <span style={{ fontSize:18 }}>{CATEGORY_EMOJI[t.category] || "✨"}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"var(--text-sm)", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>
                  <div style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)" }}>
                    {t.dueDate ? formatDate(t.dueDate) : "No date set"}
                  </div>
                </div>
                <Circle size={16} color="var(--color-text-faint)"/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Completed tasks */}
      <div style={{
        background:"var(--color-surface)",
        border:"1px solid var(--color-border)",
        borderRadius:"var(--radius-xl)",
        padding:"var(--space-6)",
        boxShadow:"var(--shadow-sm)",
      }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-lg)", fontWeight:700, marginBottom:"var(--space-4)", color:"var(--color-primary)" }}>
          ✅ Completed Milestones
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"var(--space-3)" }}>
          {tasks.filter(t => t.completed).map(t => (
            <div key={t.id} style={{
              display:"flex", alignItems:"center", gap:"var(--space-2)",
              padding:"var(--space-3)", borderRadius:"var(--radius-md)",
              background:"hsl(142,40%,90%)", border:"1px solid hsl(142,30%,78%)",
            }}>
              <CheckCircle2 size={16} color="hsl(142,50%,40%)" style={{ flexShrink:0 }}/>
              <span style={{ fontSize:"var(--text-sm)", color:"hsl(142,30%,25%)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</span>
            </div>
          ))}
          {tasks.filter(t => t.completed).length === 0 && (
            <p style={{ color:"var(--color-text-muted)", fontSize:"var(--text-sm)" }}>No tasks marked complete yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:"var(--radius-lg)", padding:"var(--space-3) var(--space-4)" }}>
      <div style={{ fontSize:"var(--text-lg)", fontWeight:800 }}>{value}</div>
      <div style={{ fontSize:"var(--text-xs)", opacity:0.85 }}>{label}</div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub, pct, goldBar, blueBar, purpleBar }:
  { icon: React.ReactNode; label: string; value: string; sub: string; pct: number; goldBar?: boolean; blueBar?: boolean; purpleBar?: boolean }) {
  const barColor = goldBar ? "hsl(42,80%,55%)" : blueBar ? "hsl(200,60%,50%)" : purpleBar ? "hsl(280,60%,60%)" : "hsl(340,55%,62%)";
  return (
    <div className="card-lift" style={{
      background:"var(--color-surface)",
      border:"1px solid var(--color-border)",
      borderRadius:"var(--radius-xl)",
      padding:"var(--space-5)",
      boxShadow:"var(--shadow-sm)",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"var(--space-3)" }}>
        <div>{icon}</div>
        <div style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
      </div>
      <div style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-xl)", fontWeight:800, color:"var(--color-text)", marginBottom:"var(--space-1)" }}>{value}</div>
      <div style={{ fontSize:"var(--text-xs)", color:"var(--color-text-muted)", marginBottom:"var(--space-3)" }}>{sub}</div>
      <div style={{ height:6, background:"var(--color-surface-offset)", borderRadius:"var(--radius-full)", overflow:"hidden" }}>
        <div style={{
          height:"100%",
          width:`${Math.min(100,pct)}%`,
          background:barColor,
          borderRadius:"var(--radius-full)",
          transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
        }}/>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"var(--space-1)", fontSize:"var(--text-xs)", color:"var(--color-text-muted)" }}>
      <div style={{ width:10, height:10, borderRadius:"50%", background:color }}/>
      {label}
    </div>
  );
}
