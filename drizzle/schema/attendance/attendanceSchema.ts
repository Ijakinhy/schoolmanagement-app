import { relations } from "drizzle-orm";
import { boolean, datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { student } from "../student/studentSchema";
import { lesson } from "../lesson/lessonSchema";




export  const attendance =   mysqlTable("attendance", {
    id: int("id").autoincrement().primaryKey(),
    date: datetime("date").notNull(),
    present: boolean("present").notNull(),
    studentId: varchar("studentId",{length:36}).notNull().references(() => student.id),
    lessonId: int("lessonId").notNull().references(() => lesson.id),
})

export const AttendanceRelations =  relations(attendance, ({one})=>({
    student: one(student, {
        fields: [attendance.studentId],
        references: [student.id],
    }),
    lesson: one(lesson, {
        fields: [attendance.lessonId],
        references: [lesson.id],
    }),
    
}))