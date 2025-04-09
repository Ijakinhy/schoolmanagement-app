import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { lesson } from "../lesson/lessonSchema";
import { relations } from "drizzle-orm";



export  const assignment  = mysqlTable("assignment", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", {length : 30}).notNull(),
    startDate: datetime("startDate").notNull(),
    dueDate: datetime("dueDate").notNull(),
    lessonId: int("lessonId").notNull().references(() => lesson.id),
})

export const assignmentRelations = relations(assignment, ({ one }) => ({
    lessons: one(lesson, {
        fields: [assignment.lessonId],
        references: [lesson.id],
    })
}));