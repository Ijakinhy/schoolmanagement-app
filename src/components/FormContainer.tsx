import React from 'react'
import FormModal from './FormModal';
import { prisma } from '@/lib/prisma';


export type FormContainerProps = {
    table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
    type: "create" | "update" | "delete";
    data?: any;
    id?: String | number;
}

const FormContainer = async ({
    table,
    type,
    data,
    id,
}: FormContainerProps) => {

    let relatedData = {}

    if (type !== "delete") {
        switch (table) {
            case "subject":
                const subjectTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                })
                relatedData = {
                    teachers: subjectTeachers
                }

                break;
            case "class":
                const classTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                })
                const classGrades = await prisma.grades.findMany({
                    select: { id: true, level: true },
                })
                relatedData = {
                    teachers: classTeachers,
                    grades: classGrades
                }
                break;
            case "teacher":
                const teachersubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                })
                const teacherclasses = await prisma.class.findMany({
                    select: { id: true, name: true },
                })
                relatedData = {
                    subjects: teachersubjects,
                    classes: teacherclasses
                }
                break;
            case "student":
                const studentclasses = await prisma.class.findMany({
                    select: { id: true, name: true },
                })
                const studentparents = await prisma.parent.findMany({
                    select: { id: true, name: true, surname: true },
                })
                const studentGrades = await prisma.grades.findMany({
                    select: { id: true, level: true },
                })
                relatedData = {
                    classes: studentclasses,
                    parents: studentparents,
                    grades: studentGrades
                }
                break;
            case "parent":
                const parentchildren = await prisma.student.findMany({
                    select: { id: true, name: true, surname: true },
                })
                relatedData = {
                    students: parentchildren
                }
                break;
            case "lesson":
                const lessonTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                })
                const lessonSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                })
                const classes = await prisma.class.findMany({
                    select: { id: true, name: true },
                })
                relatedData = {
                    teachers: lessonTeachers,
                    subjects: lessonSubjects,
                    classes: classes
                }
                break;
            default:
                break;
        }
    }
    return (
        <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
    )
}

export default FormContainer