import React from "react";
import { PaymentMethod as IPaymentMethod } from "@/types/checkout";
import { CreditCard, Banknote, Wallet, Building2 } from "lucide-react";
import { Radio } from "@/components/ui";

interface PaymentMethodProps {
  methods: IPaymentMethod[];
  selectedId: string;
  onChange: (id: string) => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  methods,
  selectedId,
  onChange,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "cod":
        return <Banknote className="h-6 w-6 text-emerald-500" />;
      case "vnpay":
        return <CreditCard className="h-6 w-6 text-blue-500" />;
      case "momo":
        return <Wallet className="h-6 w-6 text-pink-500" />;
      case "bank":
        return <Building2 className="h-6 w-6 text-indigo-500" />;
      default:
        return <CreditCard className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-emerald-500" />
        Phương thức thanh toán
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {methods.map((method) => {
          const isSelected = selectedId === method.id;
          return (
            <div
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`relative flex flex-col justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/30 shadow-sm"
                  : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio
                  checked={isSelected}
                  onChange={() => onChange(method.id)}
                />
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-50">
                  {getIcon(method.iconType)}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold text-sm ${isSelected ? "text-emerald-800" : "text-gray-700"}`}
                  >
                    {method.name}
                  </p>
                </div>
              </div>
              {method.description && isSelected && (
                <div className="mt-3 pl-8 text-xs text-emerald-600/80 animate-in slide-in-from-top-1 fade-in">
                  {method.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
