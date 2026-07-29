import React from "react";
import { Metadata } from "next";
import { PageContainer } from "@/components/layout/core";
import {
  ContactHero,
  ContactInfo,
  ContactForm,
  FaqSection,
  CallToAction,
} from "@/components/contact";

export const metadata: Metadata = {
  title: "Liên hệ | AgriMarket",
  description:
    "Liên hệ với đội ngũ AgriMarket. Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn về mua bán nông sản an toàn.",
  openGraph: {
    title: "Liên hệ | AgriMarket",
    description:
      "Liên hệ với đội ngũ AgriMarket. Chúng tôi luôn sẵn sàng hỗ trợ bạn.",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-white overflow-hidden">
      <ContactHero />
      <ContactInfo />

      <section className="py-20 border-t border-gray-100">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <FaqSection />
            <ContactForm />
          </div>
        </PageContainer>
      </section>

      <CallToAction />
    </div>
  );
}
