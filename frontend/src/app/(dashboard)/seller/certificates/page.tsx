"use client";
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Award, ShieldCheck, ShieldAlert, X, UploadCloud } from 'lucide-react';

const mockCertificates = [
  { id: 'CERT-001', name: 'Chứng nhận VietGAP', authority: 'Cục Trồng trọt - Bộ NN&PTNT', issueDate: '10/01/2026', expiryDate: '10/01/2028', status: 'Hợp lệ' },
  { id: 'CERT-002', name: 'Sản phẩm OCOP 4 Sao', authority: 'UBND Tỉnh Sơn La', issueDate: '15/05/2025', expiryDate: '15/05/2028', status: 'Hợp lệ' },
];

export default function SellerCertificatesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Chứng nhận</h1>
          <p className="text-gray-500 mt-1">Hồ sơ chứng nhận chất lượng giúp tăng độ uy tín cho nông sản</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Thêm chứng nhận mới
        </button>
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600 w-16">Icon</th>
              <th className="p-4 font-semibold text-gray-600">Tên Chứng nhận</th>
              <th className="p-4 font-semibold text-gray-600">Cơ quan cấp</th>
              <th className="p-4 font-semibold text-gray-600">Ngày cấp</th>
              <th className="p-4 font-semibold text-gray-600">Hiệu lực đến</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {mockCertificates.map((cert) => (
              <tr key={cert.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="p-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                    <Award className="w-5 h-5" />
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-800">{cert.name}</td>
                <td className="p-4 text-gray-600">{cert.authority}</td>
                <td className="p-4 text-gray-500">{cert.issueDate}</td>
                <td className="p-4 text-gray-500">{cert.expiryDate}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1 w-max">
                    <ShieldCheck className="w-3 h-3" /> Hợp lệ
                  </span>
                </td>
                <td className="p-4 flex items-center justify-center gap-3">
                  <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                  <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL THÊM CHỨNG NHẬN ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Thêm chứng nhận mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên chứng nhận (VD: VietGAP) <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cơ quan cấp</label>
                <input type="text" className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cấp</label>
                  <input type="date" className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                  <input type="date" className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition" />
                </div>
              </div>

              {/* Khung Tải ảnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh / Bản scan chứng nhận</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-emerald-500 transition cursor-pointer">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Tải tệp lên</p>
                  <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition">
                Hủy bỏ
              </button>
              <button className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-xl transition shadow-sm flex items-center gap-2">
                <Award className="w-4 h-4" />
                Lưu Chứng nhận
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}