"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function GoogleCallbackContent() {
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 text-center">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Đang xử lý đăng nhập...</h2>
          <p className="text-gray-500 text-sm">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
