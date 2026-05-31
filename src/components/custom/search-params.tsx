"use client"

import {PiMagnifyingGlass} from "react-icons/pi"
import {InputGroup, InputGroupAddon, InputGroupInput} from "../ui/input-group"
import {useQueryParams} from "@/utils/hooks/useQueryParams"

type SearchParamsProps = {
    className?: string
}

const SearchParams = ({className}: SearchParamsProps) => {
    const {getParam, setParams} = useQueryParams()
    const search = getParam("search")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams({search: e.target.value}, {delay: 200})
    }

    return (
        <InputGroup className={className}>
            <InputGroupInput placeholder="Search" value={search || ""} onChange={handleChange} />
            <InputGroupAddon>
                <PiMagnifyingGlass />
            </InputGroupAddon>
        </InputGroup>
    )
}

export default SearchParams
