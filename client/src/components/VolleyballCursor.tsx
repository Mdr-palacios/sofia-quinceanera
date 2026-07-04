import { useEffect, useRef } from "react";

export default function VolleyballCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    let x = -100, y = -100;
    let angle = 0;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      angle += 4;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    };

    const down = () => el.classList.add("clicking");
    const up = () => el.classList.remove("clicking");

    document.addEventListener("mousemove", move);
    document.addEventListener("mousedown", down);
    document.addEventListener("mouseup", up);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousedown", down);
      document.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <div id="volleyball-cursor" ref={cursorRef}>
      {/* Volleyball SVG */}
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#f9e4ec" stroke="#c97fa0" strokeWidth="1.5"/>
        {/* Panel lines */}
        <path d="M 16 2 C 10 6 6 11 6 16" fill="none" stroke="#c97fa0" strokeWidth="1.2"/>
        <path d="M 16 2 C 22 6 26 11 26 16" fill="none" stroke="#c97fa0" strokeWidth="1.2"/>
        <path d="M 6 16 C 6 22 10 26 16 30" fill="none" stroke="#c97fa0" strokeWidth="1.2"/>
        <path d="M 26 16 C 26 22 22 26 16 30" fill="none" stroke="#c97fa0" strokeWidth="1.2"/>
        <path d="M 2 14 C 5 10 10 8 16 8 C 22 8 27 10 30 14" fill="none" stroke="#e8b4c8" strokeWidth="1"/>
        <path d="M 2 18 C 5 22 10 24 16 24 C 22 24 27 22 30 18" fill="none" stroke="#e8b4c8" strokeWidth="1"/>
        {/* Gold shimmer dot */}
        <circle cx="16" cy="16" r="2" fill="#f5c842" opacity="0.7"/>
      </svg>
    </div>
  );
}
