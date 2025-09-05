import { prisma } from "@/lib/prisma";
import React from "react";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const lessons = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
  });
  const formatedLessons = lessons.map((lesson) => ({
    title: lesson.name,
    start: lesson.start,
    end: lesson.end,
  }));

  const schedule = adjustScheduleToCurrentWeek(formatedLessons);

  return (
    <div>
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
