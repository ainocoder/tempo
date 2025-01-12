import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Reservation {
  id: string;
  business_id: string;
  reservation_date: string;
  reservation_time: string;
  status: string;
  business: {
    name: string;
    image: string;
  };
}

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
    fetchReservations();
  }, []);

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select(
          `
          id,
          business_id,
          reservation_date,
          reservation_time,
          status,
          business:businesses(name, image)
        `,
        )
        .order("reservation_date", { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "로그아웃 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">프로필</h1>
          <Button variant="outline" onClick={handleSignOut}>
            로그아웃
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>내 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">이메일: {user?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>예약 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <img
                      src={reservation.business?.image}
                      alt={reservation.business?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {reservation.business?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {reservation.reservation_date}{" "}
                        {reservation.reservation_time}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                        {reservation.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {reservations.length === 0 && (
                <p className="text-center text-gray-500">
                  예약 내역이 없습니다.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
