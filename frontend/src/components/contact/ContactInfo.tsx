import React from "react";
import { PageContainer } from "@/components/layout/core";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { contactInfo } from "@/mock/contact";

export const ContactInfo = () => {
  const cards = [
    {
      id: 1,
      title: "Địa chỉ",
      content: contactInfo.address,
      icon: <MapPin className="h-7 w-7 text-emerald-600" />,
      bgColor: "bg-emerald-50",
    },
    {
      id: 2,
      title: "Hotline",
      content: contactInfo.hotline,
      icon: <Phone className="h-7 w-7 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      title: "Email",
      content: contactInfo.email,
      icon: <Mail className="h-7 w-7 text-amber-600" />,
      bgColor: "bg-amber-50",
    },
    {
      id: 4,
      title: "Thời gian làm việc",
      content: contactInfo.workingHours,
      icon: <Clock className="h-7 w-7 text-purple-600" />,
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <section className="py-12 -mt-12 relative z-20">
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 group flex flex-col items-center text-center"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${card.bgColor} group-hover:scale-110 transition-transform`}
              >
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {card.content}
              </p>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};
