import React from "react";
import { StoreCard } from "@/components/store-list/StoreCard";

import { Store } from "@/types/store";

interface RelatedStoresProps {
  stores: Store[];
}

export const RelatedStores = ({ stores }: RelatedStoresProps) => {
  if (!stores || stores.length === 0) return null;

  return (
    <div className="mt-16 animate-in slide-in-from-bottom-12 duration-1000 fade-in delay-700">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 text-center">
          Cửa hàng tương tự
        </h2>
        <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};
