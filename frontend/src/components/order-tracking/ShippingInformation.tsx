import React from "react";
import { Order } from "@/types/order";
import { MapPin, User, Phone, FileText } from "lucide-react";

interface ShippingInformationProps {
  info: Order["deliveryInfo"];
}

export const ShippingInformation = ({ info }: ShippingInformationProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm h-full animate-in slide-in-from-bottom-8 duration-700 fade-in">
      <div className="flex items-center gap-2 mb-5">
        <MapPin className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-gray-900">Địa chỉ nhận hàng</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 text-gray-700">
          <User className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <span className="text-xs text-gray-500 block mb-0.5">
              Tên người nhận
            </span>
            <span className="font-semibold text-gray-900">{info.name}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 text-gray-700">
          <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <span className="text-xs text-gray-500 block mb-0.5">
              Số điện thoại
            </span>
            <span className="font-medium text-gray-900">{info.phone}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 text-gray-700">
          <div className="w-4 h-4 rounded-full border border-gray-300 mt-1 flex-shrink-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
          </div>
          <div>
            <span className="text-xs text-gray-500 block mb-0.5">
              Địa chỉ giao hàng
            </span>
            <p className="text-sm leading-relaxed text-gray-900">
              {info.address}
            </p>
          </div>
        </div>

        {info.note && (
          <div className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl mt-2 border border-gray-100">
            <FileText className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-gray-700 block mb-0.5">
                Ghi chú từ bạn
              </span>
              <p className="text-sm text-gray-600 italic">{info.note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
