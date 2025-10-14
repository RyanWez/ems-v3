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
    <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Top Section - Employee Count */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-center text-gray-700">
          Showing <span className="font-semibold text-blue-600">{displayedEmployees}</span> of{' '}
          <span className="font-semibold text-blue-600">{totalEmployees}</span> employees
        </p>
      </div>

      {/* Bottom Section - Controls */}
      <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">Rows per page:</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-16 h-8 justify-between text-sm">
                {rowsPerPage}
                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
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

        {/* Page info and navigation */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalPages}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors border border-gray-300"
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors border border-gray-300"
              aria-label="Next Page"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};