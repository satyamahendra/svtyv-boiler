"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {RoleFormSchema, roleSchema} from "../utils/schemas"
import {MutationResult} from "@/utils/types/server-action"
import {Role} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import {handleMutationError} from "@/utils/helpers/handle-action-errors"

export async function createUpdateRole(data: RoleFormSchema): Promise<MutationResult<Role>> {
    const parsed = roleSchema.safeParse(data)

    if (!parsed.success) {
        return {
            success: false,
            data: null as any,
            message: "Invalid data",
            errors: parsed.error.flatten<string>((issue) => issue.message).fieldErrors,
        }
    }

    try {
        let role: Role

        const session = await authServer()

        if (!session) {
            return {success: false, data: null as any, message: "Unauthorized"}
        }

        if (parsed.data.name_before) {
            role = (await prisma.role.update({
                where: {name: parsed.data.name_before},
                data: {name: parsed.data.name},
                select: {name: true},
            })) as Role
        } else {
            role = (await prisma.role.create({
                data: {name: parsed.data.name},
                select: {name: true},
            })) as Role
        }

        revalidatePath("/roles")
        const action = parsed.data.name_before ? "updated" : "created"
        return {success: true, data: role, message: `Role ${action} successfully`}
    } catch (error) {
        return handleMutationError(error)
    }
}
