"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { storeService } from "@/services/store.service";
import { productService } from "@/services/product.service";
import { batchService } from "@/services/batch.service";

export default function SellerBatchesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Danh sách sản phẩm & tất cả lô hàng
  const [products, setProducts] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  // Dữ liệu nhập form THÊM MỚI
  const [formData, setFormData] = useState({
    productId: "",
    harvestDate: "",
    expiryDate: "",
    quantity: "",
    price: "",
  });

  // Dữ liệu đang SỬA
  const [editingBatch, setEditingBatch] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    harvestDate: "",
    expiryDate: "",
    quantity: "",
    price: "",
  });

  // 1. Hàm tải dữ liệu
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const store = await storeService.getMyStore();
      const prods = await productService.getProducts({ storeId: store.id });
      setProducts(prods);

      let allBatches: any[] = [];
      prods.forEach((p: any) => {
        if (p.batches && p.batches.length > 0) {
          p.batches.forEach((b: any) => {
            allBatches.push({ ...b, productName: p.name });
          });
        }
      });

      // Sắp xếp lô mới nhất lên đầu
      allBatches.sort(
        (a, b) =>
          new Date(b.createdAt || b.harvestDate).getTime() -
          new Date(a.createdAt || a.harvestDate).getTime()
      );
      setBatches(allBatches);

      if (prods.length > 0) {
        setFormData((prev) => ({ ...prev, productId: prods[0].id }));
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu lô hàng:", error);
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

  // 2. Thêm Lô hàng mới
  const handleSubmit = async () => {
    if (
      !formData.productId ||
      !formData.harvestDate ||
      !formData.expiryDate ||
      !formData.quantity ||
      !formData.price
    ) {
      return alert("Vui lòng điền đủ các thông tin!");
    }

    try {
      setIsSubmitting(true);
      await batchService.createBatch({
        productId: formData.productId,
        harvestDate: new Date(formData.harvestDate).toISOString(),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      });
      alert("Nhập lô hàng thành công!");
      setIsModalOpen(false);
      setFormData((prev) => ({
        ...prev,
        harvestDate: "",
        expiryDate: "",
        quantity: "",
        price: "",
      }));
      fetchData();
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Mở Modal Sửa
  const handleOpenEditModal = (batch: any) => {
    setEditingBatch(batch);
    setEditFormData({
      harvestDate: batch.harvestDate
        ? new Date(batch.harvestDate).toISOString().split("T")[0]
        : "",
      expiryDate: batch.expiryDate
        ? new Date(batch.expiryDate).toISOString().split("T")[0]
        : "",
      quantity: batch.quantity?.toString() || "",
      price: batch.price?.toString() || "",
    });
    setIsEditModalOpen(true);
  };

  // 4. Lưu cập nhật Lô hàng
  const handleUpdateBatch = async () => {
    if (!editingBatch) return;
    if (
      !editFormData.harvestDate ||
      !editFormData.expiryDate ||
      !editFormData.quantity ||
      !editFormData.price
    ) {
      return alert("Vui lòng điền đủ các thông tin!");
    }

    try {
      setIsSubmitting(true);
      await batchService.updateBatch(editingBatch.id, {
        harvestDate: new Date(editFormData.harvestDate).toISOString(),
        expiryDate: new Date(editFormData.expiryDate).toISOString(),
        quantity: Number(editFormData.quantity),
        price: Number(editFormData.price),
      });
      alert("Cập nhật lô hàng thành công!");
      setIsEditModalOpen(false);
      setEditingBatch(null);
      fetchData();
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Xóa Lô hàng (kèm thông báo an toàn nếu lô đã có người mua)
  const handleDeleteBatch = async (batchId: string, productName: string) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa lô hàng của sản phẩm "${productName}" không?`
      )
    ) {
      return;
    }

    try {
      await batchService.deleteBatch(batchId);
      alert("Xóa lô hàng thành công!");
      fetchData();
    } catch (error: any) {
      alert("Lỗi xóa: " + (error.message || "Không thể xóa lô hàng này"));
    }
  };

  // 6. Tính trạng thái lô hàng
  const getStatusStyle = (stock: number, expiry: string) => {
    const today = new Date();
    const expDate = new Date(expiry);
    const daysLeft = Math.floor(
      (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (stock <= 0)
      return { text: "Hết hàng", color: "bg-gray-100 text-gray-700" };
    if (daysLeft < 0)
      return { text: "Hết hạn", color: "bg-red-100 text-red-700" };
    if (daysLeft <= 7)
      return { text: "Sắp hết hạn", color: "bg-amber-100 text-amber-700" };
    return { text: "Đang bán", color: "bg-emerald-100 text-emerald-700" };
  };

  if (isLoading)
    return <div className="p-6">Đang tải danh sách Lô hàng...</div>;

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Lô hàng</h1>
          <p className="text-gray-500 mt-1">
            Quản lý tồn kho, ngày thu hoạch và hạn sử dụng theo từng đợt
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nhập lô hàng mới
        </button>
      </div>

      {/* BẢNG LÔ HÀNG */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Sản phẩm</th>
              <th className="p-4 font-semibold text-gray-600">Ngày thu hoạch</th>
              <th className="p-4 font-semibold text-gray-600">Hạn sử dụng</th>
              <th className="p-4 font-semibold text-gray-600">Giá bán</th>
              <th className="p-4 font-semibold text-gray-600">Tồn kho</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  Chưa có lô hàng nào.
                </td>
              </tr>
            ) : (
              batches.map((batch) => {
                const status = getStatusStyle(batch.quantity, batch.expiryDate);
                return (
                  <tr
                    key={batch.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                  >
                    <td className="p-4 font-medium text-emerald-600">
                      {batch.productName}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(batch.harvestDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(batch.expiryDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">
                      {batch.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {batch.quantity}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(batch)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Sửa lô hàng"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteBatch(batch.id, batch.productName)
                          }
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa lô hàng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL NHẬP LÔ HÀNG MỚI ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                Nhập lô hàng mới
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày thu hoạch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn sử dụng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng nhập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá bán đợt này <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none"
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
                className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-xl transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận Nhập"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CẬP NHẬT LÔ HÀNG ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Cập nhật Lô hàng
                </h2>
                <p className="text-xs text-emerald-600 font-medium mt-0.5">
                  {editingBatch?.productName}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingBatch(null);
                }}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày thu hoạch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="harvestDate"
                    value={editFormData.harvestDate}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn sử dụng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={editFormData.expiryDate}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={editFormData.quantity}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingBatch(null);
                }}
                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleUpdateBatch}
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