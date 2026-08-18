"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Card } from "@/components/ui";
import { userService } from "@/services/user.service";
import { UserProfile, UpdateProfileRequest } from "@/types/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    fullName: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

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
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông tin hồ sơ");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

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
    // Xóa lỗi nếu người dùng đang nhập lại
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const updatedProfile = await userService.updateProfile(formData);
      setProfile(updatedProfile);
      setFormData({
        fullName: updatedProfile.fullName || "",
        phone: updatedProfile.phone || "",
        address: updatedProfile.address || "",
      });
      setIsDirty(false);
      toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
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
