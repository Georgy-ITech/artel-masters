import type { Metadata, Viewport } from "next";
import { Golos_Text } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { Motion } from "@/components/Motion";
import { TransitionLayer } from "@/components/TransitionLayer";
import { Cursor } from "@/components/Cursor";

const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/** Дисплейный голос мира — та же гарнитура, из которой собран вордмарк. */
const oranienbaum = localFont({
  src: "../fonts/Oranienbaum-Regular.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://georgy-itech.github.io/artel-masters"),
  title: {
    default: "Артель — мастера, которых мы проверили лично",
    template: "%s — Артель",
  },
  description:
    "Репетиторы, ремонт и съёмка в Краснодаре. Девять услуг, каждого мастера проверяем сами: работы, разговор и первый заказ с куратором.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Артель",
    title: "Артель — мастера, которых мы проверили лично",
    description:
      "Девять услуг: репетиторы, ремонт и съёмка. Мастер попадает в каталог только после трёх ступеней проверки.",
  },
};

export const viewport: Viewport = {
  themeColor: "#14110d",
  colorScheme: "dark",
};

const CONTRACT = `<!--
THESIS: девять услуг — девять фотокарточек-ссылок в кольце, каждая со своей страницей. Отказ от выдачи с фильтрами, звёздами и карточками одного размера.
OWN-WORLD: тёплая тёмная комната (#14110d), лист слоновой кости (#f6f0e6) на снятой бумаге, бамбуковые рёбра (#c9a06a), вермилионовый оттиск (#d6452d). Дисплейный голос — Oranienbaum (вордмарк кривыми, заголовки шрифтом), интерфейс Golos Text. Обложки смонтированы на бумажное поле — материал взят с той же фотографии бумаги.
STORY: посетитель видит девять ремёсел, узнаёт своё, уходит на страницу услуги и пишет одному мастеру напрямую.
FIRST VIEWPORT: во весь экран тёмная комната; слева заголовок и одно действие; справа кольцо из девяти обложек — приглушённых, набирающих цвет под курсором; ярлыки-ссылки живут в DOM под каждой.
FORM: challenger «Мастерская Акари» (выбран заказчиком против выпавшего жребием «Реестра»), развитый до фотокарточек по правке заказчика; seed key 4904bf7a.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Артель",
  url: "https://georgy-itech.github.io/artel-masters/",
  description:
    "Площадка частных мастеров с личной проверкой: репетиторы, ремонт, съёмка.",
  areaServed: "Краснодар",
  telephone: "+7 495 048-31-70",
  email: "kurator@artelkrd.ru",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${golos.variable} ${oranienbaum.variable}`}
      // бумага из public: путь с подпапкой сайта, в CSS его не подставить
      style={{ "--paper-img": `url("${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/paper.jpg")` } as React.CSSProperties}
    >
      <body>
        <div
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: CONTRACT }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Motion />
        <TransitionLayer />
        <Cursor />
        <Masthead />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
