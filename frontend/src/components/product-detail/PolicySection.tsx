import React from "react";
import { Truck, RotateCcw, ShieldAlert, CreditCard } from "lucide-react";

export const PolicySection = () => {
  const policies = [
    {
      icon: <Truck className="h-5 w-5 text-blue-500" />,
      title: "Giao hàng hỏa tốc",
      desc: "Nhận hàng trong 2h tại khu vực nội thành",
    },
    {
      icon: <RotateCcw className="h-5 w-5 text-emerald-500" />,
      title: "Đổi trả miễn phí",
      desc: "Hỗ trợ đổi trả trong 24h nếu sản phẩm hư hỏng",
    },
    {
      icon: <ShieldAlert className="h-5 w-5 text-amber-500" />,
      title: "Bảo hành chất lượng",
      desc: "Cam kết 100% tươi sạch, hoàn tiền gấp đôi nếu phát hiện hàng giả",
    },
    {
      icon: <CreditCard className="h-5 w-5 text-purple-500" />,
      title: "Thanh toán an toàn",
      desc: "Hỗ trợ COD, thẻ tín dụng và ví điện tử",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {policies.map((item, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div className="mt-0.5 shrink-0 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            {item.icon}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">
              {item.title}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
