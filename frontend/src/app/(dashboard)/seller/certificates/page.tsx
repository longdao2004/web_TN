"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Award, Edit, Trash2 } from "lucide-react";
import { storeService } from "@/services/store.service";
import { productService } from "@/services/product.service";
import { certificateService } from "@/services/certificate.service";

export default function SellerCertificatesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Danh sách sản phẩm & tất cả chứng nhận
  const [products, setProducts] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  // Dữ liệu form THÊM MỚI
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
  });

  // Dữ liệu form SỬA
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
  });

  // 1. Hàm tải dữ liệu
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const store = await storeService.getMyStore();
      const prods = await productService.getProducts({ storeId: store.id });
      setProducts(prods);

      let allCerts: any[] = [];
      prods.forEach((p: any) => {
        if (p.certificates && p.certificates.length > 0) {
          p.certificates.forEach((c: any) => {
            allCerts.push({ ...c, productName: p.name });
          });
        }
      });

      // Sắp xếp chứng nhận mới lên đầu
      allCerts.sort(
        (a, b) =>
          new Date(b.issueDate || b.createdAt || 0).getTime() -
          new Date(a.issueDate || a.createdAt || 0).getTime()
      );
      setCertificates(allCerts);

      if (prods.length > 0) {
        setFormData((prev) => ({ ...prev, productId: prods[0].id }));
      }
    } catch (error) {
      console.error("Lỗi tải chứng nhận:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e: any) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Thêm Chứng nhận mới
  const handleSubmit = async () => {
    if (
      !formData.productId ||
      !formData.name ||
      !formData.issuer ||
      !formData.issueDate ||
      !formData.expiryDate
    ) {
      return alert("Vui lòng điền đủ các thông tin!");
    }

    try {
      setIsSubmitting(true);
      await certificateService.createCertificate({
        productId: formData.productId,
        name: formData.name.trim(),
        issuer: formData.issuer.trim(),
        issueDate: new Date(formData.issueDate).toISOString(),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        imageUrl:
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      });
      alert("Thêm chứng nhận thành công!");
      setIsModalOpen(false);
      setFormData((prev) => ({
        ...prev,
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
      }));
      fetchData();
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Mở Modal Sửa
  const handleOpenEditModal = (cert: any) => {
    setEditingCert(cert);
    setEditFormData({
      name: cert.name || "",
      issuer: cert.issuer || "Bộ Nông Nghiệp & PTNT",
      issueDate: cert.issueDate
        ? new Date(cert.issueDate).toISOString().split("T")[0]
        : "",
      expiryDate: cert.expiryDate
        ? new Date(cert.expiryDate).toISOString().split("T")[0]
        : "",
    });
    setIsEditModalOpen(true);
  };

  // 4. Lưu cập nhật Chứng nhận
  const handleUpdateCertificate = async () => {
    if (!editingCert) return;
    if (!editFormData.name || !editFormData.issueDate) {
      return alert("Vui lòng điền đủ tên chứng nhận và ngày cấp!");
    }

    try {
      setIsSubmitting(true);
      await certificateService.updateCertificate(editingCert.id, {
        name: editFormData.name.trim(),
        issueDate: new Date(editFormData.issueDate).toISOString(),
      });
      alert("Cập nhật chứng nhận thành công!");
      setIsEditModalOpen(false);
      setEditingCert(null);
      fetchData();
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Xóa Chứng nhận
  const handleDeleteCertificate = async (
    certId: string,
    certName: string,
    productName: string
  ) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa chứng nhận "${certName}" của sản phẩm "${productName}" không?`
      )
    ) {
      return;
    }

    try {
      await certificateService.deleteCertificate(certId);
      alert("Xóa chứng nhận thành công!");
      fetchData();
    } catch (error: any) {
      alert("Lỗi xóa: " + (error.message || "Không thể xóa chứng nhận này"));
    }
  };

  if (isLoading)
    return <div className="p-6">Đang tải danh sách Chứng nhận...</div>;

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý Chứng nhận
          </h1>
          <p className="text-gray-500 mt-1">
            Hồ sơ chứng nhận chất lượng giúp tăng độ uy tín cho nông sản
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Thêm chứng nhận mới
        </button>
      </div>

      {/* BẢNG DANH SÁCH CHỨNG NHẬN */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Sản phẩm</th>
              <th className="p-4 font-semibold text-gray-600">Tên Chứng nhận</th>
              <th className="p-4 font-semibold text-gray-600">Cơ quan cấp</th>
              <th className="p-4 font-semibold text-gray-600">Ngày cấp</th>
              <th className="p-4 font-semibold text-gray-600">Ngày hết hạn</th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Chưa có chứng nhận nào.
                </td>
              </tr>
            ) : (
              certificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                >
                  <td className="p-4 font-medium text-emerald-600">
                    {cert.productName}
                  </td>
                  <td className="p-4 text-gray-800 font-medium">{cert.name}</td>
                  <td className="p-4 text-gray-600">
                    {cert.issuer || "Bộ Nông Nghiệp (Mặc định)"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {cert.issueDate
                      ? new Date(cert.issueDate).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {cert.expiryDate
                      ? new Date(cert.expiryDate).toLocaleDateString("vi-VN")
                      : "Không thời hạn"}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(cert)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Sửa chứng nhận"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCertificate(
                            cert.id,
                            cert.name,
                            cert.productName
                          )
                        }
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa chứng nhận"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL THÊM CHỨNG NHẬN MỚI ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                Thêm chứng nhận mới
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn Sản phẩm <span className="text-red-500">*</span>
                </label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chứng nhận (VD: VietGAP, OCOP 4 Sao, GlobalGAP){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                  placeholder="VD: VietGAP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cơ quan cấp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                  placeholder="VD: Chi cục Quản lý Chất lượng Nông Lâm sản"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày cấp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hết hạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-xl transition shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Award className="w-4 h-4" />
                {isSubmitting ? "Đang xử lý..." : "Lưu Chứng nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CẬP NHẬT CHỨNG NHẬN ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Cập nhật Chứng nhận
                </h2>
                <p className="text-xs text-emerald-600 font-medium mt-0.5">
                  Sản phẩm: {editingCert?.productName}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingCert(null);
                }}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chứng nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cơ quan cấp
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={editFormData.issuer}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày cấp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={editFormData.issueDate}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hết hạn
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={editFormData.expiryDate}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingCert(null);
                }}
                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleUpdateCertificate}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-xl transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}