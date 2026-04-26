"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {MutationResult} from "@/utils/types/server-action"
import {Permission} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import {handleMutationError} from "@/utils/helpers/handle-action-errors"

export async function deletePermission(permissionName: string): Promise<MutationResult<Permission>> {
    try {
        let permission: Permission

        const session = await authServer()

        if (!session) {
            return {success: false, data: null as any, message: "Unauthorized"}
        }

        permission = (await prisma.permission.delete({
            where: {name: permissionName},
            select: {name: true},
        })) as Permission

        revalidatePath("/permissions")
        return {success: true, data: permission, message: `Permission deleted successfully`}
    } catch (error) {
        return handleMutationError(error)
    }
}
