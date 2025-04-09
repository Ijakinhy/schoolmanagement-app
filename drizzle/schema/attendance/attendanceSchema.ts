import { relations } from "drizzle-orm";
import { boolean, datetime, int, mysqlTable } from "drizzle-orm/mysql-core";
import { student } from "../student/studentSchema";
import { lesson } from "../lesson/lessonSchema";




export  const attendance =   mysqlTable("attenance", {
    id: int("id").autoincrement().primaryKey().notNull(),
    date: datetime("date").notNull(),
    present: boolean("present").notNull(),
    studentId: int("student_id").notNull().references(() => student.id),
    lessonId: int("lesson_id").notNull().references(() => lesson.id),
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