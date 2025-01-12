import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, MapPin, DollarSign, Calendar } from "lucide-react";
import { useBusiness } from "@/hooks/useBusiness";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Reservation {
  id: string;
  business_id: string;
  user_id: string;
  reservation_date: string;
  reservation_time: string;
  status: "pending" | "confirmed" | "cancelled";
}

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { business, loading } = useBusiness(id);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [existingReservations, setExistingReservations] = useState<
    Reservation[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Generate time slots (30-minute intervals from 9 AM to 9 PM)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? "00" : "30";
    if (hour < 21) {
      return `${hour.toString().padStart(2, "0")}:${minute}`;
    }
    return null;
  }).filter(Boolean) as string[];

  // Fetch existing reservations
  useEffect(() => {
    const fetchReservations = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("business_id", id);

      if (error) {
        console.error("Error fetching reservations:", error);
        return;
      }

      setExistingReservations(data || []);
    };

    fetchReservations();
  }, [id]);

  // Check if a time slot is already reserved
  const isTimeSlotReserved = (date: Date, timeSlot: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return existingReservations.some(
      (res) =>
        res.reservation_date === dateStr && res.reservation_time === timeSlot,
    );
  };

  const handleReservation = async () => {
    if (!date || !time || !id) return;

    setIsSubmitting(true);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not found");

      // Create reservation
      const { data, error } = await supabase
        .from("reservations")
        .insert([
          {
            business_id: id,
            user_id: user.id,
            reservation_date: format(date, "yyyy-MM-dd"),
            reservation_time: time,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "예약이 완료되었습니다",
        description: `${format(date, "yyyy년 MM월 dd일")} ${time}`,
      });

      // Add the new reservation to the local state
      setExistingReservations([...existingReservations, data]);
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({
        title: "예약 실패",
        description: "예약 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                예약하기
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>예약 날짜와 시간 선택</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                    modifiers={{
                      booked: (date) =>
                        timeSlots.every((slot) =>
                          isTimeSlotReserved(date, slot),
                        ),
                    }}
                    modifiersStyles={{
                      booked: { textDecoration: "line-through", opacity: 0.5 },
                    }}
                  />
                </div>
                {date && (
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="시간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => {
                        const isReserved = isTimeSlotReserved(date, slot);
                        return (
                          <SelectItem
                            key={slot}
                            value={slot}
                            disabled={isReserved}
                          >
                            {slot}
                            {isReserved && " (예약됨)"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleReservation}
                  disabled={!date || !time || isSubmitting}
                >
                  {isSubmitting ? "예약 중..." : "예약 확정"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
