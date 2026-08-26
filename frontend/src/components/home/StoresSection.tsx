import React from "react";
import Link from "next/link";
import { PageContainer, Section } from "@/components/layout/core";
import { storeService } from "@/services/store.service";
import { Badge, Button } from "@/components/ui";
import { Star, Users } from "lucide-react";
import Image from "next/image";

export const StoresSection = async () => {
  let storesList: any[] = [];
  try {
    storesList = await storeService.getStores();
  } catch (error) {
    console.error("Lỗi khi tải danh sách cửa hàng:", error);
  }

  return (
    <Section bgClass="bg-white">
      <PageContainer>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Cửa hàng tiêu biểu
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Các nhà cung cấp uy tín, đạt chứng nhận chất lượng
            </p>
          </div>
          <Link href="/cua-hang">
            <Button variant="outline">Xem tất cả cửa hàng</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {storesList.slice(0, 4).map((store) => (
            <Link
              key={store.id}
              href={`/cua-hang/${store.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {/* Cover Image */}
              <div className="relative h-32 w-full overflow-hidden">
                <Image
                  src={store.banner || "/images/products/carot.avif"}
                  alt={store.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={500}
                  height={500}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Content */}
              <div className="relative flex flex-1 flex-col p-5 pt-12 text-center">
                {/* Avatar */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-sm">
                  <Image
                    src={store.logo || "/images/products/cachuabi.avif"}
                    alt={store.name}
                    className="h-full w-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>

                <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                  {store.name}
                </h3>

                {/* Badges */}
                {store.certificates && store.certificates.length > 0 && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    {store.certificates.slice(0, 2).map((cert, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">
                        {typeof cert === "string" ? cert : cert.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {store.description || "Cửa hàng đang cập nhật mô tả"}
                </p>

                <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-700 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{store.rating || 5}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{store.reviewsCount || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
};
