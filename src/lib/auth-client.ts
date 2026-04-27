import {createAuthClient} from "better-auth/react"
import {customSessionClient} from "better-auth/client/plugins"
import {auth} from "./auth"

export const authClient = createAuthClient({
    plugins: [customSessionClient<typeof auth>()],
    baseURL: process.env.BETTER_AUTH_URL,
})
