import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Business } from "./useBusinesses";

export const useBusiness = (id: string) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusiness();

    // Set up realtime subscription for this specific business
    const subscription = supabase
      .channel(`business-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "businesses",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setBusiness(payload.new as Business);
          } else if (payload.eventType === "DELETE") {
            setBusiness(null);
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  const fetchBusiness = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setBusiness(data);
    } catch (error) {
      console.error("Error fetching business:", error);
    } finally {
      setLoading(false);
    }
  };

  return { business, loading };
};
