"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Card } from "@/components/ui";
import { userService } from "@/services/user.service";
import { UserProfile } from "@/types/user";
import { toast } from "sonner";
import { Loader2, MapPin, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AddressPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { logout } = useAuthStore();
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setAddress(data.address || "");
    } catch (error: any) {
      if (error.message === 'UNAUTHORIZED') {
        logout();
        toast.error("Phiên đăng nhập đã hết hạn");
        router.push("/dang-nhap");
      } else {
        toast.error("Không thể tải thông tin địa chỉ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!address.trim()) {
      toast.error("Vui lòng nhập địa chỉ cụ thể");
      return;
    }

    setIsSaving(true);
    try {
      // Giữ nguyên các thông tin khác, chỉ cập nhật mỗi địa chỉ
      const updatedProfile = await userService.updateProfile({
        fullName: profile?.fullName || "",
        phone: profile?.phone || "",
        address: address,
      });
      setProfile(updatedProfile);
      setAddress(updatedProfile.address || "");
      setIsEditing(false);
      toast.success("Cập nhật địa chỉ nhận hàng thành công");
    } catch (error: any) {
      toast.error("Lỗi khi lưu địa chỉ. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Địa chỉ nhận hàng</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            + Thêm / Sửa địa chỉ
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cập nhật địa chỉ mặc định</h2>
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ chi tiết (Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố)
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                rows={3}
                placeholder="Ví dụ: Số 123, Đường Hùng Vương, Phường 1, Quận 10, TP.HCM"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Lưu địa chỉ
              </Button>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setAddress(profile?.address || "");
              }} disabled={isSaving}>
                Hủy
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          <div className="relative overflow-hidden bg-white border border-[var(--color-primary)]/30 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-2 h-full bg-[var(--color-primary)]"></div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full shrink-0">
                <Home className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{profile?.fullName}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    Mặc định
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-700">Điện thoại:</span> {profile?.phone || "Chưa cập nhật"}
                </div>
                <div className="text-sm text-gray-600 flex items-start gap-1">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                  <span>{profile?.address || "Bạn chưa thiết lập địa chỉ nhận hàng mặc định."}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
