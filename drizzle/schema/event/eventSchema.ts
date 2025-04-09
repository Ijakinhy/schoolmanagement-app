import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { classSchema } from "../class/classSchema";
import { relations } from "drizzle-orm";




export   const event =   mysqlTable("event", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    startDate : datetime("startDate").notNull(),
    endDate : datetime("endDate").notNull(),
    classId: int("classId").references(() => classSchema.id),
})

export const EventRelations = relations(event, ({ one }) => ({
    class: one(classSchema, {
        fields: [event.classId],
        references: [classSchema.id]
    }),
}))

export type Event = typeof event.$inferSelect
export type EventInsert = typeof event.$inferInsert