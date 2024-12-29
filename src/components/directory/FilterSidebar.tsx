import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Star, Tags } from "lucide-react";

interface FilterSidebarProps {
  onLocationChange?: (locations: string[]) => void;
  onCategoryChange?: (categories: string[]) => void;
  onRatingChange?: (rating: number) => void;
  onPriceRangeChange?: (priceRange: string[]) => void;
}

const FilterSidebar = ({
  onLocationChange = () => {},
  onCategoryChange = () => {},
  onRatingChange = () => {},
  onPriceRangeChange = () => {},
}: FilterSidebarProps) => {
  const locations = [
    "Downtown",
    "West End",
    "East Side",
    "North District",
    "South Bay",
  ];

  const categories = [
    "Restaurants",
    "Retail",
    "Services",
    "Entertainment",
    "Health & Fitness",
  ];

  const priceRanges = ["1만원대", "2만원대", "3만원대", "4만원대"];

  // Local state for selected items
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked
      ? [...selectedLocations, location]
      : selectedLocations.filter((l) => l !== location);
    setSelectedLocations(newLocations);
    onLocationChange(newLocations);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);
    setSelectedCategories(newCategories);
    onCategoryChange(newCategories);
  };

  const handlePriceRangeClick = (price: string) => {
    const newPriceRanges = selectedPriceRanges.includes(price)
      ? selectedPriceRanges.filter((p) => p !== price)
      : [...selectedPriceRanges, price];
    setSelectedPriceRanges(newPriceRanges);
    onPriceRangeChange(newPriceRanges);
  };

  return (
    <aside className="w-80 h-full border-r bg-white p-4 overflow-y-auto">
      <div className="space-y-6">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="location"
        >
          <AccordionItem value="location">
            <AccordionTrigger className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={(checked) =>
                        handleLocationChange(location, checked as boolean)
                      }
                    />
                    <Label htmlFor={`location-${location}`}>{location}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="category">
            <AccordionTrigger className="flex items-center gap-2">
              <Tags className="w-4 h-4" />
              <span>Category</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rating">
            <AccordionTrigger className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Rating</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 px-2">
                <Slider
                  defaultValue={[4]}
                  max={5}
                  min={1}
                  step={0.5}
                  onValueChange={(value) => onRatingChange(value[0])}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>1★</span>
                  <span>5★</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>Price Range</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {priceRanges.map((price) => (
                  <Badge
                    key={price}
                    variant={
                      selectedPriceRanges.includes(price)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handlePriceRangeClick(price)}
                  >
                    {price}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
};

export default FilterSidebar;
