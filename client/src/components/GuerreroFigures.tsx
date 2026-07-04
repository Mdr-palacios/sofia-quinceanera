// Guerrero-inspired Nahua/Mixtec geometric figures at 8–10% opacity
// as decorative background elements
export default function GuerreroFigures() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Figure 1 — top left — Guerrero warrior silhouette */}
      <div className="guerrero-figure" style={{ top: "5%", left: "-2%", width: 180 }}>
        <svg viewBox="0 0 120 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Headdress */}
          <path d="M60 10 L45 35 L35 20 L50 40 L40 50 L60 30 L80 50 L70 40 L85 20 L75 35 Z" fill="#c97fa0"/>
          <circle cx="60" cy="55" r="12" fill="#c97fa0"/>
          {/* Body */}
          <rect x="45" y="67" width="30" height="50" rx="4" fill="#c97fa0"/>
          {/* Skirt with Guerrero geometric diamonds */}
          <path d="M40 117 L80 117 L90 160 L30 160 Z" fill="#c97fa0"/>
          <path d="M55 120 L65 120 L70 135 L60 140 L50 135 Z" fill="#f9e4ec"/>
          <path d="M42 140 L52 135 L57 150 L47 155 Z" fill="#f9e4ec"/>
          <path d="M68 135 L78 140 L73 155 L63 150 Z" fill="#f9e4ec"/>
          {/* Arms */}
          <line x1="45" y1="75" x2="25" y2="100" stroke="#c97fa0" strokeWidth="8" strokeLinecap="round"/>
          <line x1="75" y1="75" x2="95" y2="100" stroke="#c97fa0" strokeWidth="8" strokeLinecap="round"/>
          {/* Legs */}
          <line x1="50" y1="160" x2="45" y2="195" stroke="#c97fa0" strokeWidth="8" strokeLinecap="round"/>
          <line x1="70" y1="160" x2="75" y2="195" stroke="#c97fa0" strokeWidth="8" strokeLinecap="round"/>
          {/* Geometric border detail */}
          <path d="M30 160 L35 165 L40 160 L45 165 L50 160 L55 165 L60 160 L65 165 L70 160 L75 165 L80 160 L85 165 L90 160" stroke="#f5c842" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      {/* Figure 2 — bottom right — Mixtec sun / calendar disc */}
      <div className="guerrero-figure" style={{ bottom: "8%", right: "-3%", width: 200, animationDelay: "-3s" }}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="#c97fa0" strokeWidth="3" fill="none"/>
          <circle cx="100" cy="100" r="60" stroke="#f5c842" strokeWidth="2" fill="none"/>
          <circle cx="100" cy="100" r="30" fill="#c97fa0"/>
          {/* Sun rays */}
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i * 360) / 16 * Math.PI / 180;
            const x1 = 100 + 62 * Math.cos(a);
            const y1 = 100 + 62 * Math.sin(a);
            const x2 = 100 + 78 * Math.cos(a);
            const y2 = 100 + 78 * Math.sin(a);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c97fa0" strokeWidth="3"/>;
          })}
          {/* Inner geometric cross */}
          <path d="M100 70 L110 90 L130 100 L110 110 L100 130 L90 110 L70 100 L90 90 Z" fill="#f5c842" opacity="0.6"/>
          {/* Center face */}
          <circle cx="100" cy="100" r="12" fill="#f9e4ec"/>
          <circle cx="96" cy="98" r="2" fill="#c97fa0"/>
          <circle cx="104" cy="98" r="2" fill="#c97fa0"/>
          <path d="M95 104 Q100 108 105 104" stroke="#c97fa0" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      {/* Figure 3 — mid right — Guerrero dancer */}
      <div className="guerrero-figure" style={{ top: "35%", right: "1%", width: 120, animationDelay: "-6s" }}>
        <svg viewBox="0 0 80 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Feather headdress */}
          <path d="M40 5 L30 25 L20 15 L35 30 L25 40 L40 25 L55 40 L45 30 L60 15 L50 25 Z" fill="#f5c842"/>
          <circle cx="40" cy="45" r="10" fill="#c97fa0"/>
          {/* Body */}
          <rect x="28" y="55" width="24" height="35" rx="3" fill="#c97fa0"/>
          {/* Skirt */}
          <path d="M24 90 L56 90 L62 125 L18 125 Z" fill="#c97fa0"/>
          {/* Geometric diamond pattern on skirt */}
          <path d="M36 93 L44 93 L48 103 L40 108 L32 103 Z" fill="#f9e4ec"/>
          {/* Arms raised in dance */}
          <line x1="28" y1="63" x2="10" y2="45" stroke="#c97fa0" strokeWidth="6" strokeLinecap="round"/>
          <line x1="52" y1="63" x2="70" y2="45" stroke="#c97fa0" strokeWidth="6" strokeLinecap="round"/>
          {/* Legs */}
          <line x1="34" y1="125" x2="28" y2="152" stroke="#c97fa0" strokeWidth="6" strokeLinecap="round"/>
          <line x1="46" y1="125" x2="52" y2="152" stroke="#c97fa0" strokeWidth="6" strokeLinecap="round"/>
          {/* Gold border detail */}
          <path d="M18 125 L22 130 L26 125 L30 130 L34 125 L38 130 L42 125 L46 130 L50 125 L54 130 L58 125 L62 130" stroke="#f5c842" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
    </div>
  );
}
