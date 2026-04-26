"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {PermissionFormSchema, permissionSchema} from "../utils/schemas"
import {MutationResult} from "@/utils/types/server-action"
import {Permission} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import {handleMutationError} from "@/utils/helpers/handle-action-errors"

export async function createUpdatePermission(data: PermissionFormSchema): Promise<MutationResult<Permission>> {
    const parsed = permissionSchema.safeParse(data)

    if (!parsed.success) {
        return {
            success: false,
            data: null as any,
            message: "Invalid data",
            errors: parsed.error.flatten<string>((issue) => issue.message).fieldErrors,
        }
    }

    try {
        let permission: Permission

        const session = await authServer()

        if (!session) {
            return {success: false, data: null as any, message: "Unauthorized"}
        }

        if (parsed.data.name_before) {
            permission = (await prisma.permission.update({
                where: {name: parsed.data.name_before},
                data: {name: parsed.data.name},
                select: {name: true},
            })) as Permission
        } else {
            permission = (await prisma.permission.create({
                data: {name: parsed.data.name},
                select: {name: true},
            })) as Permission
        }

        revalidatePath("/permissions")
        const action = parsed.data.name_before ? "updated" : "created"
        return {success: true, data: permission, message: `Permission ${action} successfully`}
    } catch (error) {
        return handleMutationError(error)
    }
}
