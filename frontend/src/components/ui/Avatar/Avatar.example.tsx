import React from "react";
import { Avatar } from "./Avatar";

export const AvatarExample = () => {
  return (
    <div className="flex flex-col gap-6 p-8 bg-white max-w-md">
      <div className="flex gap-4 items-end">
        <Avatar size="sm" fallback="Nguyễn Văn A" />
        <Avatar size="md" fallback="Lê Bình" />
        <Avatar size="lg" fallback="Trần C" />
        <Avatar size="xl" src="/images/avatars/av1.avif" alt="Shadcn" />
      </div>

      <div className="flex gap-4 items-end">
        {/* Hình vuông bo nhẹ */}
        <Avatar size="lg" rounded={false} src="/images/avatars/av1.avif" />
        {/* Lỗi ảnh -> Rớt về Fallback User Icon */}
        <Avatar size="lg" src="/images/avatars/av1.avif" />
      </div>
    </div>
  );
};
