"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const StoreSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/cua-hang?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm placeholder:text-gray-400 font-medium"
        placeholder="Tìm kiếm tên cửa hàng, hợp tác xã..."
      />
    </form>
  );
};