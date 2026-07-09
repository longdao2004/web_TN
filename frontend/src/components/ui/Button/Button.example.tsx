// file trình diễn mọi trường hợp sử dụng của Button Component
import React from "react";
import { Button } from "./Button";
import { ShoppingCart, ArrowRight, Trash2, CheckCircle } from "lucide-react";

/**
 * File này chỉ nhằm mục đích hướng dẫn cách sử dụng Button Component.
 * KHÔNG sử dụng trực tiếp trong mã nguồn thực tế.
 */
export const ButtonExample = () => {
  return (
    <div className="flex flex-col gap-8 p-8 bg-white">
      {/* 1. Các biến thể (Variants) */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">1. Các biến thể màu (Variants)</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
        </div>
      </div>

      {/* 2. Kích thước (Sizes) */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">2. Kích thước (Sizes)</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small Size</Button>
          <Button size="md">Medium (Default)</Button>
          <Button size="lg">Large Size</Button>
          <Button size="icon" variant="outline">
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 3. Icons & Loading */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">3. Trạng thái Icon & Loading</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Button leftIcon={<ShoppingCart className="w-4 h-4" />}>
            Thêm vào giỏ
          </Button>
          <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
            Tiếp tục mua
          </Button>
          <Button isLoading>Đang xử lý...</Button>
          <Button disabled>Đã vô hiệu hóa</Button>
        </div>
      </div>

      {/* 4. Mở rộng toàn bộ chiều ngang */}
      <div className="flex flex-col gap-2 w-80">
        <h3 className="text-lg font-bold">4. Full Width</h3>
        <Button
          fullWidth
          variant="danger"
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          Xóa toàn bộ giỏ hàng
        </Button>
        <Button
          fullWidth
          variant="success"
          leftIcon={<CheckCircle className="w-4 h-4" />}
        >
          Hoàn tất đơn hàng
        </Button>
      </div>
    </div>
  );
};
