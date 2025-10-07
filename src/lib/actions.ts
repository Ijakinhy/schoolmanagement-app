"use server"
import { UseFormResetField } from "react-hook-form"
import { ClassSchema, ExamSchema, LessonSchema, ParentSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./datasource"
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
            const clerk = await clerkClient();
            const user = await clerk.users.updateUser(data.id, {
                username: data.username,
                firstName: data.name,
                lastName: data.surname,
            });

            await prisma.teacher.update({
                where: {
                    id: data.id
                },
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
                        set: data.subjects?.map((subjectId) => ({ id: subjectId }))
                    },
                    classes: {
                        set: data.classes?.map((classId) => ({ id: classId }))
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
                    },
                    classes: {
                        connect: data.classes?.map((classId) => ({ id: classId }))
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

// student  

export const createUpdateStudent = async (currentState: { success: boolean, error: boolean }, data: StudentSchema) => {
    try {
        if (data.id) {
            const clerk = await clerkClient();
            const user = await clerk.users.updateUser(data.id, {
                username: data.username,
                firstName: data.name,
                lastName: data.surname,
            });

            await prisma.student.update({
                where: {
                    id: data.id
                },
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
                    classId: data.classId,
                    gradeId: data.gradeId,
                    parentId: data.parentId,
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
                    role: "student",
                },
                skipLegalChecks: true,
                skipPasswordChecks: true,
                skipPasswordRequirement: true
            });
            console.log(user.id);


            await prisma.student.create({
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
                    classId: data.classId,
                    gradeId: data.gradeId,
                    parentId: data.parentId
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

export const deleteStudent = async (currentState: { success: boolean, error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        (await clerkClient()).users.deleteUser(id)
        await prisma.student.delete({
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

// Parent  

export const createUpdateParent = async (currentState: { success: boolean, error: boolean }, data: ParentSchema) => {
    try {
        if (data.id) {
            const clerk = await clerkClient();
            const user = await clerk.users.updateUser(data.id, {
                username: data.username,
                firstName: data.name,
                lastName: data.surname,
            });
            console.log(user.id);


            await prisma.parent.update({
                where: {
                    id: data.id
                },
                data: {
                    id: user.id,
                    username: data.username,
                    name: data.name,
                    surname: data.surname,
                    address: data.address,
                    email: data.email,
                    phone: data.phone,
                    students: {
                        set: data.students?.map((studentId) => ({ id: studentId }))
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
                    role: "parent",
                },
                skipLegalChecks: true,
                skipPasswordChecks: true,
                skipPasswordRequirement: true
            });

            await prisma.parent.create({
                data: {
                    id: user.id,
                    username: data.username,
                    name: data.name,
                    surname: data.surname,
                    address: data.address,
                    email: data.email,
                    phone: data.phone,
                    students: {
                        connect: data.students?.map((studentId) => ({ id: studentId }))
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

export const deleteParent = async (currentState: { success: boolean, error: boolean }, data: FormData) => {
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


// Lesson 

export const createUpdateLesson = async (currentState: { success: boolean, error: boolean }, data: LessonSchema) => {
    try {
        if (data.id) {
            await prisma.lesson.update({
                where: {
                    id: data.id
                },
                data: {
                    day: data.day,
                    start: data.start,
                    end: data.end,
                    classId: data.classId,
                    teacherId: data.teacherId,
                    name: data.name,
                    subjectId: data.subjectId
                }
            })
            return {
                success: true,
                error: false
            }

        } else {


            await prisma.lesson.create({
                data: {
                    day: data.day,
                    start: data.start,
                    end: data.end,
                    classId: data.classId,
                    teacherId: data.teacherId,
                    name: data.name,
                    subjectId: data.subjectId

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

export const deleteLesson = async (currentState: { success: boolean, error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        await prisma.lesson.delete({
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

export const createUpdateExam = async (currentState: { success: boolean, error: boolean }, data: ExamSchema) => {
    try {
        if (data.id) {
            await prisma.exam.update({
                where: {
                    id: data.id
                },
                data: {
                    title: data.title,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    lessonId: data.lessonId,
                    results: {
                        set: data.results?.map((resultId) => ({ id: resultId }))
                    }
                }
            })
            return {
                success: true,
                error: false
            }

        } else {

            await prisma.exam.create({
                data: {
                    title: data.title,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    lessonId: data.lessonId,
                    results: {
                        connect: data.results?.map((resultId) => ({ id: resultId }))
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

export const deleteExam = async (currentState: { success: boolean, error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        await prisma.exam.delete({
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

