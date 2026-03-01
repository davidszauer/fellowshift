import { notFound, redirect } from "next/navigation";
import { getCampaign } from "@/features/progression/campaigns/registry";
import { getFirstLesson, getLessonById } from "@/features/progression/utils/progression";
import PlayScreenClient from "@/features/play/PlayScreenClient";

export default async function PlayLessonPage({
  params,
}: {
  params: Promise<{ locale: string; campaignId: string; lessonId: string }>;
}) {
  const { locale, campaignId, lessonId } = await params;

  const campaign = getCampaign(campaignId);
  if (!campaign) notFound();

  const lesson = getLessonById(campaign, lessonId);
  if (!lesson) {
    const first = getFirstLesson(campaign);
    if (!first) notFound();
    redirect(`/${locale}/play/${campaign.id}/${first.id}`);
    return null as never;
  }

  return <PlayScreenClient campaign={campaign} lesson={lesson} />;
}
