import React from 'react';
import { Plus, Edit, Trash2, Award, ShieldCheck, ShieldAlert } from 'lucide-react';

// Dữ liệu giả mô phỏng các Giấy chứng nhận
const mockCertificates = [
  {
    id: 'CERT-001',
    name: 'Chứng nhận VietGAP',
    authority: 'Cục Trồng trọt - Bộ NN&PTNT',
    issueDate: '10/01/2026',
    expiryDate: '10/01/2028',
    status: 'Hợp lệ'
  },
  {
    id: 'CERT-002',
    name: 'Sản phẩm OCOP 4 Sao',
    authority: 'UBND Tỉnh Sơn La',
    issueDate: '15/05/2025',
    expiryDate: '15/05/2028',
    status: 'Hợp lệ'
  },
  {
    id: 'CERT-003',
    name: 'Chứng nhận Vệ sinh ATTP',
    authority: 'Sở Y tế Địa phương',
    issueDate: '01/02/2024',
    expiryDate: '01/02/2025',
    status: 'Đã hết hạn'
  }
];

export default function SellerCertificatesPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Chứng nhận</h1>
          <p className="text-gray-500 mt-1">Hồ sơ chứng nhận chất lượng giúp tăng độ uy tín cho nông sản</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm">
          <Plus className="w-5 h-5" />
          Thêm chứng nhận mới
        </button>
      </div>

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
                  {cert.status === 'Hợp lệ' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1 w-max">
                      <ShieldCheck className="w-3 h-3" /> Hợp lệ
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1 w-max">
                      <ShieldAlert className="w-3 h-3" /> Hết hạn
                    </span>
                  )}
                </td>
                <td className="p-4 flex items-center justify-center gap-3">
                  <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition" title="Sửa chứng nhận">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Xóa chứng nhận">
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