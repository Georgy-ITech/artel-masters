import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="shell">
        <div className="foot__grid">
          <div className="foot__col">
            <p className="foot__title">Артель</p>
            <Link prefetch={false} className="foot__link" href="/uslugi">
              Все услуги
            </Link>
            <Link prefetch={false} className="foot__link" href="/#otbor">
              Как проверяем мастеров
            </Link>
            <Link prefetch={false} className="foot__link" href="/#masteram">
              Мастерам
            </Link>
          </div>
          <div className="foot__col">
            <p className="foot__title">Связь</p>
            <a className="foot__link" href="tel:+74950483170">
              +7 495 048-31-70
            </a>
            <a className="foot__link" href="mailto:svet@artelsvet.ru">
              svet@artelsvet.ru
            </a>
          </div>
          <div className="foot__col">
            <p className="foot__title">Где</p>
            <span>Краснодар, Центральный округ</span>
            <span>Пн–Сб, 9:00–20:00</span>
          </div>
        </div>
        <p className="foot__sign">
          <span>© 2026 «Артель» · Концепт-проект · Дизайн и разработка —</span>
          <a
            href="https://kwork.ru/user/georgy_tech"
            target="_blank"
            rel="noopener"
          >
            Georgy_Tech
          </a>
        </p>
      </div>
    </footer>
  );
}
