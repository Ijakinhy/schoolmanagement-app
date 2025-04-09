import { mysqlTable,int , varchar, mysqlEnum, datetime } from "drizzle-orm/mysql-core";
import { db } from "../../db";
import { subject } from "../subject/subjectSchema";
import { relations } from "drizzle-orm";
import { teacher } from "../teacher/TeacherSchema";
import { classSchema } from "../class/classSchema";
import { exam } from "../exam/examSchema";
import { assignment } from "../assignment/assignmentSchema";
import { attendance } from "../attendance/attendanceSchema";




export  const lesson = mysqlTable("lesson",{
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 30 }).notNull(),
    day: mysqlEnum("day", ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).notNull(),
    startTime: datetime("startTime").notNull(),
    endTime: datetime("endTime").notNull(),
    subjectId: int("subjectId").notNull().references(() => subject.id),
    teacherId: varchar("teacherId",{length:36}).notNull().references(() => teacher.id),
    classId: int("classId").notNull().references(() => classSchema.id),
})

export const lessonRelations = relations(lesson, ({ one,many }) => ({
    subject: one(subject, {
      fields: [lesson.subjectId],
      references: [subject.id],
    }),
    teacher: one(teacher,{
      fields: [lesson.teacherId],
      references: [teacher.id],
    }),
    classes: one(classSchema,{
      fields: [lesson.classId],
      references: [classSchema.id],
    }),
    exams: many(exam),
    assignments: many(assignment),
    attendances: many(attendance),
  }));

export type Lesson = typeof lesson.$inferSelect;
export type InsertLesson = typeof lesson.$inferInsert;