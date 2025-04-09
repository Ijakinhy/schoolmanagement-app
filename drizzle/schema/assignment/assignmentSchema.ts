import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";



export  const assignment  = mysqlTable("assignment", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", {length : 30}).notNull(),
    startDate: datetime("startDate").notNull(),
    dueDate: datetime("dueDate").notNull(),
})