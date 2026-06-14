import {Toaster} from "sonner"
import {TooltipProvider} from "@/components/ui/tooltip"
import {ThemeProvider} from "./theme-providers"
import QueryClientProviders from "./query-client-providers"

export const Providers = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <QueryClientProviders>
                <TooltipProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <Toaster richColors position="bottom-center" />
                        {children}
                    </ThemeProvider>
                </TooltipProvider>
            </QueryClientProviders>
        </>
    )
}
