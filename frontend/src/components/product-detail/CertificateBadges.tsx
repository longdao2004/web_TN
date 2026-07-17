import React from "react";
import { ShieldCheck } from "lucide-react";
import { Certificate } from "@/types/product-detail";
import { Tooltip } from "@/components/ui";

interface CertificateBadgesProps {
  certificates: Certificate[];
}

export const CertificateBadges = ({ certificates }: CertificateBadgesProps) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {certificates.map((cert) => (
        <Tooltip
          key={cert.id}
          content={
            <div className="text-xs">
              <p className="font-bold mb-1">{cert.name}</p>
              <p className="opacity-90">{cert.description}</p>
              <p className="mt-2 text-[10px] opacity-75">
                Cấp bởi: {cert.issuedBy}
              </p>
            </div>
          }
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 cursor-help transition-colors hover:bg-emerald-100">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-semibold">{cert.name}</span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};
