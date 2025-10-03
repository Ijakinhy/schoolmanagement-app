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
        }
    }
    return (
        <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
    )
}

export default FormContainer