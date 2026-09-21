"use client"; // Thêm dòng này để dùng được useState
import React, { useState } from 'react';
import { Plus, Edit, Trash2, CalendarDays, AlertTriangle, X } from 'lucide-react';

const mockBatches = [
  { id: 'L0926-RM1', productName: 'Rau muống chuẩn VietGAP', harvestDate: '17/09/2026', expiryDate: '21/09/2026', stock: 150, status: 'Đang bán' },
  { id: 'L0926-CC2', productName: 'Cam Canh Cao Phong', harvestDate: '10/09/2026', expiryDate: '30/09/2026', stock: 45, status: 'Sắp hết hạn' },
];

export default function SellerBatchesPage() {
  // Biến trạng thái để Đóng/Mở Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Đang bán': return 'bg-emerald-100 text-emerald-700';
      case 'Sắp hết hạn': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Lô hàng (Batches)</h1>
          <p className="text-gray-500 mt-1">Quản lý tồn kho, ngày thu hoạch và hạn sử dụng</p>
        </div>
        {/* Nút này sẽ đổi trạng thái isModalOpen thành true để mở Popup */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nhập lô hàng mới
        </button>
      </div>

      {/* BẢNG DANH SÁCH (Giữ nguyên như cũ) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Mã Lô</th>
              <th className="p-4 font-semibold text-gray-600">Sản phẩm</th>
              <th className="p-4 font-semibold text-gray-600">Ngày thu hoạch</th>
              <th className="p-4 font-semibold text-gray-600">Hạn sử dụng</th>
              <th className="p-4 font-semibold text-gray-600">Tồn kho</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {mockBatches.map((batch) => (
              <tr key={batch.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4 font-medium text-gray-800">{batch.id}</td>
                <td className="p-4 font-medium text-[var(--color-primary)]">{batch.productName}</td>
                <td className="p-4 text-gray-600">{batch.harvestDate}</td>
                <td className="p-4 text-gray-600">{batch.expiryDate}</td>
                <td className="p-4 font-bold text-gray-700">{batch.stock}</td>
                <td className="p-4 flex items-center justify-center gap-3">
                  <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                  <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL NHẬP LÔ HÀNG ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          {/* Box chứa Modal */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Nhập lô hàng mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body Modal (Form) */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Sản phẩm</label>
                <select className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none">
                  <option>Rau muống chuẩn VietGAP</option>
                  <option>Cam Canh Cao Phong</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày thu hoạch</label>
                  <input type="date" className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hạn sử dụng</label>
                  <input type="date" className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng nhập (Tồn kho)</label>
                <input type="number" placeholder="VD: 100" className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none" />
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition">
                Hủy bỏ
              </button>
              <button className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-xl transition shadow-sm">
                Xác nhận Nhập
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}