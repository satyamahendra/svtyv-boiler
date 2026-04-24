"use server"

import {auth} from "@/lib/auth"
import {ActionResult} from "@/utils/types/server-action"

export const signInSocial = async (): Promise<ActionResult> => {
    try {
        const response = await auth.api.signInSocial({
            body: {
                provider: "google",
                callbackURL: "/",
            },
            asResponse: true,
        })

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null)
            return {
                success: false,
                data: null,
                error: errorBody?.message ?? `Authentication failed: ${response.statusText}`,
            }
        } else {
            return {
                success: true,
                data: null,
                error: null,
            }
        }
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        }
    }
}
