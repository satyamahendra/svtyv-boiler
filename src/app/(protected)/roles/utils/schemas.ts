import z from "zod"

export const roleSchema = z.object({
    name: z.string().min(1, "Name is required"),
    name_before: z.string().optional(),
})

export type RoleFormSchema = z.infer<typeof roleSchema>
