import { notFound } from "next/navigation";
import { I18nProvider } from "@/i18n/I18nProvider";
import HtmlLangSync from "@/i18n/HtmlLangSync";
import { getMessages } from "@/i18n/messages";
import { isUiLanguage } from "@/i18n/locales";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isUiLanguage(locale)) notFound();

  const messages = getMessages(locale);

  return (
    <I18nProvider locale={locale} messages={messages}>
      <HtmlLangSync locale={locale} />
      {children}
    </I18nProvider>
  );
}

