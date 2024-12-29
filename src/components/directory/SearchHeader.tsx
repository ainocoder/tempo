import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchHeaderProps {
  onSearch?: (query: string) => void;
  onSortChange?: (value: string) => void;
  onFilterClick?: () => void;
  searchQuery?: string;
  sortValue?: string;
}

const SearchHeader = ({
  onSearch = () => {},
  onSortChange = () => {},
  onFilterClick = () => {},
  searchQuery = "",
  sortValue = "relevance",
}: SearchHeaderProps) => {
  return (
    <header className="sticky top-0 w-full h-20 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-2xl relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for businesses..."
              className="pl-10 pr-4 h-11 w-full"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={sortValue} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={onFilterClick}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
