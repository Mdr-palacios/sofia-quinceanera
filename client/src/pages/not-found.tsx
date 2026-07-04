import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:"var(--space-4)", textAlign:"center" }}>
      <div style={{ fontSize:64 }}>🎀</div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:"var(--text-xl)", fontWeight:800 }}>Página no encontrada</h1>
      <p style={{ color:"var(--color-text-muted)" }}>Esta página no existe en el portal de la quinceañera.</p>
      <Link href="/">
        <a style={{ padding:"var(--space-3) var(--space-6)", borderRadius:"var(--radius-lg)", background:"var(--color-primary)", color:"white", fontWeight:600, textDecoration:"none" }}>
          Volver al inicio
        </a>
      </Link>
    </div>
  );
}
