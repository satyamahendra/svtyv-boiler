// hooks/useQueryParams.ts
import {useSearchParams, usePathname, useRouter} from "next/navigation"
import {useCallback} from "react"

export function useQueryParams() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const getParam = useCallback((key: string) => searchParams.get(key), [searchParams])

    const setParams = useCallback(
        (entries: Record<string, string>) => {
            const params = new URLSearchParams(searchParams)
            Object.entries(entries).forEach(([key, value]) => {
                if (value === "") {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
            })
            router.replace(`${pathname}?${params.toString()}`)
        },
        [searchParams, pathname, router]
    )

    return {getParam, setParams}
}
