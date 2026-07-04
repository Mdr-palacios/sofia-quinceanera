import { useEffect, useState } from "react";

interface Petal { id: number; left: number; size: number; duration: number; delay: number; color: string; }

const COLORS = ["#f9c8dc", "#f5c842", "#e8a0b0", "#fce4ec", "#ffe0b2"];

export default function Petals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 10 + 8,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * -15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setPetals(initial);
  }, []);

  return (
    <>
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" width={p.size} height={p.size}>
            <ellipse cx="12" cy="12" rx="6" ry="10" fill={p.color} opacity="0.6" transform="rotate(30 12 12)"/>
          </svg>
        </div>
      ))}
    </>
  );
}
