"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Store,
  Shield,
  Trash2,
  UserCog,
  X,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { userService } from "@/services/user.service";
import { Role } from "@/types/user";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bộ lọc tìm kiếm và vai trò
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");

  // State Modal phân quyền
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [newRole, setNewRole] = useState<Role>("BUYER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Tải danh sách người dùng từ Backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error: any) {
      console.error("Lỗi tải người dùng:", error);
      alert("Lỗi tải danh sách: " + (error.message || "Không có quyền truy cập"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Thống kê nhanh số lượng người dùng theo từng nhóm
  const stats = {
    total: users.length,
    buyers: users.filter((u) => u.role === "BUYER").length,
    sellers: users.filter((u) => u.role === "SELLER").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  };

  // 3. Lọc danh sách người dùng theo Search Term và Role
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      (u.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone || "").includes(searchTerm);
    const matchRole = selectedRole === "ALL" || u.role === selectedRole;
    return matchSearch && matchRole;
  });

  // 4. Mở Modal phân quyền
  const handleOpenRoleModal = (user: any) => {
    setEditingUser(user);
    setNewRole(user.role);
    setIsRoleModalOpen(true);
  };

  // 5. Lưu vai trò mới
  const handleSaveRole = async () => {
    if (!editingUser) return;
    try {
      setIsSubmitting(true);
      await userService.updateUserRole(editingUser.id, newRole);
      alert(`Đã cập nhật vai trò của "${editingUser.fullName}" thành ${newRole}!`);
      setIsRoleModalOpen(false);
      setEditingUser(null);
      fetchUsers(); // Tải lại bảng
    } catch (error: any) {
      alert("Lỗi cập nhật: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Khóa / Xóa tài khoản người dùng
  const handleDeleteUser = async (user: any) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn khóa tài khoản "${user.fullName}" (${user.email}) không? Người dùng này sẽ không thể đăng nhập vào sàn nữa.`
      )
    ) {
      return;
    }

    try {
      await userService.deleteUser(user.id);
      alert("Đã khóa tài khoản thành công!");
      fetchUsers();
    } catch (error: any) {
      alert("Lỗi khóa tài khoản: " + error.message);
    }
  };

  // Badge màu cho từng vai trò
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
            <Shield className="w-3.5 h-3.5" /> Quản trị viên
          </span>
        );
      case "SELLER":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Store className="w-3.5 h-3.5" /> Người bán
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <UserCheck className="w-3.5 h-3.5" /> Khách mua
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* TIÊU ĐỀ */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý Người dùng & Phân quyền
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Theo dõi toàn bộ tài khoản thành viên, phân quyền truy cập và kiểm soát người dùng
        </p>
      </div>

      {/* THẺ THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Tổng thành viên</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Khách mua hàng</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.buyers}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Đối tác Bán hàng</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.sellers}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Quản trị viên</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{stats.admins}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-medium text-gray-700 transition"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="BUYER">Khách mua hàng (BUYER)</option>
            <option value="SELLER">Người bán nông sản (SELLER)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>
      </div>

      {/* BẢNG DANH SÁCH NGƯỜI DÙNG */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Người dùng</th>
                <th className="p-4">Liên hệ</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Ngày tham gia</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition">
                    {/* Cột 1: Tên & Avatar */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                          {(user.fullName || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-400 font-mono">
                            ID: {user.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Email & SĐT */}
                    <td className="p-4">
                      <div className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.phone || "Chưa cập nhật"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Cột 3: Badge Vai trò */}
                    <td className="p-4">{getRoleBadge(user.role)}</td>

                    {/* Cột 4: Ngày tham gia */}
                    <td className="p-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                            : "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Cột 5: Nút thao tác */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Nút đổi quyền */}
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Phân quyền tài khoản"
                        >
                          <UserCog className="w-4 h-4" />
                        </button>

                        {/* Nút khóa tài khoản */}
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Khóa tài khoản"
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

      {/* ================= MODAL PHÂN QUYỀN TÀI KHOẢN ================= */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Phân quyền Người dùng
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tài khoản: <strong className="text-gray-900">{editingUser?.fullName}</strong>
                </p>
              </div>
              <button
                onClick={() => {
                  setIsRoleModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-gray-400 hover:text-rose-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-500">
                Chọn vai trò phù hợp cho người dùng này. Quyền hạn sẽ được áp dụng ngay sau khi lưu.
              </p>

              {/* Lựa chọn BUYER */}
              <label
                onClick={() => setNewRole("BUYER")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  newRole === "BUYER"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Khách mua hàng (BUYER)</p>
                    <p className="text-xs text-gray-500">Mua sắm, đặt hàng và đánh giá sản phẩm</p>
                  </div>
                </div>
                {newRole === "BUYER" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </label>

              {/* Lựa chọn SELLER */}
              <label
                onClick={() => setNewRole("SELLER")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  newRole === "SELLER"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Đối tác Bán hàng (SELLER)</p>
                    <p className="text-xs text-gray-500">Mở gian hàng, đăng nông sản, quản lý lô hàng & đơn</p>
                  </div>
                </div>
                {newRole === "SELLER" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </label>

              {/* Lựa chọn ADMIN */}
              <label
                onClick={() => setNewRole("ADMIN")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  newRole === "ADMIN"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Quản trị viên (ADMIN)</p>
                    <p className="text-xs text-gray-500">Toàn quyền cấu hình sàn, duyệt shop và phân quyền</p>
                  </div>
                </div>
                {newRole === "ADMIN" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </label>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-2.5 bg-gray-50">
              <button
                onClick={() => {
                  setIsRoleModalOpen(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveRole}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Đang lưu..." : "Xác nhận Đổi quyền"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}