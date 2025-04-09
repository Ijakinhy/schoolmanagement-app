import { relations } from "drizzle-orm"
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { lesson } from "../lesson/lessonSchema"
import { student } from "../student/studentSchema"



export const classSchema = mysqlTable("class", {
    id:int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 30 }).notNull().unique(),
    capacity: int("capacity").notNull(),

})

export  const ClassRelations = relations(classSchema, ({ many }) => ({
    lessons:many(lesson),
    students:many(student),
}))

export type Class = typeof classSchema.$inferSelect
export type ClassInsert = typeof classSchema.$inferInsert
export type ClassUpdate = typeof classSchema.$inferSelect