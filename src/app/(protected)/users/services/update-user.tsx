"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {authServer} from "@/lib/auth-server"
import {handleMutationError} from "@/utils/helpers/handle-action-errors"
import {UserFormSchema, userSchema} from "../utils/schemas"
import {MutationResult} from "@/utils/types/server-action"
import {User} from "@/generated/index"

export async function updateUser(data: UserFormSchema): Promise<MutationResult<User>> {
    const parsed = userSchema.safeParse(data)

    if (!parsed.success) {
        return {
            success: false,
            data: null as any,
            message: "Invalid data",
            errors: parsed.error.flatten<string>((issue) => issue.message).fieldErrors,
        }
    }

    try {
        const session = await authServer()

        if (!session) {
            return {success: false, data: null as any, message: "Unauthorized"}
        }

        const {id, permissions = [], roles = []} = parsed.data

        const updated = await prisma.$transaction(async (tx) => {
            const updated = await tx.user.update({
                where: {id},
                data: {
                    roles: {
                        deleteMany: {},
                        create: roles.map((role_name) => ({role_name})),
                    },
                    permissions: {
                        deleteMany: {},
                        create: permissions.map((permission_name) => ({permission_name})),
                    },
                },
                select: {id: true, name: true, email: true, image: true, emailVerified: true, createdAt: true, updatedAt: true},
            })

            return updated
        })

        revalidatePath("/")
        return {success: true, data: updated, message: `User updated successfully`}
    } catch (error) {
        return handleMutationError(error)
    }
}
