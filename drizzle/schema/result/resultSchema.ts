import { int, mysqlTable } from "drizzle-orm/mysql-core";



export const result =  mysqlTable("result", {
    id: int("id").primaryKey().autoincrement(),
    score: int("score").notNull(),
    
})