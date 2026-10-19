"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  UploadCloud, 
  Save, 
  Award, 
  Loader2, 
  ShieldCheck 
} from "lucide-react";
import { toast } from "sonner";

// Services gọi API Backend
import { storeService } from "@/services/store.service";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";
import { certificateService } from "@/services/certificate.service";

// ==========================================
// 1. DỮ LIỆU KHỞI TẠO MẶC ĐỊNH
// ==========================================
const INITIAL_PRODUCT_DATA = {
  name: "",
  description: "",
  origin: "", // Xuất xứ / Vùng trồng (VD: Lục Ngạn, Bắc Giang)
  unit: "kg",
  price: "",
  originalPrice: "", // Giá gốc niêm yết (nếu có ưu đãi giảm giá)
  quantity: "",
  harvestDate: "",
  expiryDate: "",
  categoryId: "",
  specification: "",
  storageCondition: "",
};

export default function CreateProductPage() {
  const router = useRouter();

  // ----------------------------------------
  // State quản lý thông tin sản phẩm và ảnh
  // ----------------------------------------
  const [formData, setFormData] = useState(INITIAL_PRODUCT_DATA);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // ----------------------------------------
  // State Chứng nhận tinh gọn (Chỉ gồm Loại & Cơ quan cấp)
  // ----------------------------------------
  const [certificateType, setCertificateType] = useState<string>(""); // Rỗng = Không có chứng nhận
  const [certificateIssuer, setCertificateIssuer] = useState<string>("");

  // ----------------------------------------
  // State quản lý hệ thống (Store ID, Danh mục, Trạng thái lưu)
  // ----------------------------------------
  const [storeId, setStoreId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ==========================================
  // 2. LẤY STORE ID & DANH MỤC TỰ ĐỘNG
  // ==========================================
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsInitializing(true);
        const store = await storeService.getMyStore();
        setStoreId(store.id);

        const cats = await categoryService.getAllCategories();
        setCategories(cats);
        if (cats.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
        }
      } catch (error: any) {
        console.error("Lỗi khởi tạo form:", error);
        toast.error("Không thể tải thông tin cửa hàng hoặc danh mục.");
      } finally {
        setIsInitializing(false);
      }
    };

    fetchInitialData();
  }, []);

  // ==========================================
  // 3. XỬ LÝ NHẬP LIỆU (HANDLERS)
  // ==========================================
  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Dung lượng ảnh không được vượt quá 5MB!");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ==========================================
  // 4. KIỂM TRA TÍNH HỢP LỆ (VALIDATION)
  // ==========================================
  const validateForm = (): boolean => {
    if (!storeId) {
      toast.error("Không tìm thấy thông tin cửa hàng của bạn!");
      return false;
    }
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm!");
      return false;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Vui lòng nhập giá bán hợp lệ (> 0đ)!");
      return false;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error("Vui lòng nhập số lượng tồn kho hợp lệ!");
      return false;
    }
    if (!formData.harvestDate) {
      toast.error("Vui lòng chọn ngày thu hoạch!");
      return false;
    }
    if (!formData.expiryDate) {
      toast.error("Vui lòng chọn hạn sử dụng!");
      return false;
    }
    if (!imageFile) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh đại diện cho sản phẩm!");
      return false;
    }
    return true;
  };

  // ==========================================
  // 5. LƯU SẢN PHẨM & TỰ ĐỘNG GẮN CHỨNG NHẬN
  // ==========================================
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      // BƯỚC 1: Đóng gói thông tin sản phẩm gửi lên Backend
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("description", formData.description.trim());
      payload.append("origin", formData.origin.trim() || "Việt Nam");
      // Chuẩn hóa giá thông minh: Số nhỏ hơn luôn là giá bán thực tế, số lớn hơn là giá gốc
      const p = Number(formData.price);
      const op = formData.originalPrice ? Number(formData.originalPrice) : null;
      if (op && op > 0 && p > 0 && p !== op) {
        payload.append("price", Math.min(p, op).toString());
        payload.append("originalPrice", Math.max(p, op).toString());
      } else {
        payload.append("price", formData.price);
        if (formData.originalPrice) {
          payload.append("originalPrice", formData.originalPrice);
        }
      }
      payload.append("quantity", formData.quantity);
      payload.append("harvestDate", new Date(formData.harvestDate).toISOString());
      payload.append("expiryDate", new Date(formData.expiryDate).toISOString());
      payload.append("specification", formData.specification.trim());
      payload.append("storageCondition", formData.storageCondition.trim());
      payload.append("categoryId", formData.categoryId);
      payload.append("storeId", storeId);
      payload.append("image", imageFile!);

      // Gọi API tạo sản phẩm
      const newProduct = await productService.createProduct(payload);

      // BƯỚC 2: NẾU CÓ CHỌN CHỨNG NHẬN, TỰ ĐỘNG TẠO VÀ GẮN LUÔN
      if (certificateType && newProduct?.id) {
        try {
          await certificateService.createCertificate({
            productId: newProduct.id,
            name: certificateType,
            issuer: certificateIssuer.trim() || "Cơ quan Quản lý Chất lượng Nông Lâm sản",
            issueDate: new Date().toISOString(), // Tự động lấy ngày hiện tại
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Mặc định hạn 1 năm
            imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          });
        } catch (certError: any) {
          console.error("Cảnh báo đính kèm chứng nhận:", certError);
        }
      }

      toast.success("Tạo sản phẩm thành công!");
      router.push("/seller/products"); // Chuyển về danh sách sản phẩm
    } catch (error: any) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error(error.message || "Tạo sản phẩm thất bại. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
        <p className="text-sm">Đang tải thông tin biểu mẫu...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ==================================================== */}
      {/* THANH TIÊU ĐỀ VÀ NÚT LƯU                             */}
      {/* ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/seller/products"
            className="p-2 hover:bg-gray-100 rounded-full transition"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
            <p className="text-gray-500 text-sm mt-1">
              Điền thông tin chi tiết để đăng bán nông sản của bạn
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition font-medium shadow-sm disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang lưu sản phẩm...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Lưu Sản Phẩm</span>
            </>
          )}
        </button>
      </div>

      {/* ==================================================== */}
      {/* KHUNG NỘI DUNG FORM 2 CỘT                            */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* -------------------------------------------------- */}
        {/* CỘT TRÁI (Chiếm 2 phần)                            */}
        {/* -------------------------------------------------- */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. KHỐI THÔNG TIN CƠ BẢN */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Thông tin cơ bản</h2>
            <div className="space-y-5">
              {/* Tên sản phẩm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm nông sản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleProductChange}
                  placeholder="VD: Cam Canh Cao Phong, Vải thiều Lục Ngạn, Sữa tươi Mộc Châu..."
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>

              {/* Danh mục & Xuất xứ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleProductChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xuất xứ / Vùng trồng
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleProductChange}
                    placeholder="VD: Lục Ngạn, Bắc Giang..."
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Mô tả sản phẩm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả chi tiết sản phẩm
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleProductChange}
                  rows={4}
                  placeholder="Mô tả về đặc điểm, hương vị, cách trồng trọt hoặc độ tươi ngon của nông sản..."
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none transition"
                />
              </div>
            </div>
          </div>

          {/* 2. KHỐI THÔNG TIN LÔ HÀNG NHẬP KHO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Thông tin Lô hàng nhập kho</h2>

            {/* Quy cách & Bảo quản */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quy cách đóng gói
                </label>
                <input
                  type="text"
                  name="specification"
                  value={formData.specification}
                  onChange={handleProductChange}
                  placeholder="VD: Hộp 500g, Túi hút chân không 1kg..."
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điều kiện bảo quản
                </label>
                <input
                  type="text"
                  name="storageCondition"
                  value={formData.storageCondition}
                  onChange={handleProductChange}
                  placeholder="VD: Ngăn mát 2-8°C, nơi khô ráo thoáng mát..."
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>
            </div>

            {/* Số lượng, Ngày thu hoạch, Hạn sử dụng */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng (Tồn kho) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleProductChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="VD: 100"
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày thu hoạch <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleProductChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hạn sử dụng <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleProductChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* 3. KHỐI CHỨNG NHẬN CHẤT LƯỢNG ĐƠN GIẢN HÓA (CHỈ CẦN LOẠI & CƠ QUAN) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2.5 text-emerald-800 font-semibold text-lg mb-4">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2>3. Chứng nhận chất lượng (Tùy chọn)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Loại chứng nhận */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại chứng nhận
                </label>
                <select
                  value={certificateType}
                  onChange={(e) => setCertificateType(e.target.value)}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition"
                >
                  <option value="">-- Không có chứng nhận --</option>
                  <option value="VietGAP">VietGAP (Thực hành nông nghiệp tốt VN)</option>
                  <option value="GlobalGAP">GlobalGAP (Tiêu chuẩn toàn cầu)</option>
                  <option value="Hữu cơ (Organic)">Hữu cơ (Organic / USDA)</option>
                  <option value="OCOP 3 Sao">OCOP 3 Sao</option>
                  <option value="OCOP 4 Sao">OCOP 4 Sao</option>
                  <option value="OCOP 5 Sao">OCOP 5 Sao</option>
                  <option value="HACCP">HACCP (An toàn thực phẩm)</option>
                </select>
              </div>

              {/* Cơ quan cấp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cơ quan / Tổ chức cấp
                </label>
                <input
                  type="text"
                  disabled={!certificateType}
                  value={certificateIssuer}
                  onChange={(e) => setCertificateIssuer(e.target.value)}
                  placeholder={certificateType ? "VD: Chi cục Trồng trọt & BVTV..." : "Chọn loại chứng nhận trước"}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {certificateType && (
              <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1.5 font-medium animate-in fade-in">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                Sản phẩm sẽ tự động hiển thị huy hiệu xác thực <strong>{certificateType}</strong> ngoài trang chủ.
              </p>
            )}
          </div>

        </div>

        {/* -------------------------------------------------- */}
        {/* CỘT PHẢI (Chiếm 1 phần)                            */}
        {/* -------------------------------------------------- */}
        <div className="space-y-6">

          {/* 4. KHỐI GIÁ BÁN & ĐƠN VỊ TÍNH */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Giá bán & Đơn vị</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá bán thực tế (VNĐ) <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Số tiền khách hàng phải thanh toán khi mua hàng</p>
                <input
                  type="number"
                  name="price"
                  min="1000"
                  step="500"
                  value={formData.price}
                  onChange={handleProductChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="VD: 94000"
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá gốc niêm yết (VNĐ) <span className="text-gray-400 text-xs font-normal">(Tùy chọn)</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Giá ban đầu trước khi giảm (hiển thị gạch ngang ngoài cửa hàng)</p>
                <input
                  type="number"
                  name="originalPrice"
                  min="1000"
                  step="500"
                  value={formData.originalPrice}
                  onChange={handleProductChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="VD: 100000 (Để trống nếu bán giá thường)"
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
                {Number(formData.originalPrice) > 0 && Number(formData.price) > 0 && Number(formData.originalPrice) !== Number(formData.price) && (
                  <p className="text-xs text-emerald-600 font-medium mt-1.5 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    ✓ <strong>Ưu đãi:</strong> Bán <strong>{Math.min(Number(formData.price), Number(formData.originalPrice)).toLocaleString()}đ</strong> (Gốc gạch ngang {Math.max(Number(formData.price), Number(formData.originalPrice)).toLocaleString()}đ - Giảm {Math.round(((Math.max(Number(formData.price), Number(formData.originalPrice)) - Math.min(Number(formData.price), Number(formData.originalPrice))) / Math.max(Number(formData.price), Number(formData.originalPrice))) * 100)}%)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đơn vị tính <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleProductChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="hộp">Hộp</option>
                  <option value="bó">Bó</option>
                  <option value="mớ">Mớ</option>
                  <option value="quả">Quả</option>
                  <option value="thùng">Thùng</option>
                  <option value="lít">Lít</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. KHỐI TẢI HÌNH ẢNH SẢN PHẨM */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Hình ảnh sản phẩm <span className="text-red-500">*</span>
            </h2>
            <label className="relative h-64 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-emerald-500 cursor-pointer transition overflow-hidden">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Ảnh xem trước"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center p-4 text-center">
                  <UploadCloud className="w-10 h-10 mb-3 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Bấm để tải ảnh nông sản
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)
                  </span>
                </div>
              )}
            </label>
          </div>

        </div>

      </div>
    </div>
  );
}