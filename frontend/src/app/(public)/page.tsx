import React from "react";
import {
  HeroSection,
  CategoriesSection,
  ProductTabsSection, 
  PromoBannerSection,
  StoresSection,
  BuyingProcessSection,
  BenefitsSection,
  ReviewsSection,
  NewsSection,
  NewsletterSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <CategoriesSection />
      
      {/* KHỐI SẢN PHẨM TABS THÔNG MINH (THAY THẾ 2 KHỐI CŨ) */}
      <ProductTabsSection />

      <PromoBannerSection />
      <StoresSection />
      <BuyingProcessSection />
      <ReviewsSection />
      <NewsSection />
      <NewsletterSection />
    </>
  );
}