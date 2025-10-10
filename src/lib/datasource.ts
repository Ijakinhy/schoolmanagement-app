import { Day } from "@/generated/prisma";
import z from "zod";

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Name is required!" }),
    teachers: z.array(z.string()),
});
export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, "Class name is required"),
    capacity: z.coerce
        .number()
        .int()
        .positive("Capacity must be a positive integer"),
    supervisorId: z.coerce.string().min(1, "Supervisor is required"),
    gradeId: z.coerce.number().int().positive("Grade is required"),
});
export type ClassSchema = z.infer<typeof classSchema>;

export const sexEnum = z.enum(["Male", "Famale"], {
    message: "Gender is required",
});

export const teacherSchema = z.object({
    id: z.string().optional(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .or(z.literal("")),
    username: z.string().min(3, "Username must be at least 3 characters"),
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().min(7, "Phone number too short").nullable().optional(),
    address: z.string().min(1, "Address is required"),
    image: z.string().url("Invalid image URL").optional().nullable(),
    sex: sexEnum,
    birthday: z.coerce.date({
        required_error: "Birthday is required",
        invalid_type_error: "Invalid date",
    }),
    subjects: z.array(z.coerce.number()).optional(),
    classes: z.array(z.coerce.number()).optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
    id: z.string().optional(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .or(z.literal("")),
    username: z.string().min(3, "Username must be at least 3 characters"),
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z
        .string()
        .regex(/^[0-9+\-()\s]*$/, "Invalid phone number")
        .optional()
        .or(z.literal("")),
    address: z.string().min(1, "Address is required"),
    image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    sex: sexEnum,
    birthday: z.coerce.date({
        required_error: "Birthday is required",
        invalid_type_error: "Invalid date format",
    }),
    parentId: z.string().min(1, "Parent is required"),
    classId: z.coerce.number().int().positive("Class is required"),
    gradeId: z.coerce.number().int().positive("Grade is required"),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const parentSchema = z.object({
    id: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters").or(z.literal("")),
    username: z.string().min(3, "Username must be at least 3 characters"),
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z
        .string()
        .regex(/^[0-9+\-()\s]*$/, "Invalid phone number")
        .min(7, "Phone number must be at least 7 digits"),
    address: z.string().min(1, "Address is required"),
    students: z.array(z.string()).optional(),

});
export type ParentSchema = z.infer<typeof parentSchema>;

export const lessonSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, "Lesson name is required"),
    day: z.nativeEnum(Day),
    start: z.coerce.date({ required_error: "Start time is required" }),
    end: z.coerce.date({ required_error: "End time is required" }),
    subjectId: z.coerce.number({ required_error: "Subject is required" }),
    classId: z.coerce.number({ required_error: "Class is required" }),
    teacherId: z.string({ required_error: "Teacher is required" }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

export const examSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, "Exam title is required"),
    startTime: z.coerce.date({ required_error: "Start time is required" }),
    endTime: z.coerce.date({ required_error: "End time is required" }),
    lessonId: z.coerce.number({ required_error: "Lesson is required" }),
    results: z.array(z.number()).optional(),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const assignmentSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, "Assignment title is required"),
    startDate: z.coerce.date({ required_error: "Start date is required" }),
    dueDate: z.coerce.date({ required_error: "Due date is required" }),
    lessonId: z.coerce.number({ required_error: "Lesson is required" }),
    results: z.array(z.coerce.number()).optional(),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const resultSchema = z
    .object({
        id: z.coerce.number().optional(),
        score: z.coerce.number({ required_error: "Score is required" }).min(0, "Score must be at least 0").max(100, "Score must be at most 100"),
        assignmentId: z.coerce
            .number()
            .optional().nullable(),
        examId: z
            .coerce.number()
            .optional().nullable(),
        studentId: z.string({
            required_error: "Student is required",
        }),
    }).superRefine((data, ctx) => {
        // Case: both are empty or both are filled
        if (
            (!data.assignmentId && !data.examId) ||
            (data.assignmentId && data.examId)
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["assignmentId"],
                message: "Select either assignment or exam, not both.",
            });
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["examId"],
                message: "Select either assignment or exam, not both.",
            });
        }
    });

export type ResultSchema = z.infer<typeof resultSchema>;

export const attendanceSchema = z.object({
    id: z.coerce.number().optional(),
    date: z.coerce.date({ required_error: "Date is required" }),
    present: z.coerce.boolean({ required_error: "Presence status is required" }),
    lessonId: z.coerce.number({ required_error: "Lesson is required" }),
    studentId: z.string({ required_error: "Student is required" }),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

export const eventSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(2, "Title must be at least 2 characters long"),
    description: z.string({ required_error: "Description is required" }).min(5, "Description must be at least 5 characters long"),
    classId: z.coerce.number().optional().nullable(),
    startTime: z.coerce.date({ required_error: "Start time is required" }),
    endTime: z.coerce.date({ required_error: "End time is required" }),
})
    .refine((data) => data.endTime > data.startTime, {
        message: "End time must be after start time",
        path: ["endTime"],
    });

export type EventSchema = z.infer<typeof eventSchema>;