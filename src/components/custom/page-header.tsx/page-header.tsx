import {PiQuestion} from "react-icons/pi"

type PageHeaderProps = {
    title: string
    description: string
    icon?: React.ReactNode
}

const PageHeader = ({title, description, icon}: PageHeaderProps) => {
    return (
        <header className="flex gap-4 items-center">
            <div className="border bg-muted text-2xl p-2 w-12 h-12 flex items-center justify-center rounded-md text-muted-foreground">{icon ? icon : "?"}</div>
            <div className="flex flex-col">
                <h2 className="font-semibold text-xl">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </header>
    )
}

export default PageHeader
