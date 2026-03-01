import type { Campaign, Lesson } from "@/types/campaign";

export function getLessonById(campaign: Campaign, lessonId: string): Lesson | null {
  return campaign.lessons[lessonId] ?? null;
}

export function getFirstLesson(campaign: Campaign): Lesson | null {
  const firstLessonId = campaign.nodes[0]?.lessonIds[0];
  if (!firstLessonId) return null;
  return campaign.lessons[firstLessonId] ?? null;
}

export function findLessonPosition(campaign: Campaign, lessonId: string) {
  for (let nodeIndex = 0; nodeIndex < campaign.nodes.length; nodeIndex++) {
    const node = campaign.nodes[nodeIndex];
    const lessonIndex = node.lessonIds.indexOf(lessonId);
    if (lessonIndex !== -1) return { nodeIndex, lessonIndex };
  }
  return null;
}

export function getProgressPercent(campaign: Campaign, nodeIndex: number, lessonIndex: number) {
  const totalLessons = campaign.nodes.reduce((sum, n) => sum + n.lessonIds.length, 0);
  const completedBefore =
    campaign.nodes.slice(0, nodeIndex).reduce((sum, n) => sum + n.lessonIds.length, 0) +
    lessonIndex;
  if (totalLessons <= 0) return 0;
  return (completedBefore / totalLessons) * 100;
}
