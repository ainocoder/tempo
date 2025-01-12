import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "./../ui/separator";
import { Star, MapPin } from "lucide-react";

interface BusinessCardProps {
  id: string;
  name: string;
  image: string;
  category: string[];
  rating: number;
  priceRange: string;
  description: string;
  location: string;
}

const BusinessCard = ({
  id = "1",
  name = "Sample Business",
  image = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
  category = ["Restaurant"],
  rating = 4.5,
  priceRange = "2만원대",
  description = "A wonderful establishment offering great service and products to our valued customers.",
  location = "YouTube", // Changed default to match FilterSidebar
}: BusinessCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="w-full max-w-[384px] h-[320px] overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer"
      onClick={() => navigate(`/business/${id}`)}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-black">
            {priceRange}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">
            {name}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(category) ? (
            category.map((cat, index) => (
              <Badge key={index} variant="outline" className="w-fit">
                {cat}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="w-fit">
              {category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 text-sm text-gray-600">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center gap-2 text-gray-600">
          <Badge
            variant="secondary"
            className="text-xs flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" /> {location}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BusinessCard;
