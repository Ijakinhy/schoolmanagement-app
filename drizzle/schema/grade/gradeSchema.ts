import { relations } from "drizzle-orm";
import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { student } from "../student/studentSchema";
import { classSchema } from "../class/classSchema";




export  const grade =  mysqlTable("grade", {
    id: int("id").autoincrement().notNull(),
    level: int("level").notNull().unique()
})

export  const gradeRelations = relations(grade, ({ many }) => ({
    classes: many(classSchema),
    students: many(student)
}))