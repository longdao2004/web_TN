import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UploadCloud, Save, Image as ImageIcon } from 'lucide-react';

export default function CreateProductPage() {
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
        <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm">
          <Save className="w-5 h-5" />
          Lưu Sản Phẩm
        </button>
      </div>

      {/* Cấu trúc Form chia làm 2 cột trên màn hình lớn */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột Trái (Chiếm 2 phần): Thông tin cơ bản */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input type="text" placeholder="VD: Sầu riêng Ri6, Rau muống hữu cơ..." className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition">
                  <option value="">-- Chọn danh mục nông sản --</option>
                  <option value="trai-cay">Trái cây</option>
                  <option value="rau-cu">Rau củ</option>
                  <option value="thit-trung">Thịt & Trứng</option>
                  <option value="thuy-hai-san">Thủy hải sản</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
                <textarea rows={6} placeholder="Viết mô tả chi tiết về nguồn gốc, quy trình trồng trọt, chứng nhận..." className="w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Cột Phải (Chiếm 1 phần): Giá bán & Hình ảnh */}
        <div className="space-y-6">
          
          {/* Box Định giá */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Giá bán & Đơn vị</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá cơ bản (VNĐ) <span className="text-red-500">*</span></label>
                <input type="number" placeholder="VD: 50000" className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị tính <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition">
                  <option value="kg">Kilogram (Kg)</option>
                  <option value="gram">Gram (g)</option>
                  <option value="thung">Thùng (Box)</option>
                  <option value="bo">Bó</option>
                </select>
              </div>
            </div>
          </div>

          {/* Box Hình ảnh */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Hình ảnh sản phẩm</h2>
            {/* Nút Upload */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-emerald-500 transition cursor-pointer group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Tải ảnh lên</p>
              <p className="text-xs text-gray-400">Hỗ trợ JPG, PNG (Max 5MB)</p>
            </div>
            {/* Hàng ảnh thu nhỏ (Thumbnails giả lập) */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="aspect-square bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="aspect-square bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="aspect-square bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}