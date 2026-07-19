import { Metadata } from "next";
import { PageContainer } from "@/components/layout/core";
import { mockProductDetail } from "@/mock/product-detail";
import {
  BreadcrumbSection,
  ProductGallery,
  ProductInfo,
  ProductActions,
  StoreInformation,
  CertificateBadges,
  BatchInformation,
  PolicySection,
  ProductTabs,
  RelatedProducts,
} from "@/components/product-detail";

type Props = {
  params: Promise<{ slug: string }>;
};

// Sinh Metadata cho SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;

  // Trong thực tế sẽ fetch API theo slug. Ở đây dùng mock.
  const product = mockProductDetail;

  return {
    title: `${product.name} | Sàn Nông Sản`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  await params;
  const product = mockProductDetail; // Lấy mock data

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12">
      <PageContainer>
        {/* Breadcrumb */}
        <BreadcrumbSection productName={product.name} />

        {/* Main Product Layout */}
        <div className="mt-2 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-[var(--color-border)] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Gallery */}
            <div className="lg:col-span-5">
              <ProductGallery
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <ProductInfo product={product} />

              <CertificateBadges certificates={product.certificates} />

              <div className="w-full h-px bg-gray-100 my-2"></div>

              <BatchInformation batch={product.batch} />

              <div className="w-full h-px bg-gray-100 my-2"></div>

              <ProductActions stock={product.stock} productName={product.name} />

              <div className="w-full h-px bg-gray-100 my-2"></div>

              <PolicySection />
            </div>
          </div>
        </div>

        {/* Store Section */}
        <div className="mt-8">
          <StoreInformation store={product.store} />
        </div>

        {/* Tabs Section */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <RelatedProducts products={product.relatedProducts} />
      </PageContainer>
    </div>
  );
}
