"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Плавный скролл и проявления. Всё выключается при
 * prefers-reduced-motion: reduce — Lenis перехватывает нативную прокрутку,
 * и навязывать её тем, кто просил её не трогать, нельзя.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      document
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((n) => n.classList.add("is-in"));
      return;
    }

    const lenis = new Lenis({ duration: 1.05, wheelMultiplier: 0.9 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    lenis.on("scroll", ScrollTrigger.update);

    // Проявления — на IntersectionObserver: он не зависит от того, когда
    // посчиталась раскладка, и переживает смену вида списка.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const watch = () =>
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
        .forEach((n) => io.observe(n));
    requestAnimationFrame(() => requestAnimationFrame(watch));
    const rewatch = window.setInterval(watch, 1200);


    return () => {
      io.disconnect();
      window.clearInterval(rewatch);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
