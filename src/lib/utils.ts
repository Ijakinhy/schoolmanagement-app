import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();
export const role = (user?.publicMetadata as { role: string }).role;
export const currentUserId = user?.id;

export const currentworkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);

  if (dayOfWeek === 0) { // Sunday
    startOfWeek.setDate(today.getDate() + 1);
  } else if (dayOfWeek === 6) { // Saturday
    startOfWeek.setDate(today.getDate() + 2);
  } else { // Weekday (Monday to Friday)
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
  }
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 4);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};


export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date | string; end: Date | string }[]
): { title: string; start: Date; end: Date }[] => {
  const { startOfWeek } = currentworkWeek(); // Let's say this is Mon, Jan 22, 2024, 00:00:00 (server local time)

  return lessons.map((lesson) => {
    const originalLessonStart = typeof lesson.start === 'string' ? new Date(lesson.start) : lesson.start;
    // originalLessonStart = new Date("2025-06-08T08:00:00.000Z")
    // originalLessonStart.getDay() will be 0 (Sunday) because it's a UTC date and getDay() respects that.

    const originalLessonEnd = typeof lesson.end === 'string' ? new Date(lesson.end) : lesson.end;

    const lessonDayOfWeek = originalLessonStart.getDay(); // This will be 0 (Sunday)
    const daysOffsetFromMonday = (lessonDayOfWeek === 0) ? 6 : lessonDayOfWeek - 1; // This will be 6

    const adjustedStartDate = new Date(startOfWeek); // e.g., Mon, Jan 22, 2024, 00:00:00 (server local)
    adjustedStartDate.setDate(startOfWeek.getDate() + daysOffsetFromMonday); // Mon + 6 days = Sunday, Jan 28, 2024

    // Get hours from UTC date. originalLessonStart.getHours() might give you a value based on server's local interpretation of that UTC time.
    // For "2025-06-08T08:00:00.000Z", originalLessonStart.getUTCHours() is 8.
    adjustedStartDate.setHours(
      originalLessonStart.getUTCHours(),      // USE getUTCHours()
      originalLessonStart.getUTCMinutes(),    // USE getUTCMinutes()
      originalLessonStart.getUTCSeconds(),    // USE getUTCSeconds()
      originalLessonStart.getUTCMilliseconds()// USE getUTCMilliseconds()
    );
    // Now adjustedStartDate is Sun, Jan 28, 2024, 08:00:00 (server local time, but based on UTC hours from original)

    const durationMs = originalLessonEnd.getTime() - originalLessonStart.getTime();
    const adjustedEndDate = new Date(adjustedStartDate.getTime() + durationMs);

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate
    };
  });
};