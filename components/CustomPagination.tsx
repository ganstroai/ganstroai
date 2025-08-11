import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export interface PaginationProps {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const generatePageNumbers = (totalPages: number, currentPage: number) => {
  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  // Add ellipsis if there's a gap
  if (currentPage > 3) {
    pages.push("ellipsis-start");
  }

  // Add pages around current page
  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  // Add ellipsis if there's a gap
  if (currentPage < totalPages - 2) {
    pages.push("ellipsis-end");
  }

  // Always show last page if more than 1 page
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
};

const CustomPagination: React.FC<PaginationProps> = ({
  total,
  totalPages,
  currentPage,
  limit,
  handlePageChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className="whitespace-nowrap text-sm text-gray-500">
        Showing {(currentPage - 1) * limit + 1} to{" "}
        {Math.min(currentPage * limit, total)} of {total} users
      </p>
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {generatePageNumbers(totalPages, currentPage).map((page, index) => (
            <PaginationItem key={index}>
              {typeof page === "string" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={currentPage === page}
                  className={`cursor-pointer ${currentPage === page ? "bg-primary text-white hover:bg-primary/90 hover:text-white" : ""}`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
