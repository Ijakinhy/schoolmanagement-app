import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";




export  const  exam =  mysqlTable("exam", {
    id:int("id").autoincrement().primaryKey(),
    title:varchar("title",{length:30}).notNull(),
    start: datetime("start").notNull(),
    end: datetime("end").notNull(),
})