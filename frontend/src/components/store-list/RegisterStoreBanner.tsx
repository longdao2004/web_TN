"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Store, X, Loader2, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { storeService } from "@/services/store.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const RegisterStoreBanner = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
  });

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đăng ký mở gian hàng!");
      router.push("/dang-nhap");
      return;
    }

    if (user?.role === "SELLER") {
      toast.info("Bạn đã có gian hàng trên hệ thống!");
      router.push("/seller");
      return;
    }

    setFormData({
      name: "",
      address: user?.address || "",
      phone: user?.phone || "",
      description: "",
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên cửa hàng!");
      return;
    }

    setIsLoading(true);
    try {
      await storeService.createStore(formData);
      
      // Thông báo rõ ràng: Yêu cầu cần chờ Admin duyệt
      toast.success("Đã gửi yêu cầu đăng ký gian hàng thành công!", {
        description: "Thông tin gian hàng đã được lưu. Quản trị viên (Admin) sẽ kiểm tra và cấp quyền Người bán cho bạn.",
        duration: 5000,
      });
      
      // Đóng popup, giữ người dùng ở lại trang hiện tại (KHÔNG tự ý nhảy vào /seller)
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Đăng ký gian hàng thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* BANNER MỞ MODAL */}
      <div 
        onClick={handleOpenModal}
        className="group relative w-full h-[220px] sm:h-[300px] md:h-[360px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 mb-8 sm:mb-12 border border-emerald-100"
      >
        <Image
          src="/images/banners/banner.png"
          alt="Đăng ký mở gian hàng nông sản"
          fill
          priority
          className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      </div>

      {/* MODAL ĐIỀN THÔNG TIN ĐĂNG KÝ */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                <Store className="w-5 h-5" /> Đăng ký mở Cửa hàng
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tên cửa hàng / Nhà vườn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nông trại Hữu cơ Đà Lạt..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Địa chỉ vườn / Nơi canh tác <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thôn 2, Xã Lạc Dương, Lâm Đồng..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mô tả ngắn về gian hàng
                </label>
                <textarea
                  rows={3}
                  placeholder="Giới thiệu về quy mô canh tác, chứng nhận VietGAP/OCOP của vườn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Gửi yêu cầu đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};