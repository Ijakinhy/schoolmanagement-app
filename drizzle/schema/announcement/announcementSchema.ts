import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";




export  const announcement =  mysqlTable("announcement", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    date: datetime("date").notNull(),
})