"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Seal, Wordmark } from "./Marks";
import { SplitLink } from "./SplitLink";

export function Masthead() {
  const pathname = usePathname();

  // над листом слоновой кости шапка перекрашивается, иначе её не видно
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".masthead");
    if (!bar) return;

    let queued = false;
    const check = () => {
      queued = false;
      const light = document.querySelector(".on-paper");
      if (!light) {
        bar.dataset.onlight = "false";
        return;
      }
      const box = light.getBoundingClientRect();
      bar.dataset.onlight = String(box.top <= 56 && box.bottom > 56);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <header className="masthead">
      <Link className="masthead__mark" href="/" prefetch={false} aria-label="Артель, на главную">
        <Seal />
        <Wordmark />
      </Link>
      <nav className="masthead__nav" aria-label="Разделы">
        <SplitLink href="/uslugi" className="masthead__link">
          Услуги
        </SplitLink>
        <SplitLink href="/#otbor" className="masthead__link">
          Как проверяем
        </SplitLink>
        <SplitLink href="/#masteram" className="masthead__link">
          Мастерам
        </SplitLink>
      </nav>
    </header>
  );
}
