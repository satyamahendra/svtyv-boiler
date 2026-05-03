"use client"

type Props = {
    error: Error
    reset: () => void
}

export default function Error({error}: Props) {
    return (
        <div className="flex items-center justify-center h-20">
            <span className="text-muted-foreground">{error.message}</span>
        </div>
    )
}
