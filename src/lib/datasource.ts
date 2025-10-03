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