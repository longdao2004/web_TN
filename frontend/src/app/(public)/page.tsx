import React from 'react';
import {
  HeroSection,
  CategoriesSection,
  FeaturedProductsSection,
  NewProductsSection,
  PromoBannerSection,
  StoresSection,
  BuyingProcessSection,
  BenefitsSection,
  ReviewsSection,
  NewsSection,
  NewsletterSection
} from '@/components/home';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <PromoBannerSection />
      <NewProductsSection />
      <StoresSection />
      <BuyingProcessSection />
      <ReviewsSection />
      <NewsSection />
      <NewsletterSection />
    </>
  );
}
