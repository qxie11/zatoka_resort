import { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";

export const metadata: Metadata = {
  title: "О нас - Отдых в Затоке",
  description: "Узнайте об истории, миссии и команде, стоящей за 'Отдых в Затоке', ведущим отелем в Затоке, Одесская область.",
  keywords: ["о нас", "история отеля", "отель в Затоке", "курорт в Одессе", "наша миссия"],
};

export default function AboutPage() {
  return <AboutClient />;
}
