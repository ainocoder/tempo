import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, MapPin, DollarSign } from "lucide-react";
import { useBusiness } from "@/hooks/useBusiness";
import { Skeleton } from "@/components/ui/skeleton";

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { business, loading } = useBusiness(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-[300px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="max-w-4xl mx-auto p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Business not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            className="bg-white/90 hover:bg-white/75"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {business.location}
              </span>
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {business.price_range}
              </span>
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                {business.rating}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {business.category.map((cat, index) => (
            <Badge key={index} variant="outline">
              {cat}
            </Badge>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-600">{business.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
