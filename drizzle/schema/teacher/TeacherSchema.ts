import { mysqlTable, varchar, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { teacherToSubject } from '../joins/teacherToSubject';
import { lesson } from '../lesson/lessonSchema';


export const teacher = mysqlTable('teacher', {
  id: varchar('id', { length: 36 }).primaryKey().unique(),
  username: varchar('username', { length: 30 }).unique().notNull(),
  surname: varchar('surname', { length: 30 }).unique().notNull(),
  name: varchar('name', { length: 30 }).notNull(),
  email: varchar('email', { length: 30 }),
  phone: varchar('phone', { length: 30 }),
  address: varchar('address', { length: 30 }).notNull(),
  bloodType: varchar('blood_type', { length: 30 }).notNull(),
  sex: mysqlEnum('sex', ['male', 'female']).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const TeacherRelations = relations(teacher, ({ many }) => ({
  teacherSubjects: many(teacherToSubject), 
  lessons: many(lesson),
}));
