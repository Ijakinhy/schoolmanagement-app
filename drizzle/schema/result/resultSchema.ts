import { relations } from "drizzle-orm";
import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { student } from "../student/studentSchema";



export const result =  mysqlTable("result", {
    id: int("id").primaryKey().autoincrement(),
    score: int("score").notNull(),
    studentId: int("student_id").notNull().references(() => student.id),
    
})


export const ResultRelations = relations(result, ({one})=> ({
    student: one(student, {
        fields: [result.id],
        references: [student.id],
      })
}))