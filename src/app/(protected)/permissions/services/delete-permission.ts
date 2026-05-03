"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {ServerResult} from "@/utils/types/server-action"
import {Permission} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import {handleServerError} from "@/utils/helpers/handle-server-errors"

export async function deletePermission(permissionName: string): Promise<ServerResult<Permission>> {
    try {
        const session = await authServer()

        if (!session) throw new Error("Unauthorized")

        const permission = (await prisma.permission.delete({
            where: {name: permissionName},
            select: {name: true},
        })) as Permission

        revalidatePath("/permissions")
        return {success: true, data: permission, message: `Permission deleted successfully`}
    } catch (error) {
        return handleServerError(error)
    }
}
