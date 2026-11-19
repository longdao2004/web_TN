"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import { storeService } from "@/services/store.service";
import { productService } from "@/services/product.service";

// Hàm hỗ trợ bọc chuỗi an toàn cho file CSV (tránh lỗi tách cột khi có dấu phẩy hoặc ngoặc kép)
const escCSV = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;

// Bản đồ dịch tiêu chuẩn bảo quản logistics sang tiếng Việt
const LOGISTICS_MAP: Record<string, string> = {
  ULTRA_FRESH: "Siêu tươi ngắn ngày (Rau lá / Tươi sống)",
  CHILLED: "Bảo quản mát (2°C - 8°C)",
  DRY_STABLE: "Hàng khô / Bảo quản thường",
};

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [storeName, setStoreName] = useState<string>("Nong_San");
  const [isLoading, setIsLoading] = useState(true);

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm '${name}' không? Hành động này không thể hoàn tác!`)) {
      try {
        await productService.deleteProduct(id);
        alert("Đã xóa sản phẩm thành công!");
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  // Tải thông tin cửa hàng và danh sách sản phẩm khi vào trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const store = await storeService.getMyStore();
        if (store?.name) setStoreName(store.name);
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

  // =========================================================================
  // HÀM XUẤT FILE EXCEL / CSV QUẢN LÝ SẢN PHẨM NÔNG SẢN
  // =========================================================================
  const handleExportProductsCSV = () => {
    if (!products || products.length === 0) {
      alert("Chưa có sản phẩm nào để xuất báo cáo!");
      return;
    }

    try {
      const todayStr = new Date().toLocaleDateString("vi-VN");

      // Tính toán các chỉ số tổng quan ở đầu file báo cáo
      const totalSKU = products.length;
      const activeCount = products.filter((p) => !p.isExpired && p.stock > 0).length;
      const outOfStockCount = products.filter((p) => !p.isExpired && p.stock <= 0).length;
      const expiredCount = products.filter((p) => p.isExpired).length;
      const certifiedCount = products.filter((p) => p.certificates?.length > 0).length;
      const totalInventoryValue = products.reduce(
        (sum: number, p: any) => sum + (p.stock || 0) * (p.price || 0),
        0
      );

      // Phần 1: Bảng tóm tắt tổng quan danh mục nông sản
      const summaryLines = [
        [escCSV("BÁO CÁO QUẢN LÝ DANH MỤC SẢN PHẨM NÔNG SẢN")],
        [escCSV(`Cửa hàng: ${storeName}`), escCSV(`Ngày xuất: ${todayStr}`)],
        [
          escCSV(`Tổng số mã sản phẩm: ${totalSKU}`),
          escCSV(`Đang mở bán: ${activeCount}`),
          escCSV(`Hết hàng: ${outOfStockCount}`),
          escCSV(`Hết date toàn bộ: ${expiredCount}`),
        ],
        [
          escCSV(`Sản phẩm có chứng nhận (VietGAP/OCOP): ${certifiedCount}/${totalSKU}`),
          escCSV(`Tổng giá trị tồn kho khả dụng: ${totalInventoryValue.toLocaleString("vi-VN")} VNĐ`),
        ],
        [], // Dòng trống ngăn cách
      ];

      // Phần 2: Tiêu đề các cột chi tiết
      const headers = [
        "Mã SP",
        "Tên Nông sản",
        "Danh mục",
        "Đơn vị tính",
        "Giá bán (VNĐ)",
        "Giá gốc niêm yết (VNĐ)",
        "Sản lượng đã bán",
        "Tồn kho khả dụng",
        "Tiêu chuẩn bảo quản",
        "Xuất xứ / Vùng trồng",
        "Chứng nhận chất lượng",
        "Đánh giá (CSAT)",
        "Phân loại & Khuyến nghị kinh doanh",
      ];

      // Duyệt từng sản phẩm để tạo dòng dữ liệu tương ứng
      const rows = products.map((p: any) => {
        // Lấy danh sách chứng nhận nếu có
        const certNames =
          p.certificates && p.certificates.length > 0
            ? p.certificates.map((c: any) => c.name).join("; ")
            : "Chưa có chứng nhận";

        // Tự động phân loại thực tiễn kinh doanh của từng mặt hàng
        let statusAdvice = "Kinh doanh ổn định";
        if (p.isExpired) {
          statusAdvice = "HẾT DATE TOÀN BỘ - Cần dọn kho & nhập đợt mới";
        } else if (p.stock <= 0) {
          statusAdvice = "CHÁY HÀNG - Cần thu hoạch vụ mới gối đầu";
        } else if (p.stock <= 10) {
          statusAdvice = "SẮP HẾT HÀNG - Chuẩn bị nhập thêm";
        } else if ((p.soldCount || 0) >= 20) {
          statusAdvice = "BÁN CHẠY - Ưu tiên giữ nguồn cung ổn định";
        } else if ((p.soldCount || 0) === 0) {
          statusAdvice = "BÁN CHẬM - Nên tạo Combo hoặc khuyến mãi kích cầu";
        }

        const ratingText = `${p.rating || 5} sao (${p.reviewCount || 0} lượt)`;

        return [
          escCSV(`SP-${p.id ? p.id.substring(0, 8).toUpperCase() : ""}`),
          escCSV(p.name),
          escCSV(p.category || "Chưa phân loại"),
          escCSV(p.unit || "kg"),
          p.price || 0,
          p.originalPrice || p.price || 0,
          p.soldCount || 0,
          p.stock || 0,
          escCSV(LOGISTICS_MAP[p.logisticsTier] || "Bảo quản thường"),
          escCSV(p.province || "Chưa cập nhật"),
          escCSV(certNames),
          escCSV(ratingText),
          escCSV(statusAdvice),
        ];
      });

      // Ghép toàn bộ nội dung CSV và gắn ký tự UTF-8 BOM (\uFEFF) để Excel hiển thị chuẩn tiếng Việt
      const csvContent =
        "\uFEFF" +
        [
          ...summaryLines.map((line) => line.join(",")),
          headers.map(escCSV).join(","),
          ...rows.map((r) => r.join(",")),
        ].join("\r\n");

      // Kích hoạt tải file về máy người bán
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const cleanShop = storeName.replace(/[^a-zA-Z0-9]/g, "_");
      const fileDate = new Date().toISOString().split("T")[0];
      link.href = url;
      link.setAttribute("download", `Bao_cao_san_pham_${cleanShop}_${fileDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi xuất Excel sản phẩm:", error);
      alert("Có lỗi xảy ra khi xuất file báo cáo!");
    }
  };

  if (isLoading) {
    return <div className="p-6">Đang tải danh sách sản phẩm...</div>;
  }

  return (
    <div className="p-6">
      {/* TIÊU ĐỀ & CỤM NÚT THAO TÁC */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Nút Xuất Báo cáo Excel Sản phẩm */}
          <button
            onClick={handleExportProductsCSV}
            className="flex items-center gap-2 bg-white border border-emerald-600 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 transition font-medium cursor-pointer"
            title="Xuất toàn bộ danh mục sản phẩm ra file Excel / CSV"
          >
            <Download className="w-4 h-4" />
            Xuất Excel Sản phẩm
          </button>

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
                <th className="p-4 font-semibold text-gray-600">Tên Sản phẩm</th>
                <th className="p-4 font-semibold text-gray-600">Danh mục</th>
                <th className="p-4 font-semibold text-gray-600">Giá bán</th>
                <th className="p-4 font-semibold text-gray-600">Tồn kho</th>
                <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-emerald-50/30 transition">
                  {/* TẠO MÃ SẢN PHẨM: Lấy 8 ký tự đầu của UUID làm mã SP hiển thị trên bảng */}
                  <td className="p-4 text-gray-500 font-mono text-xs">
                    {product.id ? product.id.substring(0, 8).toUpperCase() : ""}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{product.name}</td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4">
                    <div className="font-semibold text-emerald-600">{product.price.toLocaleString()}đ</div>
                    {product.originalPrice && product.originalPrice > product.price && (
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
                      {product.isExpired ? "Hết hạn SD" : product.stock > 0 ? "Đang bán" : "Hết hàng"}
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