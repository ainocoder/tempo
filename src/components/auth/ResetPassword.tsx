import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import AuthLayout from "./AuthLayout";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      toast({
        title: "이메일 전송 완료",
        description: "비밀번호 재설정 링크를 확인해주세요.",
      });
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="비밀번호 재설정"
      subtitle={
        <>
          계정이 기억나셨나요?{" "}
          <Link to="/login" className="text-primary hover:underline">
            로그인하기
          </Link>
        </>
      }
    >
      <form onSubmit={handleReset} className="mt-8 space-y-6">
        <div>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            placeholder="name@example.com"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "전송 중..." : "재설정 링크 전송"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
