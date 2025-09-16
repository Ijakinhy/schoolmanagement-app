"use server"
import { UseFormResetField } from "react-hook-form"
import { SubjectSchema } from "./datasource"
import { prisma } from "./prisma"

export const createSubject = async (currentState: { success: boolean, error: boolean }, data: SubjectSchema) => {
    try {
        if (data.id) {
            await prisma.subject.update({
                where: {
                    id: data.id
                },
                data: {
                    name: data.name
                }
            })
            return {
                success: true,
                error: false
            }
        } else {
            await prisma.subject.create({
                data: {
                    name: data.name
                }
            })
            return {
                success: true,
                error: false
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: true
        }

    }

}