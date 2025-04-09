import { relations } from 'drizzle-orm';
import {
  int,
  mysqlTable,
  timestamp,
  varchar
} from 'drizzle-orm/mysql-core';
import { student } from '../student/studentSchema';
  
 
 
 export  const parent =  mysqlTable(
    'parent',
    {
        id: varchar('id',{length:36}).primaryKey(),
        username: varchar('username', { length: 30 }).notNull().unique(),
        name: varchar('name', { length: 30 }).notNull(),
        surname: varchar('surname', { length: 30 }).notNull(),
        email: varchar('email',{ length: 30 }).unique(),
        phone: varchar('phone', { length: 30 }).notNull().unique(),
        address: varchar('address', { length: 30 }).notNull(),
        createdAt: timestamp('created_at').defaultNow(), 
      }
)


export const ParentRelations = relations(parent, ({ many }) => ({
  students: many(student),
}));