import React, { useState, useEffect } from "react";
import SearchHeader from "./directory/SearchHeader";
import FilterSidebar from "./directory/FilterSidebar";
import BusinessGrid from "./directory/BusinessGrid";

interface HomeProps {
  initialSearchQuery?: string;
  initialSortValue?: string;
  isSidebarOpen?: boolean;
}

const defaultBusinesses = [
  {
    id: "1",
    name: "Downtown Cafe",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop",
    category: "Restaurant",
    rating: 4.5,
    priceRange: "2만원대",
    description: "A cozy cafe in the heart of downtown.",
    location: "Downtown",
  },
  {
    id: "2",
    name: "Tech Store",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop",
    category: "Retail",
    rating: 4.8,
    priceRange: "3만원대",
    description: "Latest gadgets and tech accessories.",
    location: "West End",
  },
  {
    id: "3",
    name: "Fitness Center",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop",
    category: "Health & Fitness",
    rating: 4.7,
    priceRange: "2만원대",
    description: "Modern gym with state-of-the-art equipment.",
    location: "East Side",
  },
];

const Home = ({
  initialSearchQuery = "",
  initialSortValue = "relevance",
  isSidebarOpen = true,
}: HomeProps) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortValue, setSortValue] = useState(initialSortValue);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Filter states
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(1);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] =
    useState(defaultBusinesses);

  useEffect(() => {
    let filtered = [...defaultBusinesses];

    // Apply location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((business) =>
        selectedLocations.includes(business.location),
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((business) =>
        selectedCategories.includes(business.category),
      );
    }

    // Apply rating filter
    filtered = filtered.filter((business) => business.rating >= selectedRating);

    // Apply price range filter
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((business) =>
        selectedPriceRanges.includes(business.priceRange),
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(query) ||
          business.description.toLowerCase().includes(query) ||
          business.category.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    switch (sortValue) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredBusinesses(filtered);
  }, [
    searchQuery,
    sortValue,
    selectedLocations,
    selectedCategories,
    selectedRating,
    selectedPriceRanges,
  ]);

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
          <BusinessGrid businesses={filteredBusinesses} />
        </div>
      </div>
    </div>
  );
};

export default Home;
