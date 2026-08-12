"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { WriteToMaster } from "./WriteToMaster";
import type { Master, Service } from "@/data/artel";

export function ServiceMasters({
  service,
  masters,
}: {
  service: Service;
  masters: Master[];
}) {
  const [recipient, setRecipient] = useState<string | null>(null);
  const form = useRef<HTMLDivElement>(null);

  const write = (name: string) => {
    setRecipient(name);
    form.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <section className="shell roster" id="mastera" aria-labelledby="roster-title">
        <h2 className="section-title" id="roster-title">
          {service.staffed ? "Кто работает" : "Отбор ещё идёт"}
        </h2>

        {service.staffed ? (
          <ol className="roster__list">
            {masters.map((m, i) => (
              <li className="roster__row" key={m.slug}>
                <span className="roster__no">{String(i + 1).padStart(2, "0")}</span>
                <span className="roster__name">{m.name}</span>
                <span className="roster__craft">
                  {m.craft}. {m.city}, {m.years} лет практики
                </span>
                <span className="roster__price">{m.price}</span>
                <span className="roster__action">
                  <button
                    type="button"
                    className="act act--quiet"
                    onClick={() => write(m.name)}
                  >
                    Написать
                  </button>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="roster__empty">
            <p className="roster__empty-text">
              Открыто {service.openSlots} места. Мы не показываем мастеров, пока
              они не прошли все три ступени, — даже если из-за этого раздел
              стоит пустым.
            </p>
            <p>
              <Link className="act act--quiet" href="/#masteram" prefetch={false}>
                Подать себя на отбор
              </Link>
            </p>
          </div>
        )}
      </section>

      {service.staffed && (
        <section className="shell write" id="zayavka" aria-labelledby="write-title">
          <div className="write__grid" ref={form}>
            <div>
              <h2 className="section-title" id="write-title">
                Написать напрямую
              </h2>
              <p className="write__aside">
                Без аукциона и без десяти откликов на одну заявку. Сообщение
                уходит одному мастеру — тому, кого вы выбрали.
              </p>
            </div>
            <WriteToMaster
              masters={masters}
              recipient={recipient}
              onPick={setRecipient}
            />
          </div>
        </section>
      )}
    </>
  );
}
