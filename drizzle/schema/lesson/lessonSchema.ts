import { mysqlTable,int , varchar, mysqlEnum, datetime } from "drizzle-orm/mysql-core";
import { db } from "../../db";
import { subject } from "../subject/subjectSchema";
import { relations } from "drizzle-orm";
import { teacher } from "../teacher/TeacherSchema";
import { classSchema } from "../class/classSchema";




export  const lesson = mysqlTable("lesson",{
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 30 }).notNull(),
    day: mysqlEnum("day", ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).notNull(),
    startTime: datetime("start_time").notNull(),
    endTime: datetime("end_time").notNull(),
    subjectId: int("subject_id").notNull().references(() => subject.id),
    teacherId: int("teacher_id").notNull().references(() => teacher.id),
    classId: int("class_id").notNull().references(() => classSchema.id),
})

export const lessonRelations = relations(lesson, ({ one }) => ({
    subject: one(subject, {
      fields: [lesson.subjectId],
      references: [subject.id],
    }),
    teacher: one(teacher,{
      fields: [lesson.id],
      references: [teacher.id],
    }),
    classes: one(classSchema,{
      fields: [lesson.id],
      references: [classSchema.id],
    })
  }));