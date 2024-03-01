"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

interface ProblemPaginationProps {
    end: number;
    current: number;
    increment: () => void;
    decrement: () => void;
}

const ProblemPagination: React.FC<ProblemPaginationProps> = ({
    end,    
    current,
    increment,
    decrement
}) => {

    if (current <= 1 && end > 1) {
        return (
        <>
        <div className="flex items-center">
        <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className='cursor-pointer' onClick={decrement} />
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink>|</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink isActive>{current}</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink className='cursor-pointer' onClick={increment}>{current + 1}</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationNext className='cursor-pointer' onClick={increment} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      </div>
    
        </>)
      }else if(current <= 1 && end == current) {
        return (<>

        <div className="flex items-center">

          <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className='cursor-pointer' onClick={decrement} />
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink>|</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink isActive>{current}</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink>|</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationNext className='cursor-pointer' onClick={increment} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      </div>
    
        </>)
      }else if (current >= end && end > 1) {
          return(
          <>
            <div className="flex items-center">

            <Pagination>
          <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className='cursor-pointer' onClick={decrement} />
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink className='cursor-pointer' onClick={decrement}>{current-1}</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink isActive>{current}</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink>|</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationNext className='cursor-pointer' onClick={increment} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      </div>
          
          </>)
      }else{
        return (<>
        <div className="flex items-center">

        <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className='cursor-pointer' onClick={decrement} />
          </PaginationItem>
    
    
          <PaginationItem>
            <PaginationLink className='cursor-pointer' onClick={decrement}>{current-1}</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink isActive>{current}</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationLink className='cursor-pointer' onClick={increment}>{current+1}</PaginationLink>
          </PaginationItem>
    
          <PaginationItem>
            <PaginationNext className='cursor-pointer' onClick={increment} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      </div>
        
        </>)
    
      }

}

export default ProblemPagination