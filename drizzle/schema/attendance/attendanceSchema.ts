import { boolean, datetime, int, mysqlTable } from "drizzle-orm/mysql-core";




export  const attendance =   mysqlTable("attenance", {
    id: int("id").autoincrement().primaryKey().notNull(),
    date: datetime("date").notNull(),
    present: boolean("present").notNull(),
})