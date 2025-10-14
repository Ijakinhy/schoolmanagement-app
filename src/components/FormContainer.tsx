import React from 'react'
import FormModal from './FormModal';
import { prisma } from '@/lib/prisma';
import { getCurrentUserAndRole } from '@/lib/utils';


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
    const { currentUserId, role } = await getCurrentUserAndRole()

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
            case "exam":
                const examLessons = await prisma.lesson.findMany({
                    select: { id: true, name: true },
                    where: {
                        ...(role === "teacher" ? { teacher: { id: currentUserId! } } : {})
                    }
                })
                const results = await prisma.result.findMany({
                    select: { id: true, student: { select: { name: true, surname: true } }, score: true },
                })
                relatedData = {
                    lessons: examLessons,
                    results
                }
                break;
            case "assignment":
                const assignmentLessons = await prisma.lesson.findMany({
                    select: { id: true, name: true },
                })
                const resultsAssignment = await prisma.result.findMany({
                    select: { id: true, student: { select: { name: true, surname: true } }, score: true },
                })
                relatedData = {
                    lessons: assignmentLessons,
                    results: resultsAssignment
                }
                break;
            case "result":
                const resultLessons = await prisma.lesson.findMany({
                    select: { id: true, name: true },
                })
                const resultAssignments = await prisma.assignment.findMany({
                    select: { id: true, title: true },
                })
                const resultStudents = await prisma.student.findMany({
                    select: { id: true, name: true, surname: true },
                })
                const exams = await prisma.exam.findMany({
                    select: { id: true, title: true },
                })
                relatedData = {
                    lessons: resultLessons,
                    assignments: resultAssignments,
                    students: resultStudents,
                    exams
                }
                break;
            case "attendance":

                const attendanceLessons = await prisma.lesson.findMany({
                    select: { id: true, name: true },
                    where: {
                        ...(role === "teacher" ? { teacher: { id: currentUserId! } } : {})
                    }
                })
                const allStudents = await prisma.student.findMany({
                    select: { id: true, name: true, surname: true },
                    where: role === "teacher" ? {
                        OR: [
                            { class: { supervisorId: currentUserId! } },
                            { class: { lessons: { some: { teacher: { id: currentUserId! } } } } }
                        ]
                    } : {},
                })

                relatedData = {
                    lessons: attendanceLessons,
                    students: allStudents
                }
                break
            case "event":
                const eventClasses = await prisma.class.findMany({
                    select: { id: true, name: true }
                })
                relatedData = {
                    classes: eventClasses
                }
                break
            case "announcement":
                const Announcementclasses = await prisma.class.findMany({
                    select: { id: true, name: true },
                })
                relatedData = {
                    classes: Announcementclasses
                }
                break
            default:
                break;
        }
    }
    return (
        <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
    )
}

export default FormContainer