// hooks/useQueryParams.ts
import {useSearchParams, usePathname, useRouter} from "next/navigation"
import {useCallback, useRef} from "react"

type SetParamsOptions = {
    delay?: number
    routerMethod?: "push" | "replace"
}

export function useQueryParams() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)

    const getParam = useCallback((key: string) => searchParams.get(key), [searchParams])

    const setParams = useCallback(
        (entries: Record<string, string>, options: SetParamsOptions = {}) => {
            const {delay = 0, routerMethod = "replace"} = options

            const params = new URLSearchParams(searchParams)
            Object.entries(entries).forEach(([key, value]) => {
                if (value === "") {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
            })

            const url = `${pathname}?${params.toString()}`

            window.history.replaceState(null, "", url)

            if (debounceTimer.current) clearTimeout(debounceTimer.current)
            debounceTimer.current = setTimeout(() => {
                router[routerMethod](url, {scroll: false})
            }, delay)
        },
        [searchParams, pathname, router],
    )

    return {getParam, setParams}
}
