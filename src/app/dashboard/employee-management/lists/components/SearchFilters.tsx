'use client';
import React from 'react';
import { Search, ChevronsUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPosition: string;
  onPositionChange: (position: string) => void;
  selectedGender: string;
  onGenderChange: (gender: string) => void;
  selectedServiceYears: string;
  onServiceYearsChange: (serviceYears: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedPosition,
  onPositionChange,
  selectedGender,
  onGenderChange,
  selectedServiceYears,
  onServiceYearsChange
}) => {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Search Bar */}
        <div className="flex-1 min-w-0">
          <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              id="search"
              placeholder="Search by Name, Position, Phone Number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Position Filter */}
        <div className="w-full lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedPosition}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {['All Positions', 'Super', 'Leader', 'Account Department', 'Operation'].map((position) => (
                <DropdownMenuItem
                  key={position}
                  onSelect={() => onPositionChange(position)}
                  className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
                >
                  {position}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Gender Filter */}
        <div className="w-full lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedGender}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {['All Genders', 'Male', 'Female'].map((gender) => (
                <DropdownMenuItem
                  key={gender}
                  onSelect={() => onGenderChange(gender)}
                  className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
                >
                  {gender}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Service Years Filter */}
        <div className="w-full lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Years</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedServiceYears}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {['Any Service Years', 'Less than 6 months', '1-2 years', '3-4 years', '4-10 years'].map((years) => (
                <DropdownMenuItem
                  key={years}
                  onSelect={() => onServiceYearsChange(years)}
                  className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
                >
                  {years}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};