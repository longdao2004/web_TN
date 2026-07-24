import React from "react";
import Link from "next/link";
import { Store } from "@/types/store";
import { Star, Package, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui";

interface StoreCardProps {
  store: Store;
}

export const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <Link href={`/cua-hang/${store.slug}`} className="group block h-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 overflow-hidden h-full flex flex-col group-hover:-translate-y-1">
        {/* Banner */}
        <div className="relative h-32 w-full bg-gray-100 overflow-hidden">
          <img
            src={store.banner}
            alt={`Banner ${store.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="px-5 pb-6 flex-1 flex flex-col relative pt-12">
          {/* Logo (Overlapping Banner) */}
          <div className="absolute -top-10 left-5">
            <div className="w-20 h-20 bg-white rounded-xl p-1 shadow-md">
              <div className="w-full h-full rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                <img
                  src={store.logo}
                  alt={`Logo ${store.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {store.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-1 mt-1">
              {store.address}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {store.certificates.slice(0, 2).map((cert, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] px-2 py-0.5 border-emerald-100"
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                {cert}
              </Badge>
            ))}
            {store.certificates.length > 2 && (
              <Badge
                variant="secondary"
                className="bg-gray-50 text-gray-600 text-[10px] px-2 py-0.5"
              >
                +{store.certificates.length - 2}
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
            {store.description}
          </p>

          <div className="w-full h-px bg-gray-100 mb-4"></div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Package className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">{store.productsCount}</span>
              <span className="text-gray-500 text-xs">sản phẩm</span>
            </div>

            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-900">
                {store.rating}
              </span>
              <span className="text-gray-400 text-xs">
                ({store.reviewsCount})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
