import { foreignKey } from 'drizzle-orm/gel-core';
import {
    mysqlTable,
    serial,
    varchar,
    timestamp,
    int,
  } from 'drizzle-orm/mysql-core';
import { parent } from '../parent/parentSchema';
import { mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';
import { classSchema } from '../class/classSchema';
import { grade } from '../grade/gradeSchema';
import { result } from '../result/resultSchema';
import { attendance } from '../attendance/attendanceSchema';
  
  
  export  const student =  mysqlTable(
    'student',
    {
        id: varchar('id',{length:36}).primaryKey(),
        username: varchar('username', { length: 30 }).unique().notNull(),
        surname: varchar('surname', { length: 30 }).notNull(),
        name: varchar('name', { length: 30 }).notNull(),
        email: varchar('email', { length: 30 }).unique(),
        phone: varchar('phone', { length: 30 }).unique(),
        address: varchar('address', { length: 30 }).notNull(),
        bloodType: varchar('bloodType', { length: 30 }).notNull(),
        sex:  mysqlEnum('sex', ['male', 'female']).notNull(),
        createdAt: timestamp('createdAt').defaultNow(),
        image: varchar('img', { length: 30 }),
        parentId: varchar("parentId",{length:36}).references(() => parent.id).notNull(),
        classId: int("classId").notNull().references(() => classSchema.id),
        gradeId: int("gradeId").notNull().references(() => grade.id),
      }
  )

export const StudentRelations = relations(student, ({ one,many }) => ({
  parent: one(parent, {
    fields: [student.parentId],
    references: [parent.id],
  }),
  class: one(classSchema, {
    fields: [student.classId],
    references: [classSchema.id],
  }),
  grade: one(grade, {
    fields: [student.gradeId],  
    references: [grade.id],
  }),
  attendance:many(attendance),
  result: many(result)
}));



export type Student = typeof student.$inferSelect;
export type StudentInsert = typeof student.$inferInsert;