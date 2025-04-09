import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";





export  const admin =  mysqlTable(
        'admin',
        {
          id: serial('id').primaryKey(),
          username: varchar('username', { length: 30 }).unique(),
        }
      )