import React from 'react';
import { MapPin, Phone, Mail, Globe, Calendar, Star, Package } from 'lucide-react';
import { StoreActionButtons } from './StoreActionButtons';

interface StoreHeroProps {
  store: any; // Type from mock
}

export const StoreHero = ({ store }: StoreHeroProps) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-in fade-in duration-700">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-gray-100">
        <img 
          src={store.banner} 
          alt={`Banner ${store.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        {/* Banner Content (Bottom Left) */}
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex items-end gap-6">
          {/* Logo */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white p-1.5 shadow-xl shrink-0 translate-y-12 sm:translate-y-16 hidden md:block">
            <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="flex-1 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tight">
              {store.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm sm:text-base font-medium opacity-90">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {store.address.split(',').pop()}</span>
              <span className="hidden sm:flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {store.rating} ({store.reviewsCount} đánh giá)</span>
              <span className="hidden md:flex items-center gap-1.5"><Package className="w-4 h-4" /> {store.statistics?.totalProducts} sản phẩm</span>
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
        <div className="md:hidden absolute -top-12 left-6 w-24 h-24 rounded-2xl bg-white p-1 shadow-lg shrink-0">
          <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
            <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm text-gray-600 flex-1">
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {store.phone}</div>
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {store.email}</div>
          <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-gray-400" /> <a href={`https://${store.website}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">{store.website}</a></div>
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> Tham gia: {store.joinDate}</div>
        </div>
        
        <div className="w-full lg:hidden flex justify-start">
          <StoreActionButtons />
        </div>
      </div>
    </div>
  );
};
