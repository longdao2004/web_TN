import React from 'react';
import { ShieldCheck, Star, Leaf, Award } from 'lucide-react';

interface StoreCertificatesProps {
  certificates: any[];
}

export const StoreCertificates = ({ certificates }: StoreCertificatesProps) => {
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'shield': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'star': return <Star className="w-5 h-5 text-amber-500" />;
      case 'leaf': return <Leaf className="w-5 h-5 text-green-500" />;
      case 'award': return <Award className="w-5 h-5 text-blue-500" />;
      default: return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full animate-in slide-in-from-bottom-6 duration-700 fade-in delay-150">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Chứng nhận chất lượng</h2>
      
      <div className="flex flex-col gap-4">
        {certificates.map((cert, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-gray-100 group-hover:border-emerald-200">
              {getIcon(cert.icon)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{cert.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
