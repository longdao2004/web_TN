import React from "react";
import { ShieldCheck, CheckCircle2, Info } from "lucide-react";
import { Certificate } from "@/types/product-detail";

interface CertificateBadgesProps {
  certificates?: Certificate[];
}

export const CertificateBadges = ({ certificates }: CertificateBadgesProps) => {
  const hasCertificates = certificates && certificates.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2.5 py-1">
      {/* TIÊU ĐỀ: CHỨNG NHẬN */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide shrink-0">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Chứng nhận:</span>
      </div>

      {/* 🟢 TRƯỜNG HỢP 1: SẢN PHẨM ĐÃ CÓ CHỨNG NHẬN */}
      {hasCertificates ? (
        <div className="flex flex-wrap items-center gap-2">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              title={`Cơ quan cấp: ${cert.issuedBy || "Bộ Nông nghiệp & PTNT"}\nTiêu chuẩn an toàn vệ sinh thực phẩm.`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs hover:bg-emerald-100 transition-colors cursor-default"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{cert.name}</span>
            </div>
          ))}
        </div>
      ) : (
        /* ⚪ TRƯỜNG HỢP 2: SẢN PHẨM CHƯA CÓ CHỨNG NHẬN */
        <div
          title="Sản phẩm từ trang trại hộ gia đình truyền thống, chưa đăng ký kiểm định VietGAP/OCOP chính thức."
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium cursor-default hover:bg-gray-200/70 transition-colors"
        >
          <Info className="h-3.5 w-3.5 text-gray-400" />
          <span>Chưa đăng ký chứng nhận</span>
        </div>
      )}
    </div>
  );
};