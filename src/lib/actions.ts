"use server"

import { error } from "console"
import { SubjectSchema } from "./datasource"
import { prisma } from "./prisma"
import { revalidatePath } from "next/cache"

export const createSubject = async (currentState: { success: boolean, error: boolean }, data: SubjectSchema) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.name
            }
        })
        return {
            success: true,
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }

    }

}