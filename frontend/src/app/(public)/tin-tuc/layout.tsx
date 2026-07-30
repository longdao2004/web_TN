import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin tức & Kiến thức nông sản | AgriMarket',
  description: 'Cập nhật tin tức mới nhất về nông nghiệp, nông sản, xu hướng thị trường và các mẹo hữu ích dành cho cả người tiêu dùng và nhà nông.',
  openGraph: {
    title: 'Tin tức & Kiến thức nông sản | AgriMarket',
    description: 'Cập nhật tin tức mới nhất về nông nghiệp, nông sản, xu hướng thị trường.',
  }
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
