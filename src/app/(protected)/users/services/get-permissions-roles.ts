"use server"

import {Permission, Role} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

export async function getPermissionsAndRoles(): Promise<ServerResult<{permissions: Permission[]; roles: Role[]}>> {
    try {
        const permissions = await prisma.permission.findMany({
            select: {name: true},
        })

        const roles = await prisma.role.findMany({
            select: {name: true},
        })

        return {success: true, data: {permissions, roles}, message: "Permissions and roles fetched successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
