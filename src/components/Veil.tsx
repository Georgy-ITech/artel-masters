"use client";

import { useEffect, useRef, useState } from "react";
import { onTextureProgress, textureProgress } from "@/lib/textures";

/**
 * Процент собирается из двух настоящих сигналов: готовности шрифтов и доли
 * загруженных обложек (`THREE.LoadingManager` отдаёт реальные loaded/total).
 * Показанное значение никогда не обгоняет загруженное.
 */
export function Veil({
  sceneReady,
  onDone,
}: {
  sceneReady: boolean;
  onDone: () => void;
}) {
  const [shown, setShown] = useState(0);
  const [reached, setReached] = useState(false);
  const [released, setReleased] = useState(false);
  const done = reached || released;

  const fonts = useRef(false);
  const value = useRef(0);
  const textures = useRef(0);

  useEffect(() => {
    const ready =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready
        : Promise.resolve();
    ready.then(() => {
      fonts.current = true;
    });
    textures.current = textureProgress();
    return onTextureProgress(() => {
      textures.current = textureProgress();
    });
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const goal =
        (fonts.current ? 25 : 0) +
        textures.current * 65 +
        (sceneReady ? 10 : 0);
      value.current += (goal - value.current) * 0.2;
      const rounded = Math.min(Math.floor(value.current + 0.5), Math.round(goal));
      setShown(rounded);
      if (rounded >= 100) {
        setReached(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sceneReady]);

  // страница не должна остаться за завесой, если сцена не собралась
  useEffect(() => {
    const t = window.setTimeout(() => setReleased(true), 7000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = done ? "" : "hidden";
    if (done) onDone();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [done, onDone]);

  return (
    <div
      className="veil"
      data-done={done}
      role="status"
      aria-live="polite"
      aria-label={done ? "Загружено" : `Загрузка ${shown} процентов`}
    >
      <div className="veil__inner">
        <p className="veil__count">{shown}%</p>
        <span className="veil__bar">
          <span
            className="veil__fill"
            style={{ transform: `scaleX(${shown / 100})` }}
          />
        </span>
        <p className="veil__word">Артель</p>
      </div>
    </div>
  );
}
