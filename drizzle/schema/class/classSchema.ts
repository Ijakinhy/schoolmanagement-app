import { relations } from "drizzle-orm"
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { lesson } from "../lesson/lessonSchema"
import { student } from "../student/studentSchema"
import { teacher } from "../teacher/TeacherSchema"
import { grade } from "../grade/gradeSchema"
import { announcement } from "../announcement/announcementSchema"
import { event } from "../event/eventSchema"



export const classSchema = mysqlTable("class", {
    id:int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 30 }).notNull().unique(),
    capacity: int("capacity"),
    supervisorId: varchar("supervisorId",{length:36}).references(()=> teacher.id),
    gradeId: int("gradeId").notNull().references(() => grade.id),
})

export  const ClassRelations = relations(classSchema, ({ many,one }) => ({
    lessons:many(lesson),
    students:many(student),
    supervisor: one(teacher, {
        fields: [classSchema.supervisorId],
        references: [teacher.id]
    }),
    grade: one(grade, {
        fields: [classSchema.gradeId],
        references: [grade.id]
    }),
    announcements: many(announcement),
    events: many(event),
}))

export type Class = typeof classSchema.$inferSelect
export type ClassInsert = typeof classSchema.$inferInsert