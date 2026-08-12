"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Arrow } from "./Marks";
import { mastersOf, plural, type Service } from "@/data/artel";

gsap.registerPlugin(Flip, ScrollTrigger);

type View = "canvas" | "list";
const STORAGE = "artel-view";

/** Ритм полотна: шесть слотов, дальше цикл повторяется. */
const slots = ["a", "b", "c", "d", "e", "f"];

export function ServiceIndex({ items }: { items: Service[] }) {
  const [view, setView] = useState<View>("canvas");
  const [ready, setReady] = useState(false);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE);
    if (saved === "list" || saved === "canvas") setView(saved);
    setReady(true);
  }, []);

  const switchTo = (next: View) => {
    if (next === view) return;
    localStorage.setItem(STORAGE, next);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = grid.current?.querySelectorAll(".svc");
    if (motion.matches || !nodes) {
      setView(next);
      return;
    }

    const state = Flip.getState(nodes);
    // Flip должен снять размеры уже после коммита React, иначе он
    // остаётся с абсолютным позиционированием на живой раскладке
    flushSync(() => setView(next));
    Flip.from(state, {
      duration: 0.6,
      ease: "power3.inOut",
      stagger: 0.02,
      absolute: true,
      onComplete: () => {
        nodes.forEach((n) => n.removeAttribute("style"));
        // раскладка сменилась — триггеры проявления пересчитываются
        ScrollTrigger.refresh();
      },
    });
  };

  return (
    <>
      <div className="svc-bar">
        <p className="label">{items.length} услуг</p>
        <div className="svc-switch" role="group" aria-label="Вид списка">
          <button
            type="button"
            className="svc-switch__btn"
            aria-pressed={view === "canvas"}
            onClick={() => switchTo("canvas")}
          >
            Полотном
          </button>
          <button
            type="button"
            className="svc-switch__btn"
            aria-pressed={view === "list"}
            onClick={() => switchTo("list")}
          >
            Списком
          </button>
        </div>
      </div>

      <div
        className="svc-grid"
        data-view={view}
        data-ready={ready}
        ref={grid}
      >
        {items.map((item, i) => {
          const count = mastersOf(item.slug).length;
          return (
            <article
              className="svc reveal"
              key={item.slug}
              data-slot={slots[i % slots.length]}
            >
              <Link
                className="svc__link"
                href={`/uslugi/${item.slug}`}
                prefetch={false}
                data-cursor="открыть"
              >
                <span className="svc__no">
                  {String(i + 1).padStart(3, "0")}
                </span>
                <span className="svc__media mount">
                  <img
                    src={item.cover}
                    alt={item.coverAlt}
                    width={850}
                    height={1133}
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                </span>
                <span className="svc__body">
                  <span className="svc__name">{item.name}</span>
                  <span className="svc__blurb">{item.blurb}</span>
                  <span className="svc__meta">
                    {item.staffed
                      ? `${count} ${plural(count, "мастер", "мастера", "мастеров")} · ${item.priceFrom}`
                      : "Идёт набор"}
                  </span>
                </span>
                <span className="svc__go" aria-hidden="true">
                  <Arrow className="svc__arrow" />
                </span>
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
}
