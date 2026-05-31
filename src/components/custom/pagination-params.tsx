"use client"

import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "../ui/pagination"
import {PiCaretLeft, PiCaretRight} from "react-icons/pi"
import {Button} from "../ui/button"

type PaginationParamsProps = {
    className?: string
    pageCount: number
}

const PaginationParams = ({pageCount, className}: PaginationParamsProps) => {
    const {getParam, setParams} = useQueryParams()

    const currPage = Number(getParam("page")) || 1

    const handleSelectPage = (page: number) => {
        setParams({page: page.toString()})
    }

    const handleNextPage = () => {
        if (currPage < pageCount) handleSelectPage(currPage + 1)
    }

    const handlePrevPage = () => {
        if (currPage > 1) handleSelectPage(currPage - 1)
    }

    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <Button size="icon-sm" variant="ghost" onClick={handlePrevPage}>
                        <PiCaretLeft />
                    </Button>
                </PaginationItem>
                {Array.from({length: pageCount}, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink onClick={() => handleSelectPage(page)} isActive={currPage === page}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <Button size="icon-sm" variant="ghost" onClick={handleNextPage}>
                        <PiCaretRight />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default PaginationParams
