const stages = [
  {
    name: "Работы",
    text: "Смотрим не анкету, а пять последних заказов: кадры до и после, сметы, результаты учеников. Просим телефоны тех, для кого это делалось.",
    fact: "Дальше проходят трое из десяти",
  },
  {
    name: "Разговор",
    text: "Час по видео. Как считает смету, что делает, когда ошибся, за что не берётся вообще. Мастер, который берётся за всё, нам не подходит.",
    fact: "Здесь отказов больше всего",
  },
  {
    name: "Первый заказ рядом",
    text: "Первую работу мастер делает с куратором на связи. Заказчик знает об этом заранее и платит обычную цену — не меньше и не больше.",
    fact: "После него мастер появляется в каталоге",
  },
];

/**
 * Три ступени — это отсев, поэтому и полоса сужается: первый столбец шире
 * последнего. Никаких одинаковых карточек — они бы врали про равенство шагов.
 */
export function HowWeCheck({ compact = false }: { compact?: boolean }) {
  return (
    <section className="sift on-paper" id="otbor" aria-labelledby="sift-title">
      <div className="shell">
        <div className="sift__head">
          <h2 className="section-title" id="sift-title">
            Как мы проверяем мастеров
          </h2>
          {!compact && (
            <p className="sift__lede">
              Проверка занимает около двух недель и заканчивается отказом чаще,
              чем согласием. Мы считаем это главной ценностью площадки.
            </p>
          )}
        </div>

        <ol className="funnel">
          {stages.map((s, i) => (
            <li className="funnel__step reveal" key={s.name} data-step={i + 1}>
              <span className="funnel__bar" aria-hidden="true" />
              <h3 className="funnel__name">{s.name}</h3>
              <p className="funnel__text">{s.text}</p>
              <p className="funnel__fact">{s.fact}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
