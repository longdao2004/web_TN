import React from 'react';
import { MapPin, User, Phone } from 'lucide-react';
import { Order } from '@/types/order';

interface DeliveryInformationProps {
  info: Order['deliveryInfo'];
}

export const DeliveryInformation = ({ info }: DeliveryInformationProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-6 duration-700 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-gray-900">Địa chỉ nhận hàng</h2>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-gray-700">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-semibold">{info.name}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{info.phone}</span>
        </div>
        
        <div className="flex items-start gap-3 text-gray-700 mt-1">
          <div className="w-4 h-4 rounded-full border border-gray-300 mt-1 flex-shrink-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
          </div>
          <p className="text-sm leading-relaxed">{info.address}</p>
        </div>
      </div>
    </div>
  );
};
