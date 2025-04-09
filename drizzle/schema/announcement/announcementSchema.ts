import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { classSchema } from "../class/classSchema";
import { relations } from "drizzle-orm";




export  const announcement =  mysqlTable("announcement", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    date: datetime("date").notNull(),
    classId: int("classId").notNull().references(() => classSchema.id), 
})

export const AnnouncementRelations = relations(announcement, ({ one }) => ({
    class: one(classSchema, {
        fields: [announcement.classId],
        references: [classSchema.id]
    }),
}))


export type Announcement = typeof announcement.$inferSelect
export type AnnouncementInsert = typeof announcement.$inferInsert