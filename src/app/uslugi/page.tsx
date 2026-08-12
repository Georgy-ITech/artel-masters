import type { Metadata } from "next";
import { ServiceIndex } from "@/components/ServiceIndex";
import { HowWeCheck } from "@/components/HowWeCheck";
import { RibRule } from "@/components/Marks";
import { services } from "@/data/artel";

export const metadata: Metadata = {
  title: "Услуги: ремонт, репетиторы и съёмка",
  description:
    "Девять услуг артели: репетиторы, сантехника, электрика, плитка, столярные работы и три вида съёмки. У каждой — свои проверенные мастера и цены.",
  alternates: { canonical: "/uslugi" },
};

export default function ServicesPage() {
  return (
    <main className="page">
      <section className="index-hero shell" aria-labelledby="index-title">
        <div>
          <h1 className="section-title" id="index-title">
            Девять ремёсел
          </h1>
          <p className="lede index-hero__lede">
            В каждом — мастера, прошедшие три ступени проверки. Выберите ремесло
            и напишите человеку напрямую: без аукциона и десяти откликов на одну
            заявку.
          </p>
        </div>
      </section>

      <div className="shell">
        <ServiceIndex items={services} />
      </div>

      <RibRule flip />

      <HowWeCheck compact />
    </main>
  );
}
