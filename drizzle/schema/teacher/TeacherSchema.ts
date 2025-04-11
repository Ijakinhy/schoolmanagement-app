import type { Subject } from './../subject/subjectSchema';
import { mysqlTable, varchar, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { teacherToSubject } from '../joins/teacherToSubject';
import {  lesson } from '../lesson/lessonSchema';
import type { Lesson } from '../lesson/lessonSchema';
import {  classSchema } from '../class/classSchema';
import type { Class } from '../class/classSchema';


export const teacher = mysqlTable('teacher', {
  id: varchar('id', { length: 36 }).primaryKey(),
  username: varchar('username', { length: 30 }).unique().notNull(),
  surname: varchar('surname', { length: 30 }).notNull(),
  name: varchar('name', { length: 30 }).notNull(),  
  email: varchar('email', { length: 30 }).unique(),
  phone: varchar('phone', { length: 30 }).unique().notNull(),
  address: varchar('address', { length: 30 }).notNull(),
  bloodType: varchar('blood_type', { length: 30 }).notNull(),
  sex: mysqlEnum('sex', ['male', 'female']).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  image : varchar('image', { length: 30 })
});

export const TeacherRelations = relations(teacher, ({ many }) => ({
  subjects: many(teacherToSubject), 
  lessons: many(lesson),
  classes: many(classSchema),
}));

export type Teacher = typeof teacher.$inferSelect;
export type NewTeacher = typeof teacher.$inferInsert;



export type TeacherWithRelations = {
  subjects: Array<{ subject: Subject }>;  
  lessons: Array<Lesson>;  
  classes: Array<Class>;  
};

// Type for the teacher with relations combined
export type TeacherList = Teacher & TeacherWithRelations;