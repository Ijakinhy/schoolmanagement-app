import z from "zod";

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Name is required!" }),
    teachers: z.array(z.string())
});
export type SubjectSchema = z.infer<typeof subjectSchema>;


export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, "Class name is required"),
    capacity: z.coerce.number().int().positive("Capacity must be a positive integer"),
    supervisorId: z.coerce.string().min(1, "Supervisor is required"),
    gradeId: z.coerce.number().int().positive("Grade is required"),
});
export type ClassSchema = z.infer<typeof classSchema>;

export const sexEnum = z.enum(["Male", "Famale"]);

export const teacherSchema = z.object({
    id: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
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