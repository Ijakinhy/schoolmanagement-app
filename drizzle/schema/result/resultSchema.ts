import { relations } from "drizzle-orm";
import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { student } from "../student/studentSchema";
import { exam } from "../exam/examSchema";
import { assignment } from "../assignment/assignmentSchema";



export const result =  mysqlTable("result", {
    id: int("id").primaryKey().autoincrement(),
    score: int("score").notNull(),
    studentId: int("studentId").notNull().references(() => student.id),
    examId: int("examId").notNull().references(() => exam.id),
    assignmentId: int("assignmentId").notNull().references(() => assignment.id),
})


export const ResultRelations = relations(result, ({one,many})=> ({
    student: one(student, {
        fields: [result.studentId],
        references: [student.id],
      }),
    exam: one(exam, {
        fields: [result.examId],
        references: [exam.id],
    }),
    assignments: one(assignment, {
        fields: [result.assignmentId],
        references: [assignment.id],
    })
}))