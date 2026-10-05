export type ServiceGroup = "Репетиторы" | "Ремонт" | "Съёмка";

export type Service = {
  slug: string;
  name: string;
  group: ServiceGroup;
  cover: string;
  coverAlt: string;
  /** Одна строка на карточку. */
  blurb: string;
  /** Абзац на странице услуги. */
  intro: string;
  priceFrom: string;
  /** Есть ли в услуге проверенные мастера. */
  staffed: boolean;
  openSlots?: number;
};

export type Master = {
  slug: string;
  name: string;
  service: string;
  craft: string;
  city: string;
  years: number;
  price: string;
};

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const services: Service[] = [
  {
    slug: "repetitory",
    name: "Репетиторы",
    group: "Репетиторы",
    cover: base + "/covers/repetitory.jpg",
    coverAlt: "Репетитор занимается с учеником за столом у окна",
    blurb: "Математика, русский, английский, физика",
    intro:
      "Занятия дома или онлайн, от подтягивания школьной программы до подготовки к ЕГЭ и олимпиадам. Каждый репетитор показал нам результаты своих учеников за последний год и дал их контакты.",
    priceFrom: "от 1 500 ₽ / час",
    staffed: true,
  },
  {
    slug: "santehnika",
    name: "Сантехника",
    group: "Ремонт",
    cover: base + "/covers/santehnika.jpg",
    coverAlt: "Сантехник подключает подводку к прибору",
    blurb: "Стояки, разводка, приборы, тёплый пол",
    intro:
      "Замена стояков и разводки, установка приборов, коллекторные узлы и скрытый монтаж. Мастера работают со своим инструментом и дают гарантию на работу письменно.",
    priceFrom: "от 3 500 ₽ / выезд",
    staffed: true,
  },
  {
    slug: "elektrika",
    name: "Электрика",
    group: "Ремонт",
    cover: base + "/covers/elektrika.jpg",
    coverAlt: "Электрик с мультиметром у распределительного щита",
    blurb: "Щиты, проводка, освещение, слаботочка",
    intro:
      "Сборка щитов, замена проводки в квартире, сценарии освещения и слаботочные сети. Перед работой мастер составляет схему и согласовывает её с вами.",
    priceFrom: "от 3 900 ₽ / выезд",
    staffed: true,
  },
  {
    slug: "plitka-sanuzly",
    name: "Плитка и санузлы",
    group: "Ремонт",
    cover: base + "/covers/plitka-sanuzly.jpg",
    coverAlt: "Плиточник на стремянке укладывает плитку на стену",
    blurb: "Санузел под ключ, керамогранит, мозаика",
    intro:
      "Санузел под ключ, крупноформатный керамогранит, сложная раскладка и гидроизоляция. Смету считаем по факту замера, а не по телефону.",
    priceFrom: "от 2 800 ₽ / м²",
    staffed: true,
  },
  {
    slug: "stolyarnye-raboty",
    name: "Столярные работы",
    group: "Ремонт",
    cover: base + "/covers/stolyarnye-raboty.jpg",
    coverAlt: "Столяр за верстаком в мастерской",
    blurb: "Мебель на заказ, двери, лестницы",
    intro:
      "Мебель по размерам помещения, двери, лестницы и реставрация. Работы идут в мастерской, к вам приезжает готовое изделие и сборка.",
    priceFrom: "от 12 000 ₽ / изделие",
    staffed: true,
  },
  {
    slug: "svadebnaya-syomka",
    name: "Свадебная съёмка",
    group: "Съёмка",
    cover: base + "/covers/svadebnaya-syomka.jpg",
    coverAlt: "Невеста с букетом и жених у окна",
    blurb: "Полный день, камерные свадьбы, плёнка",
    intro:
      "Полный день или несколько часов, репортаж без постановки, плёнка и цифра. Готовые кадры приходят частями: превью на второй день, полная съёмка за три недели.",
    priceFrom: "от 42 000 ₽ / день",
    staffed: true,
  },
  {
    slug: "semeynaya-syomka",
    name: "Семейная съёмка",
    group: "Съёмка",
    cover: base + "/covers/semeynaya-syomka.jpg",
    coverAlt: "Семья с двумя детьми в комнате при вечернем свете из окна",
    blurb: "Дома при своём свете, прогулки, дети",
    intro:
      "Съёмка дома при естественном свете или прогулка рядом с домом. С детьми от года работаем без реквизита и без «посмотри в камеру».",
    priceFrom: "от 12 000 ₽ / съёмка",
    staffed: true,
  },
  {
    slug: "reportazh",
    name: "Репортаж и события",
    group: "Съёмка",
    cover: base + "/covers/reportazh.jpg",
    coverAlt: "Зал с публикой на конференции",
    blurb: "Конференции, корпоративы, съёмка в зале",
    intro:
      "Конференции, корпоративные события и выступления, в том числе в сложном свете зала. Отдаём отобранные кадры в тот же вечер, полный архив — за двое суток.",
    priceFrom: "от 9 000 ₽ / час",
    staffed: true,
  },
  {
    slug: "predmetnaya-syomka",
    name: "Предметная съёмка",
    group: "Съёмка",
    cover: base + "/covers/predmetnaya-syomka.jpg",
    coverAlt: "Предметная композиция с косметикой и сухоцветами",
    blurb: "Каталог, маркетплейсы, композиции",
    intro:
      "Съёмка для каталога и маркетплейсов, композиции с реквизитом, отрисовка теней. Раздел пока пустой: мы не нашли мастеров, за которых готовы отвечать своим именем.",
    priceFrom: "от 350 ₽ / кадр",
    staffed: false,
    openSlots: 2,
  },
];

export const masters: Master[] = [
  {
    slug: "marina-kovaleva",
    name: "Марина Ковалёва",
    service: "repetitory",
    craft: "Профильная математика, вторая часть ЕГЭ",
    city: "Краснодар",
    years: 11,
    price: "2 200 ₽ / час",
  },
  {
    slug: "nina-sokolova",
    name: "Нина Соколова",
    service: "repetitory",
    craft: "Русский язык и итоговое сочинение",
    city: "Краснодар",
    years: 18,
    price: "2 100 ₽ / час",
  },
  {
    slug: "yulia-rebrova",
    name: "Юлия Реброва",
    service: "repetitory",
    craft: "Английский язык, разговорный и IELTS",
    city: "Онлайн",
    years: 9,
    price: "2 400 ₽ / час",
  },
  {
    slug: "denis-arkhipov",
    name: "Денис Архипов",
    service: "repetitory",
    craft: "Физика и математика с нуля, работа с тревожностью на экзамене",
    city: "Онлайн",
    years: 7,
    price: "1 800 ₽ / час",
  },
  {
    slug: "sergey-lapin",
    name: "Сергей Лапин",
    service: "santehnika",
    craft: "Замена стояков и разводки, установка приборов",
    city: "Краснодар",
    years: 16,
    price: "от 3 500 ₽ / выезд",
  },
  {
    slug: "vadim-oreshkin",
    name: "Вадим Орешкин",
    service: "santehnika",
    craft: "Тёплый пол, коллекторные узлы, скрытый монтаж",
    city: "Краснодар",
    years: 12,
    price: "от 4 800 ₽ / выезд",
  },
  {
    slug: "anton-gribov",
    name: "Антон Грибов",
    service: "santehnika",
    craft: "Аварийные работы и течи, выезд в день обращения",
    city: "Краснодар",
    years: 8,
    price: "от 2 900 ₽ / выезд",
  },
  {
    slug: "igor-berezin",
    name: "Игорь Березин",
    service: "elektrika",
    craft: "Щиты и автоматика, замена проводки в квартире",
    city: "Краснодар",
    years: 19,
    price: "от 4 200 ₽ / выезд",
  },
  {
    slug: "roman-shilov",
    name: "Роман Шилов",
    service: "elektrika",
    craft: "Освещение и сценарии, слаботочка",
    city: "Краснодар",
    years: 8,
    price: "от 3 900 ₽ / выезд",
  },
  {
    slug: "leonid-panov",
    name: "Леонид Панов",
    service: "elektrika",
    craft: "Частные дома, вводные щиты и заземление",
    city: "Краснодарский край",
    years: 14,
    price: "от 5 400 ₽ / выезд",
  },
  {
    slug: "andrey-kulikov",
    name: "Андрей Куликов",
    service: "plitka-sanuzly",
    craft: "Санузел под ключ, крупноформатный керамогранит",
    city: "Краснодар",
    years: 15,
    price: "от 2 800 ₽ / м²",
  },
  {
    slug: "timur-basov",
    name: "Тимур Басов",
    service: "plitka-sanuzly",
    craft: "Мозаика и сложная раскладка, гидроизоляция",
    city: "Краснодар",
    years: 10,
    price: "от 3 200 ₽ / м²",
  },
  {
    slug: "ruslan-eremin",
    name: "Руслан Ерёмин",
    service: "plitka-sanuzly",
    craft: "Кухонные фартуки и полы, работа за один день",
    city: "Краснодар",
    years: 6,
    price: "от 2 400 ₽ / м²",
  },
  {
    slug: "viktor-sadovoy",
    name: "Виктор Садовой",
    service: "stolyarnye-raboty",
    craft: "Мебель из массива по размерам помещения",
    city: "Краснодар",
    years: 22,
    price: "от 18 000 ₽ / изделие",
  },
  {
    slug: "egor-nazarov",
    name: "Егор Назаров",
    service: "stolyarnye-raboty",
    craft: "Двери, лестницы, реставрация старой мебели",
    city: "Краснодар",
    years: 9,
    price: "от 12 000 ₽ / изделие",
  },
  {
    slug: "ekaterina-zhilina",
    name: "Екатерина Жилина",
    service: "svadebnaya-syomka",
    craft: "Полный день, репортаж без постановки",
    city: "Краснодар",
    years: 9,
    price: "от 55 000 ₽ / день",
  },
  {
    slug: "gleb-ostrovskiy",
    name: "Глеб Островский",
    service: "svadebnaya-syomka",
    craft: "Камерные свадьбы, плёнка и цифра",
    city: "Краснодар",
    years: 7,
    price: "от 42 000 ₽ / день",
  },
  {
    slug: "polina-gaydash",
    name: "Полина Гайдаш",
    service: "svadebnaya-syomka",
    craft: "Выездная регистрация, съёмка вдвоём с ассистентом",
    city: "Краснодар",
    years: 11,
    price: "от 68 000 ₽ / день",
  },
  {
    slug: "alisa-nemtseva",
    name: "Алиса Немцева",
    service: "semeynaya-syomka",
    craft: "Съёмка дома при естественном свете, дети от года",
    city: "Краснодар",
    years: 6,
    price: "от 12 000 ₽ / съёмка",
  },
  {
    slug: "maksim-torin",
    name: "Максим Торин",
    service: "semeynaya-syomka",
    craft: "Прогулки и большие семьи, печать альбомов",
    city: "Краснодар",
    years: 11,
    price: "от 15 000 ₽ / съёмка",
  },
  {
    slug: "vera-loskutova",
    name: "Вера Лоскутова",
    service: "semeynaya-syomka",
    craft: "Беременность и первый год, съёмка в роддоме",
    city: "Краснодар",
    years: 8,
    price: "от 14 000 ₽ / съёмка",
  },
  {
    slug: "kirill-vashchenko",
    name: "Кирилл Ващенко",
    service: "reportazh",
    craft: "Конференции и корпоративные события, съёмка в зале",
    city: "Краснодар",
    years: 13,
    price: "от 9 000 ₽ / час",
  },
  {
    slug: "stanislav-rud",
    name: "Станислав Рудь",
    service: "reportazh",
    craft: "Спорт и концерты, работа в сложном свете",
    city: "Краснодар",
    years: 10,
    price: "от 11 000 ₽ / час",
  },
];

export const serviceBySlug = new Map(services.map((s) => [s.slug, s]));

export function mastersOf(serviceSlug: string): Master[] {
  return masters.filter((m) => m.service === serviceSlug);
}

export function otherServices(slug: string, count = 4): Service[] {
  const index = services.findIndex((s) => s.slug === slug);
  return Array.from({ length: count }, (_, i) => services[(index + 1 + i) % services.length]);
}

export const staffedCount = services.filter((s) => s.staffed).length;

export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
