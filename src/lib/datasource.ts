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