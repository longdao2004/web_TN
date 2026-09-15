import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Tạo sẵn một mảng Dữ liệu giả (Mock Data) để vẽ giao diện
const mockProducts = [
  {
    id: 'SP001',
    name: 'Rau muống chuẩn VietGAP',
    category: 'Rau ăn lá',
    price: 15000,
    stock: 200,
    status: 'Đang bán'
  },
  {
    id: 'SP002',
    name: 'Dâu tây Đà Lạt (Size L)',
    category: 'Trái cây tươi',
    price: 150000,
    stock: 5,
    status: 'Sắp hết'
  }
];

export default function SellerProductsPage() {
  return (
    <div className="p-6">
      {/* Tiêu đề và Nút Thêm mới */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
          <Plus className="w-5 h-5" />
          Thêm sản phẩm mới
        </button>
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
              <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="p-4 text-gray-500">{product.id}</td>
                <td className="p-4 font-medium text-gray-800">{product.name}</td>
                <td className="p-4 text-gray-600">{product.category}</td>
                <td className="p-4 font-bold text-emerald-600">{product.price.toLocaleString('vi-VN')}đ</td>
                <td className="p-4 text-gray-600">{product.stock}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4 flex items-center justify-center gap-3">
                  <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition" title="Sửa">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Xóa">
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