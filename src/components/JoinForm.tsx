"use client";

import { useRef, useState } from "react";
import { Arrow } from "./Marks";
import { services } from "@/data/artel";

type Errors = { craft?: string; name?: string; phone?: string };

const digits = (s: string) => s.replace(/\D/g, "");

/**
 * Заявка мастера на проверку. Форма, а не почтовая ссылка: `mailto:` молчит
 * у всех, у кого не настроен почтовый клиент, и путь в артель обрывается.
 */
export function JoinForm() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const craft = useRef<HTMLSelectElement>(null);

  if (sent) {
    return (
      <div className="form__done" role="status">
        <p className="form__done-title">Заявка принята.</p>
        <p className="form__done-text">
          Отвечаем в течение двух рабочих дней и сразу говорим, какие работы
          прислать на первую ступень.
        </p>
        <p className="form__disclaimer">
          Демонстрационная форма — данные никуда не отправляются.
        </p>
      </div>
    );
  }

  return (
    <form
      className="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const chosen = String(data.get("craft") ?? "");
        const name = String(data.get("name") ?? "").trim();
        const phone = String(data.get("phone") ?? "").trim();

        const next: Errors = {};
        if (!chosen) next.craft = "Выберите ремесло";
        if (name.length < 2) next.name = "Напишите, как к вам обращаться";
        if (digits(phone).length < 10)
          next.phone = "Нужен телефон из 10 цифр — по нему и позвонят";

        setErrors(next);
        if (next.craft) {
          craft.current?.focus();
          return;
        }
        if (Object.keys(next).length === 0) setSent(true);
      }}
    >
      <div className={`field${errors.craft ? " is-error" : ""}`}>
        <label className="field__label" htmlFor="join-craft">
          Ваше ремесло
        </label>
        <select
          ref={craft}
          className="field__input field__select"
          id="join-craft"
          name="craft"
          defaultValue=""
          aria-invalid={Boolean(errors.craft)}
          aria-describedby="join-craft-error"
        >
          <option value="">Выберите ремесло</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
              {s.staffed ? "" : " — идёт набор"}
            </option>
          ))}
          <option value="other">Другое</option>
        </select>
        <p className="field__error" id="join-craft-error" role="alert">
          {errors.craft}
        </p>
      </div>

      <div className={`field${errors.name ? " is-error" : ""}`}>
        <label className="field__label" htmlFor="join-name">
          Как вас зовут
        </label>
        <input
          className="field__input"
          id="join-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Сергей"
          aria-invalid={Boolean(errors.name)}
          aria-describedby="join-name-error"
        />
        <p className="field__error" id="join-name-error" role="alert">
          {errors.name}
        </p>
      </div>

      <div className={`field${errors.phone ? " is-error" : ""}`}>
        <label className="field__label" htmlFor="join-phone">
          Телефон
        </label>
        <input
          className="field__input"
          id="join-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 900 000-00-00"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby="join-phone-error"
        />
        <p className="field__error" id="join-phone-error" role="alert">
          {errors.phone}
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="join-works">
          Где посмотреть работы
        </label>
        <input
          className="field__input"
          id="join-works"
          name="works"
          type="text"
          inputMode="url"
          placeholder="Ссылка на альбом, канал или сайт — необязательно"
        />
        <p className="field__error" />
      </div>

      <div className="form__foot">
        <button className="act" type="submit">
          Подать себя на отбор
          <Arrow />
        </button>
        <p className="form__disclaimer">
          Демонстрационная форма — данные никуда не отправляются.
        </p>
      </div>
    </form>
  );
}
