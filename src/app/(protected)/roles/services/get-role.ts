"use server"

import {Role} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

type Response = Role & {permissions: {permission_name: string}[]}

export async function getRole(name: string): Promise<ServerResult<Response>> {
    try {
        const session = await authServer()

        if (!session) throw new Error("Unauthorized")

        const role = await prisma.role.findUnique({
            where: {name},
            include: {
                permissions: {
                    select: {permission_name: true},
                },
            },
        })

        if (!role) throw new Error("Role not found")

        return {success: true, data: role, message: "Role fetched successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
