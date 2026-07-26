import React from 'react';
import { Metadata } from 'next';
import {
  AboutHero,
  StorySection,
  CoreValues,
  WorkingProcess,
  TargetUsers,
  Statistics,
  Commitments,
  CallToAction
} from '@/components/about';

export const metadata: Metadata = {
  title: 'Giới thiệu AgriMarket | Kết nối nông sản sạch',
  description: 'Nền tảng thương mại điện tử giúp kết nối nông dân, cửa hàng nông sản và người tiêu dùng trên toàn quốc. Đảm bảo chất lượng, minh bạch và an toàn.',
  openGraph: {
    title: 'Giới thiệu AgriMarket | Kết nối nông sản sạch',
    description: 'Nền tảng thương mại điện tử giúp kết nối nông dân, cửa hàng nông sản và người tiêu dùng trên toàn quốc.',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2000&auto=format&fit=crop'],
  }
};

export default function AboutPage() {
  return (
    <div className="bg-white overflow-hidden">
      <AboutHero />
      <StorySection />
      <CoreValues />
      <WorkingProcess />
      <TargetUsers />
      <Statistics />
      <Commitments />
      <CallToAction />
    </div>
  );
}
