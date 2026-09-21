"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, Save, Image as ImageIcon } from "lucide-react";
import { storeService } from "@/services/store.service";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";

export default function CreateProductPage() {
  const router = useRouter();

  // 1. Khai báo kho chứa dữ liệu Form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    origin: "",
    unit: "kg",
    price: "",
    quantity: "",
    harvestDate: "",
    expiryDate: "",
    categoryId: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // 2. Khai báo kho chứa dữ liệu hệ thống (StoreID, Danh mục)
  const [storeId, setStoreId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // 3. Tự động lấy StoreID và Danh mục khi vừa mở trang
  useEffect(() => {
    const initData = async () => {
      try {
        const store = await storeService.getMyStore();
        setStoreId(store.id);

        const cats = await categoryService.getAllCategories();
        setCategories(cats);
        // Chọn sẵn danh mục đầu tiên cho đỡ trống
        if (cats.length > 0)
          setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
      } catch (error) {
        console.error("Lỗi khởi tạo form:", error);
      }
    };
    initData();
  }, []);

  // 4. Hàm xử lý mỗi khi người dùng gõ phím vào các ô text
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. Hàm xử lý khi người dùng chọn Ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Tạo link ảo để hiện ảnh xem trước
    }
  };

  // 6. Hàm xử lý khi bấm nút "Lưu Sản Phẩm"
  const handleSubmit = async () => {
    if (!storeId) return alert("Bạn chưa có cửa hàng!");
    if (
      !formData.name ||
      !formData.price ||
      !formData.quantity ||
      !formData.harvestDate ||
      !formData.expiryDate ||
      !imageFile
    ) {
      return alert("Vui lòng điền đủ các thông tin bắt buộc và chọn ảnh!");
    }
    try {
      setIsSaving(true);
      // Đóng gói dữ liệu dạng FormData để gửi file
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("origin", formData.origin);
      data.append("unit", formData.unit);
      data.append("price", formData.price);
      data.append("quantity", formData.quantity);

      // Chuyển ngày tháng về chuẩn ISO cho Backend dễ đọc
      data.append("harvestDate", new Date(formData.harvestDate).toISOString());
      data.append("expiryDate", new Date(formData.expiryDate).toISOString());

      data.append("categoryId", formData.categoryId);
      data.append("storeId", storeId);
      data.append("image", imageFile);
      await productService.createProduct(data);
      alert("Tạo sản phẩm thành công!");
      router.push("/seller/products"); // Xong thì đá về trang danh sách
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

    return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Thanh tiêu đề (Header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/seller/products" className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
            <p className="text-gray-500 text-sm mt-1">Điền thông tin chi tiết để đăng bán nông sản của bạn</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm disabled:opacity-70"
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Đang xử lý..." : "Lưu Sản Phẩm"}
        </button>
      </div>

      {/* Cấu trúc Form chia làm 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI (Chiếm 2 phần) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="VD: Sầu riêng Ri6, Rau muống hữu cơ..."
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="text-gray-900 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Viết mô tả chi tiết..."
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none transition"
                />
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            {/* ĐÂY LÀ 3 Ô NHẬP LIỆU BẠN BỊ THIẾU LÚC NÃY */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin Lô hàng nhập kho</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng (Tồn kho) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày thu hoạch <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hạn sử dụng <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (Chiếm 1 phần) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Giá bán & Đơn vị</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá cơ bản (VNĐ) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="VD: 50000"
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị tính <span className="text-red-500">*</span></label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="text-gray-900 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="hộp">Hộp</option>
                  <option value="bó">Bó</option>
                  <option value="quả">Quả</option>
                  <option value="thùng">Thùng</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Hình ảnh sản phẩm</h2>
            <label className="relative h-64 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-emerald-500 cursor-pointer transition overflow-hidden">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 mb-3" />
                  <span className="text-sm font-medium">Bấm tải ảnh lên</span>
                  <span className="text-xs mt-1">Hỗ trợ JPG, PNG</span>
                </>
              )}
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
