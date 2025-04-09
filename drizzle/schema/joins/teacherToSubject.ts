import { mysqlTable, int, varchar, primaryKey } from 'drizzle-orm/mysql-core';
import { teacher } from '../teacher/TeacherSchema';
import { subject } from '../subject/subjectSchema';
import { relations } from 'drizzle-orm';

export const teacherToSubject = mysqlTable(
  'teacherToSubject',
  {
    teacherId: varchar('teacher_id', { length: 36 }).references(() => teacher.id),
    subjectId: int('subject_id').notNull().references(() => subject.id),
  },
  (table) => [
    primaryKey({ columns: [table.teacherId, table.subjectId] }),
  ]
);

export const teacherToSubjectRelations = relations(teacherToSubject, ({ one }) => ({
  teacher: one(teacher, {
    fields: [teacherToSubject.teacherId],
    references: [teacher.id],
  }),
  subject: one(subject, {
    fields: [teacherToSubject.subjectId],
    references: [subject.id],
  }),
}));

export type TeacherToSubject = typeof teacherToSubject;