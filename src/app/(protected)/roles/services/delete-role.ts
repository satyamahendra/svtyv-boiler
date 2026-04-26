"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {RoleFormSchema, roleSchema} from "../utils/schemas"
import {MutationResult} from "@/utils/types/server-action"
import {Role} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import {handleMutationError} from "@/utils/helpers/handle-action-errors"

export async function deleteRole(roleName: string): Promise<MutationResult<Role>> {
    try {
        let role: Role

        const session = await authServer()

        if (!session) {
            return {success: false, data: null as any, message: "Unauthorized"}
        }

        role = (await prisma.role.delete({
            where: {name: roleName},
            select: {name: true},
        })) as Role

        revalidatePath("/roles")
        return {success: true, data: role, message: `Role deleted successfully`}
    } catch (error) {
        return handleMutationError(error)
    }
}
