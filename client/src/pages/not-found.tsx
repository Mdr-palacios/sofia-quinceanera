import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:"var(--space-4)", textAlign:"center" }}>
      <div style={{ fontSize:64 }}>🎀</div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-xl)", fontWeight:800 }}>Page not found</h1>
      <p style={{ color:"var(--color-text-muted)" }}>This page doesn't exist in Sofia's planning portal.</p>
      <Link href="/">
        <a style={{ padding:"var(--space-3) var(--space-6)", borderRadius:"var(--radius-lg)", background:"var(--color-primary)", color:"white", fontWeight:600, textDecoration:"none" }}>
          Back to dashboard
        </a>
      </Link>
    </div>
  );
}
