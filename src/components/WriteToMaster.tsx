"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow } from "./Marks";
import type { Master } from "@/data/artel";

type Errors = {
  recipient?: string;
  name?: string;
  phone?: string;
  task?: string;
};

const digits = (s: string) => s.replace(/\D/g, "");

export function WriteToMaster({
  masters,
  recipient,
  onPick,
}: {
  masters: Master[];
  recipient: string | null;
  onPick: (name: string) => void;
}) {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const select = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (recipient) setSent(false);
  }, [recipient]);

  if (sent) {
    return (
      <div className="form__done" role="status">
        <p className="form__done-title">Заявка ушла.</p>
        <p className="form__done-text">
          {recipient ? `Получатель — ${recipient}. ` : ""}Мастера артели
          отвечают в тот же день. Если ответа не будет за сутки, мы напишем сами
          и предложим замену.
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
        const name = String(data.get("name") ?? "").trim();
        const phone = String(data.get("phone") ?? "").trim();
        const task = String(data.get("task") ?? "").trim();

        const next: Errors = {};
        if (!recipient) next.recipient = "Выберите мастера — заявка уходит ему";
        if (name.length < 2) next.name = "Напишите, как к вам обращаться";
        if (digits(phone).length < 10)
          next.phone = "Нужен телефон из 10 цифр — по нему и позвонят";
        if (task.length < 10)
          next.task = "Опишите задачу хотя бы одним предложением";

        setErrors(next);
        if (next.recipient) {
          select.current?.focus();
          return;
        }
        if (Object.keys(next).length === 0) setSent(true);
      }}
    >
      <div className={`field${errors.recipient ? " is-error" : ""}`}>
        <label className="field__label" htmlFor="write-to">
          Кому
        </label>
        <select
          ref={select}
          className="field__input field__select"
          id="write-to"
          name="recipient"
          value={recipient ?? ""}
          onChange={(e) => onPick(e.target.value)}
          aria-invalid={Boolean(errors.recipient)}
          aria-describedby="write-to-error"
        >
          <option value="">Выберите мастера</option>
          {masters.map((m) => (
            <option key={m.slug} value={m.name}>
              {m.name} — {m.craft}
            </option>
          ))}
        </select>
        <p className="field__error" id="write-to-error" role="alert">
          {errors.recipient}
        </p>
      </div>

      <div className={`field${errors.name ? " is-error" : ""}`}>
        <label className="field__label" htmlFor="write-name">
          Как вас зовут
        </label>
        <input
          className="field__input"
          id="write-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ирина"
          aria-invalid={Boolean(errors.name)}
          aria-describedby="write-name-error"
        />
        <p className="field__error" id="write-name-error" role="alert">
          {errors.name}
        </p>
      </div>

      <div className={`field${errors.phone ? " is-error" : ""}`}>
        <label className="field__label" htmlFor="write-phone">
          Телефон
        </label>
        <input
          className="field__input"
          id="write-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 900 000-00-00"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby="write-phone-error"
        />
        <p className="field__error" id="write-phone-error" role="alert">
          {errors.phone}
        </p>
      </div>

      <div className={`field${errors.task ? " is-error" : ""}`}>
        <label className="field__label" htmlFor="write-task">
          Что нужно сделать
        </label>
        <textarea
          className="field__area"
          id="write-task"
          name="task"
          placeholder="Течёт смеситель и подтекает под ванной, дом 1998 года"
          aria-invalid={Boolean(errors.task)}
          aria-describedby="write-task-error"
        />
        <p className="field__error" id="write-task-error" role="alert">
          {errors.task}
        </p>
      </div>

      <div className="form__foot">
        <button className="act" type="submit">
          Отправить мастеру
          <Arrow />
        </button>
        <p className="form__disclaimer">
          Демонстрационная форма — данные никуда не отправляются.
        </p>
      </div>
    </form>
  );
}
