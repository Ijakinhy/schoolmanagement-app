"use server"
import { UseFormResetField } from "react-hook-form"
import { ClassSchema, SubjectSchema, TeacherSchema } from "./datasource"
import { prisma } from "./prisma"
import { clerkClient } from "@clerk/nextjs/server"

export const createSubject = async (currentState: { success: boolean, error: boolean }, data: SubjectSchema) => {
    try {
        if (data.id) {
            await prisma.subject.update({
                where: {
                    id: data.id
                },
                data: {
                    name: data.name,
                    teachers: {
                        set: data.teachers.map(teacherId => ({ id: teacherId }))
                    }
                }
            })
            return {
                success: true,
                error: false
            }
        } else {
            console.log({ data });

            await prisma.subject.create({
                data: {
                    name: data.name,
                    teachers: {
                        connect: data.teachers.map(teacherId => ({ id: teacherId }))
                    }
                },
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

export const deleteSubject = async (currentState: { success: boolean, error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id)
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

//  class  
export const createUpdateClass = async (currentState: { success: boolean, error: boolean }, data: ClassSchema) => {
    try {
        if (data.id) {
            await prisma.class.update({
                where: {
                    id: data.id
                },
                data
            })
            return {
                success: true,
                error: false
            }
        } else {
            console.log({ data });

            await prisma.class.create({
                data
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

export const deleteClass = async (currentState: { success: boolean, error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id)
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

// teacher

export const createUpdateTeacher = async (currentState: { success: boolean, error: boolean }, data: TeacherSchema) => {
    try {
        if (data.id) {
            await prisma.teacher.update({
                where: {
                    id: data.id
                },
                data: {
                    username: data.username,
                    name: data.name,
                    surname: data.surname,
                    address: data.address,
                    email: data.email,
                    phone: data.phone,
                    image: data.image,
                    sex: data.sex,
                    birthday: data.birthday,
                    subjects: {
                        set: data.subjects?.map(subjectId => ({ id: subjectId }))
                    }
                }
            })
            return {
                success: true,
                error: false
            }
        } else {
            const clerk = await clerkClient();
            const user = await clerk.users.createUser({
                username: data.username,
                firstName: data.name,
                lastName: data.surname,
                password: data.password,
                publicMetadata: {
                    role: "teacher",
                },
                skipLegalChecks: true,
                skipPasswordChecks: true,
                skipPasswordRequirement: true
            });


            await prisma.teacher.create({
                data: {
                    id: user.id,
                    username: data.username,
                    name: data.name,
                    surname: data.surname,
                    address: data.address,
                    email: data.email,
                    phone: data.phone,
                    image: data.image,
                    sex: data.sex,
                    birthday: data.birthday,
                    subjects: {
                        connect: data.subjects?.map((subjectId) => ({ id: subjectId }))
                    }
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

export const deleteTeacher = async (currentState: { success: boolean, error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        (await clerkClient()).users.deleteUser(id)
        await prisma.teacher.delete({
            where: {
                id: id
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