import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";




export   const event =   mysqlTable("event", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    startDate : datetime("startDate").notNull(),
    endDate : datetime("endDate").notNull(),
})