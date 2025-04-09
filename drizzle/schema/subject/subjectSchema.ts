import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { teacherToSubject } from '../joins/teacherToSubject'; 
export const subject = mysqlTable('subject', {
  id: int('id').primaryKey().autoincrement().unique(),
  name: varchar('name', { length: 30 }).unique().notNull(),
});

export const SubjectRelations = relations(subject, ({ many }) => ({
  teacherSubjects: many(teacherToSubject), 
}));
