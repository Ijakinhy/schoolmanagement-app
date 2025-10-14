import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [nextCookies(), admin()],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
            }
        }
    }
})