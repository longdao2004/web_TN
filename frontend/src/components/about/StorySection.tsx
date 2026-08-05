import React from "react";
import { PageContainer } from "@/components/layout/core";
import Image from "next/image";

export const StorySection = () => {
  return (
    <section className="py-20 bg-white">
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Câu chuyện của chúng tôi
            </h2>

            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                Ra đời từ trăn trở về điệp khúc &quot;được mùa mất giá&quot;,
                AgriMarket được xây dựng với mục tiêu giải quyết bài toán đầu ra
                cho nông sản Việt Nam.
              </p>
              <p>
                Chúng tôi nhận thấy khoảng cách quá lớn từ nông trại đến bàn ăn,
                qua nhiều khâu trung gian khiến giá thành đội lên, trong khi
                chất lượng lại khó kiểm soát và thu nhập của người nông dân
                không tương xứng với công sức bỏ ra.
              </p>
              <p className="font-medium text-gray-900 border-l-4 border-emerald-500 pl-4 py-1">
                &quot;AgriMarket ra đời như một cầu nối số, đưa nông sản sạch từ
                những cánh đồng xanh ngát đến tận tay người tiêu dùng một cách
                nhanh chóng và minh bạch nhất.&quot;
              </p>
              <p>
                Thông qua nền tảng công nghệ hiện đại, chúng tôi mong muốn xây
                dựng một hệ sinh thái nông nghiệp bền vững, mang lại giá trị
                thực cho cả người nông dân và khách hàng.
              </p>
            </div>
          </div>

          <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000">
            <Image
              src="https://images.unsplash.com/photo-1595858603510-9ce3b708b792?q=80&w=1000&auto=format&fit=crop"
              alt="Người nông dân thu hoạch"
              className="absolute inset-0 h-full w-full object-cover"
              width={500}
              height={500}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-lg font-medium italic">
                &quot;Mỗi sản phẩm là một niềm tự hào của người nông dân
                Việt&quot;
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};
