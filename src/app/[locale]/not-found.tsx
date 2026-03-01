"use client";

import { useT } from "@/i18n/useT";

export default function NotFound() {
  const t = useT();
  return (
    <main className="flex-1 flex items-center justify-center p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-display text-hobbit-wood-dark">{t("notFound.title")}</h1>
        <p className="mt-3 text-hobbit-wood/80">{t("notFound.body")}</p>
      </div>
    </main>
  );
}
