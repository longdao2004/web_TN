import React from "react";
import { Address } from "@/types/checkout";
import { MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui";

interface AddressCardProps {
  address: Address;
  onChangeAddress?: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onChangeAddress,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>

      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="mt-1 flex-shrink-0 text-emerald-500">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              Thông tin nhận hàng
              {address.isDefault && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Mặc định
                </span>
              )}
            </h3>

            <div className="mt-3 space-y-1.5 text-sm text-gray-600">
              <p className="font-medium text-gray-900">
                {address.fullName} - {address.phone}
              </p>
              <p>{address.email}</p>
              <p>{address.addressLine}</p>
              <p>{`${address.ward}, ${address.district}, ${address.province}`}</p>
              {address.notes && (
                <p className="italic text-gray-500 text-xs mt-2">
                  Ghi chú: {address.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onChangeAddress}
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          leftIcon={<Pencil className="h-4 w-4" />}
        >
          Thay đổi
        </Button>
      </div>
    </div>
  );
};
