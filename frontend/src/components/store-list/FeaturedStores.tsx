import React from "react";
import { Store } from "@/types/store";
import { StoreCard } from "./StoreCard";
import { Sparkles } from "lucide-react";

interface FeaturedStoresProps {
  stores: Store[];
}

export const FeaturedStores = ({ stores }: FeaturedStoresProps) => {
  if (!stores || stores.length === 0) return null;

  return (
    <div className="mb-12 sm:mb-16 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-200 fill-mode-both">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Cửa hàng nổi bật
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stores.slice(0, 3).map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};
