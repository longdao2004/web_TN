import React from "react";
import { Store } from "@/types/store";
import { StoreCard } from "./StoreCard";

interface StoreGridProps {
  stores: Store[];
}

export const StoreGrid = ({ stores }: StoreGridProps) => {
  return (
    <div
      id="store-list-section"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6 duration-700 fade-in delay-150 fill-mode-both"
    >
      {stores.map((store, index) => (
        <div
          key={store.id}
          className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <StoreCard store={store} />
        </div>
      ))}
    </div>
  );
};
