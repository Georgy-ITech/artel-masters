"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ServiceRing } from "@/components/ServiceRing";
import { Veil } from "@/components/Veil";
import { HowWeCheck } from "@/components/HowWeCheck";
import { JoinForm } from "@/components/JoinForm";
import { Arrow, RibRule } from "@/components/Marks";
import { masters, plural, services } from "@/data/artel";

export default function Home() {
  const [sceneReady, setSceneReady] = useState(false);
  const [startAt, setStartAt] = useState<number | null>(null);

  const onReady = useCallback(() => setSceneReady(true), []);
  // карточки вылетают в кольцо ровно тогда, когда ушла завеса
  const onVeilDone = useCallback(
    () => setStartAt((prev) => prev ?? performance.now()),
    [],
  );

  const openServices = services.filter((s) => !s.staffed);

  return (
    <>
      <Veil sceneReady={sceneReady} onDone={onVeilDone} />

      <main id="top">
        <section className="ring" aria-labelledby="ring-title">
          <div className="ring__floor" aria-hidden="true" />
          <div className="ring__scrim" aria-hidden="true" />

          <div className="shell ring__band">
            <div className="ring__copy">
              <h1 className="display" id="ring-title">
                Мастера, которых мы проверили лично
              </h1>
              <p className="lede ring__lede">
                Репетиторы, ремонт и съёмка в Краснодаре. Девять услуг, в каждой
                — только те, за кого мы отвечаем своим именем.
              </p>
              <Link className="act" href="/uslugi" prefetch={false} data-cursor="смотреть">
                Все услуги
                <Arrow />
              </Link>
            </div>
          </div>

          <ServiceRing items={services} startAt={startAt} onReady={onReady} />

          <div className="shell ring__foot">
            <p className="ring__hint">
              Потяните круг или выберите карточку — откроется страница услуги.
            </p>
            <p className="label">
              {services.length} услуг · {masters.length}{" "}
              {plural(masters.length, "мастер", "мастера", "мастеров")}
            </p>
          </div>
        </section>

        <RibRule />

        <HowWeCheck />

        <section className="shell join" id="masteram" aria-labelledby="join-title">
          <div className="join__grid">
            <div>
              <h2 className="join__title" id="join-title">
                Мастерам
              </h2>
              <p className="join__text">
                Сейчас набор открыт:{" "}
                {openServices.map((s) => s.name.toLowerCase()).join(", ")}.
                Работы, час разговора и первый заказ с куратором — после этого
                вы появляетесь в каталоге.
              </p>
              <p className="join__text join__note">
                Отвечаем сами: письмо читает куратор, а не робот. Если удобнее
                голосом — <a href="tel:+74950483170">+7 495 048-31-70</a>.
              </p>
            </div>
            <JoinForm />
          </div>
        </section>
      </main>
    </>
  );
}
