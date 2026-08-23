"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Lưu token vào trạng thái và localStorage
      setToken(token);
      toast.success("Đăng nhập bằng Google thành công!", {
        description: "Chào mừng bạn đến với AgriMarket.",
      });
      // Chuyển hướng về trang chủ
      router.push("/");
    } else {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      router.push("/dang-nhap");
    }
  }, [searchParams, router, setToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
      <h2 className="text-xl font-medium text-gray-800">Đang xử lý đăng nhập...</h2>
      <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
