"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { storeService } from "@/services/store.service";
import { productService } from "@/services/product.service";
import { formatProductCode } from "@/utils/order";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm '${name}' không? Hành động này không thể hoàn tác!`,
      )
    ) {
      try {
        await productService.deleteProduct(id);
        alert("Đã xóa sản phẩm thành công!");
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  // Tải danh sách sản phẩm khi vào trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const store = await storeService.getMyStore();
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
      {/* TIÊU ĐỀ & CỤM NÚT THAO TÁC */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Nút Thêm sản phẩm mới */}
          <Link
            href="/seller/products/create"
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm sản phẩm mới
          </Link>
        </div>
      </div>

      {/* BẢNG DANH SÁCH SẢN PHẨM */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Mã SP</th>
                <th className="p-4 font-semibold text-gray-600">
                  Tên Sản phẩm
                </th>
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
                  <td className="p-4">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                      {formatProductCode(product.name, product.id)}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4">
                    <div className="font-semibold text-emerald-600">
                      {product.price.toLocaleString()}đ
                    </div>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <div className="text-xs text-gray-400 line-through font-normal">
                          {product.originalPrice.toLocaleString()}đ
                        </div>
                      )}
                  </td>
                  <td className="p-4 text-gray-600">{product.stock}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.isExpired
                          ? "bg-red-100 text-red-700"
                          : product.stock > 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {product.isExpired
                        ? "Hết hạn SD"
                        : product.stock > 0
                          ? "Đang bán"
                          : "Hết hàng"}
                    </span>
                  </td>
                  {/* CĂN GIỮA ĐỒNG BỘ CỘT THAO TÁC */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        href={`/seller/products/edit/${product.id}`}
                        className="text-gray-400 hover:text-emerald-600 transition cursor-pointer"
                        title="Sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                        title="Xóa"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
