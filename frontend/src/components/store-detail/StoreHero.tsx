import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Star,
  Package,
} from "lucide-react";
import { StoreActionButtons } from "./StoreActionButtons";

import { Store } from "@/types/store";
import Image from "next/image";

interface StoreHeroProps {
  store: Store;
}

export const StoreHero = ({ store }: StoreHeroProps) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-in fade-in duration-700">
      {/* Banner */}
      {/* Gỡ bỏ overflow-hidden ở thẻ div chứa Banner để Avatar không bị cắt khi rớt xuống dưới */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full bg-gray-100">
        <Image
          src={store.banner}
          alt={`Banner ${store.name}`}
          className="w-full h-full object-cover"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Banner Content (Bottom Left) */}
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex items-end gap-6 z-10">
          {/* Logo */}
          {/* Đã sửa CSS bỏ padding trắng thừa gây lỗi hiển thị khung avatar */}
          <div className="relative z-20 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-xl shrink-0 translate-y-12 sm:translate-y-16 hidden md:block border-4 border-white bg-white overflow-hidden">
            <Image
              src={store.logo}
              alt={store.name}
              className="w-full h-full object-cover"
              width={500}
              height={500}
            />
          </div>

          <div className="flex-1 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tight">
              {store.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm sm:text-base font-medium opacity-90">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {store.address ? store.address.split(",").pop() : 'Đang cập nhật'}
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                {store.reviewsCount > 0 ? (
                  <>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />{" "}
                    {store.rating} ({store.reviewsCount} đánh giá)
                  </>
                ) : (
                  <span className="italic text-gray-300">Chưa có đánh giá</span>
                )}
              </span>
              <span className="hidden md:flex items-center gap-1.5">
                <Package className="w-4 h-4" />{" "}
                {/* Sửa lỗi mất số sản phẩm do bị bỏ statistics */}
                {store.productsCount || 0} sản phẩm
              </span>
            </div>
          </div>

          <div className="hidden lg:block shrink-0">
            <StoreActionButtons />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Info Bar (Below Banner) */}
      <div className="pt-16 sm:pt-20 px-6 pb-6 md:pt-6 md:pl-44 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
        {/* Mobile Logo */}
        <div className="relative z-20 md:hidden absolute -top-12 left-6 w-24 h-24 rounded-2xl shadow-lg shrink-0 border-4 border-white bg-white overflow-hidden">
          <Image
            src={store.logo}
            alt={store.name}
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm text-gray-600 flex-1">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" /> {store.phone || 'Đang cập nhật'}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" /> {store.email || 'Đang cập nhật'}
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />{" "}
            {store.website ? (
              <a
                href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 hover:underline line-clamp-1"
              >
                {store.website}
              </a>
            ) : (
              'Đang cập nhật'
            )}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" /> Tham gia:{" "}
            {store.joinDate}
          </div>
        </div>

        <div className="w-full lg:hidden flex justify-start">
          <StoreActionButtons />
        </div>
      </div>
    </div>
  );
};
