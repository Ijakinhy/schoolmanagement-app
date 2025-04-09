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
  
  
  export  const student =  mysqlTable(
    'student',
    {
        id: varchar('id',{length:36}).primaryKey(),
        username: varchar('username', { length: 30 }).unique().notNull(),
        surname: varchar('surname', { length: 30 }).notNull(),
        name: varchar('name', { length: 30 }).notNull(),
        email: varchar('email', { length: 30 }),
        phone: varchar('phone', { length: 30 }),
        address: varchar('address', { length: 30 }).notNull(),
        bloodType: varchar('blood_type', { length: 30 }).notNull(),
        sex:  mysqlEnum('sex', ['male', 'female']).notNull(),
        createdAt: timestamp('created_at').defaultNow(),
        img: varchar('img', { length: 30 }),
        parentId: varchar("parent_id",{length:36}).references(() => parent.id),
      }
  )

export const StudentRelations = relations(student, ({ one }) => ({
  parent: one(parent, {
    fields: [student.parentId],
    references: [parent.id],
  }),
}));