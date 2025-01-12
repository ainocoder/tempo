import React, { useState } from "react";
import SearchHeader from "./directory/SearchHeader";
import FilterSidebar from "./directory/FilterSidebar";
import BusinessGrid from "./directory/BusinessGrid";
import { useBusinesses } from "@/hooks/useBusinesses";

interface HomeProps {
  initialSearchQuery?: string;
  initialSortValue?: string;
  isSidebarOpen?: boolean;
}

const Home = ({
  initialSearchQuery = "",
  initialSortValue = "relevance",
  isSidebarOpen = true,
}: HomeProps) => {
  const { businesses, loading } = useBusinesses();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortValue, setSortValue] = useState(initialSortValue);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Filter states
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(1);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  // Map the businesses data to match the expected format
  const displayBusinesses = businesses.map((business) => ({
    ...business,
    priceRange: business.price_range,
  }));

  // Apply filters
  const filteredBusinesses = displayBusinesses.filter((business) => {
    // Apply location filter
    if (
      selectedLocations.length > 0 &&
      !selectedLocations.includes(business.location)
    ) {
      return false;
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      const hasMatchingCategory = business.category.some((cat) =>
        selectedCategories.includes(cat),
      );
      if (!hasMatchingCategory) {
        return false;
      }
    }

    // Apply rating filter
    if (business.rating < selectedRating) {
      return false;
    }

    // Apply price range filter
    if (
      selectedPriceRanges.length > 0 &&
      !selectedPriceRanges.includes(business.price_range)
    ) {
      return false;
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        business.name.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query) ||
        business.category.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Apply sorting
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortValue) {
      case "rating":
        return b.rating - a.rating;
      case "alphabetical":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SearchHeader
        searchQuery={searchQuery}
        sortValue={sortValue}
        onSearch={setSearchQuery}
        onSortChange={setSortValue}
        onFilterClick={() => setShowMobileSidebar(!showMobileSidebar)}
      />
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            onLocationChange={setSelectedLocations}
            onCategoryChange={setSelectedCategories}
            onRatingChange={setSelectedRating}
            onPriceRangeChange={setSelectedPriceRanges}
          />
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`
          lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <FilterSidebar
            onLocationChange={setSelectedLocations}
            onCategoryChange={setSelectedCategories}
            onRatingChange={setSelectedRating}
            onPriceRangeChange={setSelectedPriceRanges}
          />
        </div>

        {/* Mobile Sidebar Backdrop */}
        {showMobileSidebar && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1">
          <BusinessGrid businesses={sortedBusinesses} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Home;
