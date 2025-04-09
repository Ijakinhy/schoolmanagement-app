import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { lesson } from "../lesson/lessonSchema";
import { relations } from "drizzle-orm";




export  const  exam =  mysqlTable("exam", {
    id:int("id").autoincrement().primaryKey(),
    title:varchar("title",{length:30}).notNull(),
    start: datetime("start").notNull(),
    end: datetime("end").notNull(),
    lessonId: int("lesson_id").notNull().references(() => lesson.id),
})


export  const examRelations  =  relations(exam, ({one})=> ({
    lesson: one(lesson, {
        fields: [exam.lessonId],
        references: [lesson.id],
    })
}))