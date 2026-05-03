"use server"

import {Permission} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

type Response = Permission & {roles: {role_name: string}[]}

export async function getPermission(name: string): Promise<ServerResult<Response>> {
    try {
        const session = await authServer()

        if (!session) throw new Error("Unauthorized")

        const permission = await prisma.permission.findUnique({
            where: {name},
            include: {
                roles: {
                    select: {role_name: true},
                },
            },
        })

        if (!permission) throw new Error("Permission not found")

        return {success: true, data: permission as Response, message: "Permission fetched successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
