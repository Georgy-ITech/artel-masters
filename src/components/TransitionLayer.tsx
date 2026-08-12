"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { Seal } from "./Marks";
import { serviceBySlug } from "@/data/artel";

const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/** Название раздела, куда идём: его и показываем под оттиском. */
function titleOf(path: string) {
  const clean = trim(path);
  if (clean === "" || clean === "/") return "Артель";
  if (clean === "/uslugi") return "Услуги";
  const slug = clean.replace(/^\/uslugi\//, "");
  return serviceBySlug.get(slug)?.name ?? "Артель";
}

/**
 * Переход между страницами: штора цвета бумаги поднимается снизу, по центру
 * стоит оттиск и название раздела, затем штора уходит вверх. При
 * reduced-motion переход обычный — ссылки остаются ссылками.
 */
export function TransitionLayer() {
  const router = useRouter();
  const pathname = usePathname();
  const sheet = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const failsafe = useRef(0);
  const [title, setTitle] = useState(() => titleOf(pathname));

  const retract = () => {
    const el = sheet.current;
    if (!el || !busy.current) return;
    window.clearTimeout(failsafe.current);
    gsap.killTweensOf(el);
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
          gsap.set(el, { display: "none" });
        },
      })
      .to(el, { yPercent: -100, duration: 0.4, ease: "power3.inOut", delay: 0.1 });
  };

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = sheet.current;
    if (!el) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = (e.target as HTMLElement)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (link.target && link.target !== "_self") return;

      const [path] = href.split("#");
      // переход «на самого себя» шторы не заслуживает
      if (trim(path) === trim(pathname)) return;
      if (busy.current) return;
      if (motion.matches) return;

      e.preventDefault();
      busy.current = true;
      setTitle(titleOf(path));

      // штора обязана уйти, даже если маршрут почему-то не сменился
      window.clearTimeout(failsafe.current);
      failsafe.current = window.setTimeout(retract, 1600);

      gsap
        .timeline()
        .set(el, { display: "grid", yPercent: 100 })
        .to(el, { yPercent: 0, duration: 0.35, ease: "power3.inOut" })
        .add(() => router.push(href));
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.clearTimeout(failsafe.current);
    };
  }, [pathname, router]);

  // маршрут сменился — уводим штору
  useEffect(() => {
    retract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="sheet" ref={sheet} aria-hidden="true">
      <span className="sheet__inner">
        <Seal className="sheet__seal" />
        <span className="sheet__title">{title}</span>
      </span>
    </div>
  );
}
