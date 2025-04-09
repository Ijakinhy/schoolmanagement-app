import { relations } from "drizzle-orm";
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { student } from "../student/studentSchema";
import { exam } from "../exam/examSchema";
import { assignment } from "../assignment/assignmentSchema";



export const result =  mysqlTable("result", {
    id: int("id").primaryKey().autoincrement(),
    score: int("score").notNull(),
    studentId: varchar("studentId",{length:36}).notNull().references(() => student.id),
    examId: int("examId").references(() => exam.id),
    assignmentId: int("assignmentId").references(() => assignment.id),
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