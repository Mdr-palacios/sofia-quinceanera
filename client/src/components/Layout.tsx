import { Link, useLocation } from "wouter";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, LayoutDashboard, CheckSquare, Users, DollarSign } from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Checklist", icon: CheckSquare },
  { href: "/godparents", label: "Padrinos", icon: Users },
  { href: "/budget", label: "Presupuesto", icon: DollarSign },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <div style={{ display: "flex", minHeight: "100dvh", position: "relative", zIndex: 1 }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        padding: "var(--space-6)",
        gap: "var(--space-4)",
        position: "sticky",
        top: 0,
        height: "100dvh",
        boxShadow: "var(--shadow-md)",
      }}>
        {/* Logo */}
        <div style={{ marginBottom: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
            <svg aria-label="Sofia Quinceañera Logo" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="17" fill="hsl(340,55%,62%)" />
              <text x="18" y="23" textAnchor="middle" fontSize="18" fontFamily="serif" fill="white" fontWeight="bold">S</text>
              <circle cx="28" cy="8" r="5" fill="hsl(42,80%,62%)" />
              <path d="M26 8 L28 6 L30 8 L28 10 Z" fill="white" />
            </svg>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--color-primary)", lineHeight: 1.1 }}>
                Sofía
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                XV Años · 26 Dic
              </div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", flex: 1 }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <a data-testid={`nav-${label.toLowerCase()}`} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  fontWeight: active ? 600 : 400,
                  fontSize: "var(--text-sm)",
                  color: active ? "var(--color-primary)" : "var(--color-text-muted)",
                  background: active ? "hsl(340 55% 62% / 0.1)" : "transparent",
                  border: active ? "1px solid hsl(340 55% 62% / 0.2)" : "1px solid transparent",
                  textDecoration: "none",
                  transition: "all 0.18s ease",
                }}>
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {label}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Countdown */}
        <CountdownBadge />

        {/* Theme toggle */}
        <button
          onClick={toggle}
          data-testid="button-theme-toggle"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            background: "var(--color-surface-offset)",
            border: "1px solid var(--color-border)",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {theme === "dark" ? <Sun size={14}/> : <Moon size={14}/>}
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1,
        padding: "var(--space-8)",
        maxWidth: "100%",
        overflowX: "hidden",
        minHeight: "100dvh",
      }}>
        {children}
      </main>
    </div>
  );
}

function CountdownBadge() {
  const party = new Date("2026-12-26T00:00:00");
  const now = new Date();
  const diff = party.getTime() - now.getTime();
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  return (
    <div style={{
      background: "linear-gradient(135deg, hsl(340,55%,62%), hsl(42,80%,62%))",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-4)",
      textAlign: "center",
      color: "white",
    }}>
      <div style={{ fontSize: "var(--text-xl)", fontFamily: "var(--font-display)", fontWeight: 900, lineHeight: 1 }}>
        {days}
      </div>
      <div style={{ fontSize: "var(--text-xs)", opacity: 0.9, marginTop: 2 }}>días restantes</div>
      <div style={{ fontSize: "var(--text-xs)", opacity: 0.75, marginTop: 2 }}>🎉 26 Dic 2026</div>
    </div>
  );
}
