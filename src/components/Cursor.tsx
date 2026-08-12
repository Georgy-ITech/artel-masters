"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Свой курсор с подписью — только там, где есть настоящая мышь.
 * Нативный курсор не прячем: он остаётся ориентиром, метка идёт рядом.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || motion.matches) return;
    setOn(true);

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const shown = { ...pos };
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      setLabel(target?.getAttribute("data-cursor") ?? "");
    };

    const loop = () => {
      shown.x += (pos.x - shown.x) * 0.18;
      shown.y += (pos.y - shown.y) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${shown.x}px, ${shown.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!on) return null;

  return (
    <div className="cursor" ref={dot} aria-hidden="true">
      <span className="cursor__label" data-shown={label !== ""}>
        {label}
      </span>
    </div>
  );
}
