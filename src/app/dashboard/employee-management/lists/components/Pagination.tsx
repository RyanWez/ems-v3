'use client';
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalEmployees: number;
  displayedEmployees: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onRowsPerPageChange: (value: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  rowsPerPage,
  totalEmployees,
  displayedEmployees,
  onNextPage,
  onPrevPage,
  onRowsPerPageChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
      <div className="mb-3 sm:mb-0 text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{displayedEmployees}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalEmployees}</span> employees.
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Rows per page:</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-[70px] justify-between">
                {rowsPerPage}
                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[10, 20, 50, 100].map((value) => (
                <DropdownMenuItem
                  key={value}
                  onSelect={() => onRowsPerPageChange(value)}
                  className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-sm text-gray-600">
          Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};