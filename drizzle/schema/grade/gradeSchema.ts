import { int, mysqlTable } from "drizzle-orm/mysql-core";




export  const grade =  mysqlTable("grade", {
    id: int("id").autoincrement().notNull(),
    level: int("level").notNull().unique()
})