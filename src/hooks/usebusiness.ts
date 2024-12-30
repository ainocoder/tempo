// src/hooks/useBusinesses.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Business {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  price_range: string;
  description: string;
  location: string;
}

export const useBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

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

  return { businesses, loading };
};

// src/components/home.tsx 수정
import { useBusinesses } from "@/hooks/useBusinesses";

const Home = () => {
  const { businesses, loading } = useBusinesses();
  // ... 기존 state들 유지

  // businesses가 비어있지 않으면 Supabase 데이터를 사용
  const displayBusinesses =
    businesses.length > 0
      ? businesses.map((business) => ({
          ...business,
          priceRange: business.price_range, // API 필드명 매핑
        }))
      : [];

  return { businesses, loading };
};
