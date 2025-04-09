import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";





export  const admin =  mysqlTable(
        'admin',
        {
          id: varchar('id', { length: 36 }).primaryKey(),
          username: varchar('username', { length: 30 }).unique(),
        }
      )