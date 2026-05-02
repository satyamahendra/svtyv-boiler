"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {Toaster} from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
// import {ThemeProvider} from "./theme-providers"

export const Providers = ({children}: {children: React.ReactNode}) => {
    const queryClient = new QueryClient()

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
                    <Toaster richColors position="bottom-center" />
                    {children}
                    {/* </ThemeProvider> */}
                </TooltipProvider>
            </QueryClientProvider>
        </>
    )
}
