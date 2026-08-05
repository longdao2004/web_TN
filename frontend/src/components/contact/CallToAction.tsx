import React from "react";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui";

export const CallToAction = () => {
  return (
    <section className="py-20 bg-emerald-600 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-in zoom-in-95 duration-1000">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Cần hỗ trợ ngay?
        </h2>
        <p className="text-lg text-emerald-100 mb-10">
          Đội ngũ chăm sóc khách hàng của chúng tôi luôn trực tuyến để giải
          quyết vấn đề của bạn nhanh nhất.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-gray-50 h-14 px-8 text-lg font-semibold rounded-full shadow-lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            Gọi Hotline
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-2 border-white text-white hover:bg-emerald-700 h-14 px-8 text-lg font-semibold rounded-full"
          >
            <Mail className="w-5 h-5 mr-2" />
            Gửi Email
          </Button>
        </div>
      </div>
    </section>
  );
};
