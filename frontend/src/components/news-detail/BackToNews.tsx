import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export const BackToNews = () => {
  return (
    <Link href="/tin-tuc" className="inline-block mt-12 mb-8">
      <Button
        variant="ghost"
        className="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 gap-2 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại trang Tin tức
      </Button>
    </Link>
  );
};
