"use client";

import { useMemo } from "react";
import { useGameStore } from "@/store/useGameStore";
import { selectCurrentLessonIndex, selectCurrentNodeIndex, selectNodes } from "@/store/selectors";

function computeProgressPercent(nodes: Array<{ lessonIds: string[] }>, nodeIndex: number, lessonIndex: number) {
  const totalLessons = nodes.reduce((sum, n) => sum + n.lessonIds.length, 0);
  const completedBefore =
    nodes.slice(0, nodeIndex).reduce((sum, n) => sum + n.lessonIds.length, 0) + lessonIndex;
  if (totalLessons <= 0) return 0;
  return (completedBefore / totalLessons) * 100;
}

export default function JourneyProgress({ labels, activeIndex }: { labels: string[]; activeIndex: number }) {
  const nodes = useGameStore(selectNodes);
  const nodeIndex = useGameStore(selectCurrentNodeIndex);
  const lessonIndex = useGameStore(selectCurrentLessonIndex);

  const percent = useMemo(() => computeProgressPercent(nodes, nodeIndex, lessonIndex), [nodes, nodeIndex, lessonIndex]);
  const width = `${Math.max(0, Math.min(100, percent))}%`;

  return (
    <>
      <div className="flex justify-between text-xs font-bold text-hobbit-wood uppercase tracking-wider font-sans">
        {labels.map((label, idx) => (
          <span key={idx} className={activeIndex === idx ? "text-hobbit-moss" : undefined}>
            {label}
          </span>
        ))}
      </div>
      <div className="relative h-4 w-full bg-[#d3cbbd] rounded-full overflow-hidden shadow-inner border border-[#c4baaa]">
        <div
          className="absolute top-0 left-0 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjOGQ3YjY4Ii8+CjxwYXRoIGQ9Ik0wIDBMOCA4TTggMEwwIDgiIHN0cm9rZT0iIzdlNmU1ZCIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] rounded-r-lg border-r-2 border-hobbit-soil/50 transition-[width] duration-500"
          style={{ width }}
        />
      </div>
    </>
  );
}
