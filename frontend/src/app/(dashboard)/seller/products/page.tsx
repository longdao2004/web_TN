"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { storeService } from "@/services/store.service";
import { productService } from "@/services/product.service";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy thông tin cửa hàng của mình (để lấy ra cái ID)
        const store = await storeService.getMyStore();

        // 2. Lọc ra toàn bộ sản phẩm thuộc về ID cửa hàng này
        const data = await productService.getProducts({ storeId: store.id });
        setProducts(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) {
    return <div className="p-6">Đang tải danh sách sản phẩm...</div>;
  }

  return (
    <div className="p-6">
      {/* Tiêu đề và Nút Thêm mới */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <Link
          href="/seller/products/create"
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm mới
        </Link>
      </div>

      {/* Khung Bảng (Table) hiển thị sản phẩm */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Mã SP</th>
              <th className="p-4 font-semibold text-gray-600">Tên Sản phẩm</th>
              <th className="p-4 font-semibold text-gray-600">Danh mục</th>
              <th className="p-4 font-semibold text-gray-600">Giá bán</th>
              <th className="p-4 font-semibold text-gray-600">Tồn kho</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-50 hover:bg-emerald-50/30 transition"
              >
                <td className="p-4 font-medium text-gray-800 text-gray-900">
                  {product.name}
                </td>
                <td className="p-4 text-gray-600">{product.category}</td>
                <td className="p-4 font-semibold text-emerald-600">
                  {product.price.toLocaleString()}đ
                </td>
                <td className="p-4 text-gray-600">{product.stock}</td>
                <td className="p-4">
                  {/* Tự động tính trạng thái dựa vào Tồn kho (stock) */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.stock > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock > 0 ? "Đang bán" : "Hết hàng"}
                  </span>
                </td>
                <td className="p-4 flex items-center gap-3">
                  {/* Nút sửa, xóa giữ nguyên */}
                  <button
                    className="text-gray-400 hover:text-emerald-600 transition"
                    title="Sửa"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
