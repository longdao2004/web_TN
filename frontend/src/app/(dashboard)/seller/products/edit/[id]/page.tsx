"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, UploadCloud, Save, Layers } from "lucide-react";
import { storeService } from "@/services/store.service";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // State chỉ quản lý các thông tin thuộc về Sản phẩm (đã bỏ HSD, Ngày thu hoạch, Tồn kho, Giá KM)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    origin: "",
    unit: "kg",
    price: "",
    categoryId: "",
    specification: "",
    storageCondition: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [storeId, setStoreId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const store = await storeService.getMyStore();
        setStoreId(store.id);

        const cats = await categoryService.getAllCategories();
        setCategories(cats);

        const resProduct = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/products/${id}`
        );
        const product = await resProduct.json();

        // Lấy thông tin lô mới nhất để đọc giá niêm yết, quy cách và bảo quản hiện tại
        const sortedBatches = (product.batches || []).slice().sort(
          (a: any, b: any) =>
            new Date(b.createdAt || b.harvestDate || 0).getTime() -
            new Date(a.createdAt || a.harvestDate || 0).getTime()
        );
        const latestBatch = sortedBatches[0];

        setFormData({
          name: product.name || "",
          description: product.description || "",
          origin: product.origin || "",
          unit: product.unit || "kg",
          price: (latestBatch?.price || 0).toString(),
          categoryId: product.categoryId || (cats.length > 0 ? cats[0].id : ""),
          specification: latestBatch?.specification || "",
          storageCondition: latestBatch?.storageCondition || "",
        });

        if (product.imageUrl) {
          setImagePreview(product.imageUrl);
        }
      } catch (error) {
        console.error("Lỗi khởi tạo form:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price || !formData.categoryId) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }

    try {
      setIsSaving(true);
      const apiData = new FormData();
      apiData.append("name", formData.name.trim());
      apiData.append("description", formData.description.trim());
      apiData.append("origin", formData.origin.trim());
      apiData.append("unit", formData.unit);
      apiData.append("price", formData.price); // Cập nhật mức giá niêm yết chuẩn
      apiData.append("categoryId", formData.categoryId);
      apiData.append("storeId", storeId);
      apiData.append("specification", formData.specification.trim());
      apiData.append("storageCondition", formData.storageCondition.trim());

      if (imageFile) {
        apiData.append("images", imageFile);
      }

      await productService.updateProduct(id, apiData);
      alert("Cập nhật sản phẩm thành công!");
      router.push("/seller/products");
    } catch (error) {
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Đang tải thông tin sản phẩm...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/seller/products"
          className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cập nhật Sản phẩm</h1>
          <p className="text-gray-500 mt-1">Thay đổi thông tin giới thiệu nông sản trên gian hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* 1. HÌNH ẢNH */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Hình ảnh Sản phẩm</h2>
            <div className="flex gap-4">
              <label className="h-32 w-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-emerald-500 cursor-pointer transition relative overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Tải ảnh lên</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 2. THÔNG TIN CƠ BẢN */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Thông tin Cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                  placeholder="VD: Cam sành Hàm Yên"
                />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none resize-none transition"
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Xuất xứ (Tỉnh/Thành)</label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                  placeholder="VD: Bắc Giang, Đà Lạt..."
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 3. GIÁ BÁN NIÊM YẾT & ĐƠN VỊ TÍNH */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">3. Giá bán Niêm yết & Đơn vị</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá bán niêm yết (VNĐ) <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Giá bán chính thức của nông sản khi xuất vườn / lên kệ</p>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="VD: 50000"
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị tính <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Đơn vị đo lường khi giao dịch</p>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="hộp">Hộp</option>
                  <option value="bó">Bó</option>
                  <option value="mớ">Mớ</option>
                  <option value="quả">Quả</option>
                  <option value="thùng">Thùng</option>
                  <option value="lít">Lít</option>
                  <option value="túi">Túi</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 4. QUY CÁCH ĐÓNG GÓI & BẢO QUẢN */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">4. Quy cách đóng gói & Bảo quản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quy cách đóng gói</label>
                <input
                  type="text"
                  name="specification"
                  value={formData.specification}
                  onChange={handleChange}
                  placeholder="VD: Hộp 500g, Thùng 10kg..."
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Điều kiện bảo quản</label>
                <input
                  type="text"
                  name="storageCondition"
                  value={formData.storageCondition}
                  onChange={handleChange}
                  placeholder="VD: Bảo quản ngăn mát 2-8°C..."
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* 5. GỢI Ý ĐIỀU HƯỚNG QUẢN LÝ LÔ HÀNG THÔNG MINH */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-900">Quản lý Lô hàng & Tồn kho</h4>
              <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                Số lượng tồn kho, ngày thu hoạch, hạn sử dụng và ưu đãi xả hàng được quản lý độc lập theo từng đợt nhập. Để cập nhật hạn sử dụng hoặc hạ giá xả hàng cận date, vui lòng truy cập{" "}
                <Link href="/seller/batches" className="font-bold underline hover:text-emerald-950 inline-flex items-center">
                  Quản lý Lô hàng →
                </Link>
              </p>
            </div>
          </div>

        </div>

        {/* Nút lưu */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition font-medium shadow-sm disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Đang lưu..." : "Cập nhật sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
}