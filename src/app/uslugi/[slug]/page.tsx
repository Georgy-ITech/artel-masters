import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceMasters } from "@/components/ServiceMasters";
import { HowWeCheck } from "@/components/HowWeCheck";
import { Arrow, RibRule } from "@/components/Marks";
import { mastersOf, otherServices, serviceBySlug, services } from "@/data/artel";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/uslugi/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) return {};
  return {
    title: `${service.name} в Краснодаре`,
    description: service.intro,
    alternates: { canonical: `/uslugi/${service.slug}` },
    openGraph: {
      title: `${service.name} — Артель`,
      description: service.intro,
      images: [{ url: service.cover, width: 850, height: 1133 }],
    },
  };
}

export default async function ServicePage({
  params,
}: PageProps<"/uslugi/[slug]">) {
  const { slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) notFound();

  const masters = mastersOf(service.slug);
  const others = otherServices(service.slug);

  return (
    <main className="page">
      <section className="shell svc-hero" aria-labelledby="svc-title">
        <div className="svc-hero__body">
          <h1 className="display" id="svc-title">
            {service.name}
          </h1>
          <p className="lede">{service.intro}</p>
          <p className="svc-hero__meta">
            {service.group} · {service.priceFrom}
          </p>
        </div>
        <span className="mount svc-hero__mount">
          <img
            src={service.cover}
            alt={service.coverAlt}
            width={850}
            height={1133}
          />
        </span>
      </section>

      <ServiceMasters service={service} masters={masters} />

      <RibRule flip />

      <HowWeCheck compact />

      <section className="shell more" aria-labelledby="more-title">
        <h2 className="section-title" id="more-title">
          Другие ремёсла
        </h2>
        <ol className="more__list">
          {others.map((s, i) => (
            <li key={s.slug}>
              <Link className="more__row" href={`/uslugi/${s.slug}`} prefetch={false} data-cursor="открыть">
                <span className="more__name">{s.name}</span>
                <span className="more__blurb">{s.blurb}</span>
                <Arrow className="more__arrow" />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
