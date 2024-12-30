import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Business {
  id: string;
  name: string;
  image: string;
  category: string[];
  rating: number;
  price_range: string;
  description: string;
  location: string;
}

export const useBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniquePriceRanges, setUniquePriceRanges] = useState<string[]>([]);

  useEffect(() => {
    fetchBusinesses();

    // Set up realtime subscription
    const subscription = supabase
      .channel("businesses")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "businesses" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBusinesses((prev) => [...prev, payload.new as Business]);
          } else if (payload.eventType === "DELETE") {
            setBusinesses((prev) =>
              prev.filter((business) => business.id !== payload.old.id),
            );
          } else if (payload.eventType === "UPDATE") {
            setBusinesses((prev) =>
              prev.map((business) =>
                business.id === payload.new.id
                  ? (payload.new as Business)
                  : business,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Extract unique values when businesses data changes
    const locations = [...new Set(businesses.map((b) => b.location))];
    const categories = [...new Set(businesses.flatMap((b) => b.category))];
    const priceRanges = [...new Set(businesses.map((b) => b.price_range))];

    setUniqueLocations(locations);
    setUniqueCategories(categories);
    setUniquePriceRanges(priceRanges);
  }, [businesses]);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase.from("businesses").select("*");

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    businesses,
    loading,
    uniqueLocations,
    uniqueCategories,
    uniquePriceRanges,
  };
};
