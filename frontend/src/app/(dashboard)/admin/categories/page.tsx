"use client";
import React, { useState, useEffect } from "react";
import {
  Tags,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Package,
  Calendar,
  Layers,
} from "lucide-react";
import { categoryService } from "@/services/category.service";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State Modal (Thêm / Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Tải danh sách danh mục
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error: any) {
      console.error("Lỗi tải danh mục:", error);
      alert("Lỗi tải danh mục: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Thống kê nhanh
  const totalCategories = categories.length;
  const totalProductsClassified = categories.reduce((sum, c) => sum + (c.count || 0), 0);

  // 3. Lọc danh mục theo tìm kiếm
  const filteredCategories = categories.filter((cat) => {
    const matchName = (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchDesc = (cat.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchName || matchDesc;
  });

  // 4. Mở modal thêm mới
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  // 5. Mở modal chỉnh sửa
  const handleOpenEditModal = (cat: any) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || "" });
    setIsModalOpen(true);
  };

  // 6. Xử lý lưu (Thêm mới hoặc Cập nhật)
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      return alert("Vui lòng nhập tên danh mục!");
    }

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        // Cập nhật
        await categoryService.updateCategory(editingCategory.id, formData);
        alert("Cập nhật danh mục thành công!");
      } else {
        // Thêm mới
        await categoryService.createCategory(formData);
        alert("Thêm danh mục mới thành công!");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
      fetchCategories();
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Xóa danh mục
  const handleDeleteCategory = async (cat: any) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa danh mục "${cat.name}" không?`
      )
    ) {
      return;
    }

    try {
      await categoryService.deleteCategory(cat.id);
      alert("Xóa danh mục thành công!");
      fetchCategories();
    } catch (error: any) {
      alert("Lỗi xóa danh mục: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Đang tải danh mục nông sản...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* TIÊU ĐỀ & NÚT THÊM */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tags className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Danh mục Nông sản Hệ thống
            </h1>
          </div>
          <p className="text-gray-500 text-sm mt-0.5">
            Cấu hình danh mục mặt hàng cho toàn bộ người bán và khách mua trên sàn
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition font-medium shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Thêm danh mục mới
        </button>
      </div>

      {/* THẺ THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tổng số danh mục
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalCategories}</p>
            <p className="text-xs text-gray-400 mt-0.5">Phân loại đang hoạt động</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tổng sản phẩm đã phân loại
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalProductsClassified}</p>
            <p className="text-xs text-gray-400 mt-0.5">Nông sản niêm yết trên toàn sàn</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên danh mục, mô tả..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* BẢNG DANH MỤC */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Tên danh mục</th>
                <th className="p-4">Mô tả</th>
                <th className="p-4 text-center">Số lượng sản phẩm</th>
                <th className="p-4">Ngày tạo</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Không tìm thấy danh mục nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition">
                    {/* Tên danh mục */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Tags className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{cat.name}</p>
                          <p className="text-xs text-gray-400 font-mono">
                            ID: {cat.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Mô tả */}
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {cat.description || <span className="text-gray-400 italic">Không có mô tả</span>}
                    </td>

                    {/* Số lượng sản phẩm */}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Package className="w-3.5 h-3.5" />
                        {cat.count} sản phẩm
                      </span>
                    </td>

                    {/* Ngày tạo */}
                    <td className="p-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {cat.createdAt
                            ? new Date(cat.createdAt).toLocaleDateString("vi-VN")
                            : "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Sửa danh mục"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Xóa danh mục"
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
      </div>

      {/* ================= MODAL THÊM / SỬA DANH MỤC ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editingCategory ? "Cập nhật Danh mục" : "Thêm Danh mục Mới"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCategory(null);
                }}
                className="text-gray-400 hover:text-rose-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Rau củ quả hữu cơ, Trái cây xuất khẩu..."
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả danh mục
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả tóm tắt về nhóm nông sản này..."
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-2.5 bg-gray-50">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCategory(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Đang lưu..." : editingCategory ? "Lưu thay đổi" : "Tạo danh mục"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}