import React from 'react';
import Link from 'next/link';
import { Store, Star, ChevronRight } from 'lucide-react';
import { Order } from '@/types/order';

interface StoreInformationProps {
  store: Order['store'];
}

export const StoreInformation = ({ store }: StoreInformationProps) => {
  if (!store) return null;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-8 duration-700 fade-in delay-200 fill-mode-both">
      <div className="flex items-center gap-2 mb-4">
        <Store className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-gray-900">Thông tin cửa hàng</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shrink-0">
          <img 
            src={store.logo || 'https://images.unsplash.com/photo-1595858603510-9ce3b708b792?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=60'} 
            alt={store.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{store.name}</h3>
          <div className="flex items-center gap-1 mt-1 text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-gray-700">{store.rating || 5.0}</span>
          </div>
          <p className="text-xs text-gray-500 truncate mt-1">{store.address}</p>
        </div>

        <Link 
          href={`/cua-hang/${store.slug}`}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-colors border border-gray-100 hover:border-emerald-200"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
