type PageHeaderProps = {
    title: React.ReactNode
    description: React.ReactNode
    icon?: React.ReactNode
    subComponent?: React.ReactNode
}

const PageHeader = ({title, description, icon, subComponent}: PageHeaderProps) => {
    return (
        <header className="flex gap-4 items-center">
            <div className="bg-primary text-2xl p-2 w-12 h-12 flex items-center justify-center rounded-md text-primary-foreground">{icon ? icon : "?"}</div>
            <div className="flex flex-col">
                <h2 className="font-semibold text-xl">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="ml-auto">{subComponent}</div>
        </header>
    )
}

export default PageHeader
