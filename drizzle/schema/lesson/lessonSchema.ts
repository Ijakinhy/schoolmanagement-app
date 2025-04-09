import { mysqlTable,int , varchar } from "drizzle-orm/mysql-core";
import { db } from "../../db";




export  const lesson = mysqlTable("lesson",{
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 30 }).notNull(),
})
