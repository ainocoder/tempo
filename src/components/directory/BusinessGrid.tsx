import React from "react";
import BusinessCard from "./BusinessCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Business {
  id: string;
  name: string;
  image: string;
  category: string[];
  rating: number;
  priceRange: string;
  description: string;
  location: string;
}

interface BusinessGridProps {
  businesses: Business[];
  isLoading?: boolean;
}

const defaultBusinesses: Business[] = [
  {
    id: "1",
    name: "Cafe Delights",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop",
    category: ["Cafe"],
    rating: 4.8,
    priceRange: "2만원대",
    description: "A cozy cafe serving artisanal coffee and fresh pastries.",
    location: "YouTube",
  },
  {
    id: "2",
    name: "Tech Hub Store",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop",
    category: ["Electronics"],
    rating: 4.5,
    priceRange: "3만원대",
    description: "Your one-stop shop for all things technology.",
    location: "Instagram",
  },
  {
    id: "3",
    name: "Green Gardens",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop",
    category: ["Nursery"],
    rating: 4.9,
    priceRange: "1만원대",
    description: "Expert plant care and beautiful botanical selections.",
    location: "TikTok",
  },
];

const BusinessGrid = ({
  businesses = defaultBusinesses,
  isLoading = false,
}: BusinessGridProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-full h-[320px]">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 p-6 flex gap-x-12">
      <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex gap-[15.5px]">
        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            id={business.id}
            name={business.name}
            image={business.image}
            category={business.category}
            rating={business.rating}
            priceRange={business.priceRange}
            description={business.description}
            location={business.location}
            className="mx-[8.25px] flex flex-row gap-[7px]"
          />
        ))}
      </div>
    </div>
  );
};

export default BusinessGrid;
