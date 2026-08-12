"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CARD_H, CARD_W, ServiceCard } from "./ServiceCard";
import type { Service } from "@/data/artel";

type Controls = {
  rotation: number;
  target: number;
  dragging: boolean;
  lastX: number;
  lastMove: number;
  moved: boolean;
  /** Экранная полоса, в которой реально лежат карточки. */
  band: { x0: number; x1: number; y0: number; y1: number } | null;
};

function frontIndexFor(rotation: number, count: number) {
  const step = (Math.PI * 2) / count;
  const raw = Math.round(-rotation / step) % count;
  return (raw + count) % count;
}

function Ring({
  items,
  controls,
  tags,
  hovered,
  frontIndex,
  startAt,
  onFront,
  onHover,
  onOpen,
  onReady,
  reduced,
  compact,
}: {
  items: Service[];
  controls: React.RefObject<Controls>;
  tags: React.RefObject<(HTMLAnchorElement | null)[]>;
  hovered: number | null;
  frontIndex: number;
  startAt: number | null;
  onFront: (i: number) => void;
  onHover: (i: number | null) => void;
  onOpen: (i: number) => void;
  onReady: () => void;
  reduced: boolean;
  compact: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const frames = useRef(0);
  const probe = useMemo(() => new THREE.Vector3(), []);
  const fades = useRef<number[]>([]);
  const speed = useRef(1);

  const step = (Math.PI * 2) / items.length;
  const radius = compact ? 3.2 : 4.3;
  const offsetX = compact ? 0 : 1.2;

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = compact ? 22 : 26;
    cam.position.set(0, compact ? 0.71 : 0.25, radius + (compact ? 14 : 9.2));
    cam.lookAt(0, compact ? 0.71 : 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, compact, radius]);

  const positions = useMemo(
    () =>
      items.map((_, i) => {
        const a = i * step;
        return {
          pos: [Math.sin(a) * radius, 0, Math.cos(a) * radius] as [
            number,
            number,
            number,
          ],
          rot: a,
        };
      }),
    [items, radius, step],
  );

  useFrame((_, delta) => {
    const c = controls.current;
    const g = group.current;
    if (!c || !g) return;

    const d = Math.min(delta, 0.05);

    // Круг не замирает никогда: в полосе карточек он только сбавляет ход,
    // чтобы карточка не уезжала из-под руки. Остальной первый экран свободен.
    const alive = performance.now() - c.lastMove < 1200;
    const goalSpeed = hovered !== null ? 0.6 : alive ? 0.8 : 1;
    speed.current += (goalSpeed - speed.current) * (1 - Math.pow(0.01, d));

    // Рамка считается по тем карточкам, что реально видны, а не по всей
    // геометрии кольца: с боков дальние карточки уже растворились в темноте,
    // и хватать там курсор было бы нечестно.
    const edge = 20;
    const toX = (v: THREE.Vector3) => (v.x * 0.5 + 0.5) * size.width;
    const toY = (v: THREE.Vector3) => (-v.y * 0.5 + 0.5) * size.height;

    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < items.length; i++) {
      const a = i * step + c.rotation;
      if ((Math.cos(a) + 1) / 2 < 0.5) continue; // задняя половина не в счёт
      const cx = Math.sin(a) * radius + offsetX;
      const cz = Math.cos(a) * radius;
      // края карточки с учётом её собственного поворота и перспективы
      for (const s of [-1, 1]) {
        const px = toX(
          probe
            .set(
              cx + s * (CARD_W / 2) * Math.cos(a),
              0,
              cz - s * (CARD_W / 2) * Math.sin(a),
            )
            .project(camera),
        );
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
      }
    }

    c.band = Number.isFinite(minX)
      ? {
          x0: minX - edge,
          x1: maxX + edge,
          y0: toY(probe.set(offsetX, CARD_H / 2, radius).project(camera)) - edge,
          y1:
            toY(probe.set(offsetX, -CARD_H / 2, radius).project(camera)) + edge,
        }
      : null;

    if (!c.dragging) {
      const distance = c.target - c.rotation;
      if (Math.abs(distance) > 0.0005) {
        c.rotation += distance * (reduced ? 1 : 1 - Math.pow(0.002, d));
      } else if (!reduced) {
        c.rotation -= 0.07 * speed.current * d;
        c.target = c.rotation;
      }
    }

    g.rotation.y = c.rotation;

    const nextFront = frontIndexFor(c.rotation, items.length);
    if (nextFront !== frontIndex) onFront(nextFront);

    // подписи остаются словами в DOM, канвас рисует только картинку
    const nodes = compact ? null : tags.current;
    if (nodes) {
      for (let i = 0; i < items.length; i++) {
        const el = nodes[i];
        if (!el) continue;
        const a = i * step + c.rotation;
        probe.set(Math.sin(a) * radius + offsetX, -1.35, Math.cos(a) * radius);
        probe.project(camera);
        const half = el.offsetWidth / 2 + 8;
        const x = Math.min(
          Math.max((probe.x * 0.5 + 0.5) * size.width, half),
          size.width - half,
        );
        const y = (-probe.y * 0.5 + 0.5) * size.height;
        // подпись только у той карточки, что сейчас в фокусе внимания:
        // девять ярлыков разом наезжают друг на друга
        const goal = i === (hovered ?? frontIndex) ? 1 : 0;
        const was = fades.current[i] ?? 0;
        const now = was + (goal - was) * (1 - Math.pow(0.0008, d));
        fades.current[i] = now;
        el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translateX(-50%)`;
        el.style.opacity = now.toFixed(3);
        el.style.pointerEvents = now > 0.5 ? "auto" : "none";
      }
    }

    frames.current += 1;
    if (frames.current === 2) onReady();
  });

  return (
    <group ref={group} position={[offsetX, 0, 0]}>
      {items.map((item, i) => {
        const a = i * step + (controls.current?.rotation ?? 0);
        return (
          <ServiceCard
            key={item.slug}
            src={item.cover}
            active={(hovered ?? frontIndex) === i}
            depth={(Math.cos(a) + 1) / 2}
            startAt={startAt}
            delay={i * 0.06}
            seed={i * 0.137}
            position={positions[i].pos}
            rotationY={positions[i].rot}
            onOver={() => onHover(i)}
            onOut={() => onHover(null)}
            onSelect={() => onOpen(i)}
          />
        );
      })}
    </group>
  );
}

export function ServiceRing({
  items,
  startAt,
  onReady,
}: {
  items: Service[];
  startAt: number | null;
  onReady: () => void;
}) {
  const router = useRouter();
  const [webgl, setWebgl] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [frontIndex, setFrontIndex] = useState(0);
  const tags = useRef<(HTMLAnchorElement | null)[]>([]);
  const controls = useRef<Controls>({
    rotation: 0,
    target: 0,
    dragging: false,
    lastX: 0,
    lastMove: 0,
    moved: false,
    band: null,
  });

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(motion.matches);
    const onMotion = (e: MediaQueryListEvent) => setReduced(e.matches);
    motion.addEventListener("change", onMotion);

    const narrow = window.matchMedia("(max-width: 56.25rem)");
    setCompact(narrow.matches);
    const onNarrow = (e: MediaQueryListEvent) => setCompact(e.matches);
    narrow.addEventListener("change", onNarrow);

    let ok = false;
    try {
      const probe = document.createElement("canvas");
      ok = Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
    } catch {
      ok = false;
    }
    setWebgl(ok);
    if (!ok) onReady();

    return () => {
      motion.removeEventListener("change", onMotion);
      narrow.removeEventListener("change", onNarrow);
    };
  }, [onReady]);

  const rotateTo = useCallback(
    (index: number) => {
      const c = controls.current;
      const step = (Math.PI * 2) / items.length;
      const goal = -index * step;
      const turns = Math.round((c.rotation - goal) / (Math.PI * 2));
      c.target = goal + turns * Math.PI * 2;
    },
    [items.length],
  );

  useEffect(() => {
    if (!compact) return;
    tags.current.forEach((el) => {
      if (!el) return;
      el.style.transform = "";
      el.style.opacity = "";
      el.style.pointerEvents = "";
    });
  }, [compact]);

  const open = useCallback(
    (index: number) => {
      if (controls.current.moved) return;
      router.push(`/uslugi/${items[index].slug}`);
    },
    [items, router],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    const c = controls.current;
    c.dragging = true;
    c.moved = false;
    c.lastX = e.clientX;
    // указатель НЕ захватываем сразу: иначе канвас не получит pointerup
    // и R3F не соберёт клик по карточке. Захват включается, только когда
    // движение переросло в настоящее перетаскивание.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const c = controls.current;

    // ход сбавляется только в полосе, где лежат карточки: остальной
    // первый экран курсор проходит, не трогая круг
    const b = c.band;
    if (b) {
      const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      if (x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1) {
        c.lastMove = performance.now();
      }
    }

    if (!c.dragging) return;
    const dx = e.clientX - c.lastX;
    c.lastX = e.clientX;
    if (Math.abs(dx) > 2 && !c.moved) {
      c.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    c.rotation += dx * 0.005;
    c.target = c.rotation;
  };

  const endDrag = (e: React.PointerEvent) => {
    const c = controls.current;
    if (!c.dragging) return;
    c.dragging = false;
    const host = e.currentTarget as HTMLElement;
    if (host.hasPointerCapture?.(e.pointerId)) {
      host.releasePointerCapture(e.pointerId);
    }
    if (c.moved) rotateTo(frontIndexFor(c.rotation, items.length));
  };

  return (
    <>
      {webgl && (
        <div
          className="ring__canvas"
          data-over={hovered !== null}
          data-cursor={hovered !== null ? "открыть" : "потянуть"}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => setHovered(null)}
        >
          <Canvas
            dpr={[1, 1.75]}
            camera={{ fov: 26, position: [0, 0.25, 13.5] }}
            gl={{ antialias: true, alpha: true }}
          >
            <Ring
              items={items}
              controls={controls}
              tags={tags}
              hovered={hovered}
              frontIndex={frontIndex}
              startAt={startAt}
              onFront={setFrontIndex}
              onHover={setHovered}
              onOpen={open}
              onReady={onReady}
              reduced={reduced}
              compact={compact}
            />
          </Canvas>
        </div>
      )}

      <div
        className={
          !webgl
            ? "ring__tags ring__tags--plain shell"
            : compact
              ? "ring__tags ring__tags--caption"
              : "ring__tags"
        }
      >
        {items.map((item, i) => (
          <Link
            key={item.slug}
            ref={(el) => {
              tags.current[i] = el;
            }}
            href={`/uslugi/${item.slug}`}
            prefetch={false}
            className="ring-tag"
            data-front={frontIndex === i}
            onMouseEnter={() => webgl && setHovered(i)}
            onMouseLeave={() => webgl && setHovered(null)}
            onFocus={() => {
              if (!webgl) return;
              setHovered(i);
              rotateTo(i);
            }}
            onBlur={() => webgl && setHovered(null)}
            onClick={(e) => {
              if (controls.current.moved) e.preventDefault();
            }}
          >
            {!webgl && (
              // без канваса обложка нужна как обычная картинка
              <img
                className="ring-tag__cover"
                src={item.cover}
                alt={item.coverAlt}
                width={850}
                height={1133}
                loading="lazy"
              />
            )}
            <span className="ring-tag__name">{item.name}</span>
            <span className="ring-tag__meta">
              {item.staffed ? item.blurb : "Идёт набор"}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
