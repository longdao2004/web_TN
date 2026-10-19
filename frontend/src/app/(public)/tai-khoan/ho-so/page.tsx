"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Card } from "@/components/ui";
import { userService } from "@/services/user.service";
import { UserProfile, UpdateProfileRequest } from "@/types/user";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    fullName: "",
    phone: "",
    address: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const { logout, fetchUser } = useAuthStore();
  const router = useRouter();

  async function fetchProfile() {
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        fullName: data.fullName || "",
        phone: data.phone || "",
        address: data.address || "",
      });
      setIsDirty(false);
    } catch (error: any) {
      if (error.message === 'UNAUTHORIZED') {
        logout();
        toast.error("Phiên đăng nhập đã hết hạn");
        router.push("/dang-nhap");
      } else {
        console.error(error);
        toast.error("Không thể tải thông tin hồ sơ");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh không được vượt quá 5MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    }
    
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName || "");
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("address", formData.address || "");
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const updatedProfile = await userService.updateProfile(formDataToSend as any);
      setProfile(updatedProfile);
      setFormData({
        fullName: updatedProfile.fullName || "",
        phone: updatedProfile.phone || "",
        address: updatedProfile.address || "",
      });
      setAvatarFile(null);
      setAvatarPreview("");
      setIsDirty(false);
      
      // Đồng bộ ảnh mới lên Topbar / Header ngay lập tức
      await fetchUser();
      toast.success("Cập nhật hồ sơ và ảnh đại diện thành công!");
    } catch (error: any) {
      if (error.message === 'UNAUTHORIZED') {
        logout();
        toast.error("Phiên đăng nhập đã hết hạn");
        router.push("/dang-nhap");
      } else {
        console.error(error);
        toast.error("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
      setAvatarFile(null);
      setAvatarPreview("");
      setErrors({});
      setIsDirty(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Không thể tải thông tin hồ sơ
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Hồ sơ cá nhân
      </h1>

      {/* KHUNG ẢNH ĐẠI DIỆN AVATAR */}
      <div className="flex items-center gap-6 pb-6 border-b border-gray-100 mb-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md bg-gray-50 flex items-center justify-center">
            {avatarPreview || profile.avatarUrl ? (
              <img
                src={avatarPreview || profile.avatarUrl || ""}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-emerald-700">
                {profile.fullName?.charAt(0) || "U"}
              </span>
            )}
          </div>

          <label
            htmlFor="avatar-upload-input"
            className="absolute bottom-0 right-0 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg cursor-pointer transition transform hover:scale-110"
            title="Đổi ảnh đại diện"
          >
            <Camera className="w-4 h-4" />
            <input
              id="avatar-upload-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 text-base">{profile.fullName}</h3>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <label 
            htmlFor="avatar-upload-input"
            className="inline-block text-xs text-emerald-600 hover:text-emerald-700 hover:underline mt-1 font-medium cursor-pointer"
          >
            Bấm vào biểu tượng máy ảnh để tải ảnh mới (tối đa 5MB)
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        {/* Email (Readonly) */}
        <div>
          <Input
            label="Địa chỉ Email"
            type="email"
            value={profile.email}
            disabled
            className="bg-gray-50"
            onChange={() => {}}
          />
          <p className="mt-1 text-xs text-gray-500">
            Email không thể thay đổi
          </p>
        </div>

        {/* Full Name */}
        <div>
          <Input
            label="Họ và tên"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            error={errors.fullName}
            placeholder="Nhập họ và tên của bạn"
          />
        </div>

        {/* Phone */}
        <div>
          <Input
            label="Số điện thoại"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
            placeholder="Nhập số điện thoại (tùy chọn)"
          />
        </div>

        {/* Address */}
        <div>
          <Input
            label="Địa chỉ"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            error={errors.address}
            placeholder="Nhập địa chỉ nhận hàng (tùy chọn)"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center gap-4">
          <Button
            type="submit"
            disabled={!isDirty || isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={handleCancel}
            >
              Hủy
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
