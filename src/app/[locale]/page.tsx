import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { isUiLanguage } from "@/i18n/locales";
import { campaignsById } from "@/features/progression/campaigns/registry";
import { getFirstLesson } from "@/features/progression/utils/progression";
import { resolveLocalizedText } from "@/i18n/resolveLocalizedText";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isUiLanguage(locale)) notFound();
  const m = getMessages(locale);
  const campaigns = [campaignsById["lotr-ru"], campaignsById["starter-en"], campaignsById["starter-hu"]].filter(
    Boolean,
  );

  return (
    <main className="flex-1 flex items-center justify-center p-10">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold font-display text-hobbit-wood-dark">{m["app.title"]}</h1>
        <p className="mt-3 text-hobbit-wood/80">
          {m["home.startRu"]}
        </p>
        <div className="mt-8 flex flex-col gap-3 items-center">
          <p className="text-hobbit-wood/70 text-sm font-sans uppercase tracking-wide font-bold">
            {m["home.pickCampaign"]}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            {campaigns.map((campaign) => {
              const first = getFirstLesson(campaign);
              if (!first) return null;
              const title = resolveLocalizedText(campaign.title, locale);
              const href = `/${locale}/play/${campaign.id}/${first.id}`;
              const primary = campaign.id === "lotr-ru";
              return (
                <Link
                  key={campaign.id}
                  href={href}
                  className={[
                    "inline-flex items-center justify-center rounded-full transition-colors shadow-stone active:translate-y-0.5 active:shadow-none border-b-4 px-6 py-3 font-bold font-sans uppercase tracking-wide text-sm",
                    primary
                      ? "bg-hobbit-wood text-[#f4ecd8] hover:bg-hobbit-wood-dark border-hobbit-wood-dark"
                      : "bg-[#d6c68b] text-hobbit-wood-dark hover:bg-[#c9b87a] border-[#b5a56a]",
                  ].join(" ")}
                >
                  {campaign.id === "lotr-ru" ? m["home.beginJourney"] : title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
