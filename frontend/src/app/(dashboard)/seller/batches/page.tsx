import React from 'react';
import { Plus, Edit, Trash2, CalendarDays, AlertTriangle } from 'lucide-react';

// Dữ liệu giả mô phỏng các Lô nông sản
const mockBatches = [
  {
    id: 'L0926-RM1',
    productName: 'Rau muống chuẩn VietGAP',
    harvestDate: '17/09/2026',
    expiryDate: '21/09/2026',
    stock: 150,
    status: 'Đang bán'
  },
  {
    id: 'L0926-CC2',
    productName: 'Cam Canh Cao Phong',
    harvestDate: '10/09/2026',
    expiryDate: '30/09/2026',
    stock: 45,
    status: 'Sắp hết hạn'
  },
  {
    id: 'L0926-DT3',
    productName: 'Dâu tây Đà Lạt (Size L)',
    harvestDate: '01/09/2026',
    expiryDate: '05/09/2026',
    stock: 0,
    status: 'Đã hết hạn'
  }
];

export default function SellerBatchesPage() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Đang bán': return 'bg-emerald-100 text-emerald-700';
      case 'Sắp hết hạn': return 'bg-amber-100 text-amber-700';
      case 'Đã hết hạn': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Lô hàng (Batches)</h1>
          <p className="text-gray-500 mt-1">Quản lý tồn kho, ngày thu hoạch và hạn sử dụng của nông sản</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm">
          <Plus className="w-5 h-5" />
          Nhập lô hàng mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Mã Lô</th>
              <th className="p-4 font-semibold text-gray-600">Sản phẩm áp dụng</th>
              <th className="p-4 font-semibold text-gray-600">Ngày thu hoạch</th>
              <th className="p-4 font-semibold text-gray-600">Hạn sử dụng</th>
              <th className="p-4 font-semibold text-gray-600">Tồn kho</th>
              <th className="p-4 font-semibold text-gray-600">Tình trạng</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {mockBatches.map((batch) => (
              <tr key={batch.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="p-4 font-medium text-gray-800">{batch.id}</td>
                <td className="p-4 font-medium text-[var(--color-primary)]">{batch.productName}</td>
                <td className="p-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    {batch.harvestDate}
                  </div>
                </td>
                <td className="p-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span className={batch.status === 'Đã hết hạn' ? 'text-red-500 font-medium line-through' : ''}>
                      {batch.expiryDate}
                    </span>
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-700">{batch.stock}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${getStatusStyle(batch.status)}`}>
                    {batch.status === 'Sắp hết hạn' && <AlertTriangle className="w-3 h-3" />}
                    {batch.status}
                  </span>
                </td>
                <td className="p-4 flex items-center justify-center gap-3">
                  <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition" title="Sửa lô hàng">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Xóa lô hàng">
                    <Trash2 className="w-4 h-4" />
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