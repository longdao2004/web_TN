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
import { useAuthStore } from "@/store/auth.store";
import { Role } from "@/types/user";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.user); // Lấy thông tin Admin đang đăng nhập

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
    if (user.id === currentUser?.id) {
      alert("Bạn không thể tự thay đổi vai trò của chính mình!");
      return;
    }
    setEditingUser(user);
    setNewRole(user.role);
    setIsRoleModalOpen(true);
  };

  // 5. Lưu vai trò mới
  const handleSaveRole = async () => {
    if (!editingUser) return;
    if (editingUser.id === currentUser?.id && newRole !== "ADMIN") {
      alert("Bạn không thể tự hạ quyền Quản trị viên của chính mình!");
      return;
    }
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
    if (user.id === currentUser?.id) {
      alert("Bạn không thể tự khóa tài khoản Quản trị viên của chính mình!");
      return;
    }

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
    <div className="space-y-6">
      {/* 4 Thẻ KPI thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-xl text-gray-700">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Khách mua hàng</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.buyers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Đối tác Bán hàng</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.sellers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Quản trị viên</p>
              <p className="text-2xl font-bold text-rose-600 mt-1">{stats.admins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc vai trò */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="BUYER">Khách mua (BUYER)</option>
            <option value="SELLER">Người bán nông sản (SELLER)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách người dùng */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/75 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <th className="p-4">Người dùng</th>
                <th className="p-4">Liên hệ</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Ngày tham gia</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrentAdmin = user.id === currentUser?.id;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition">
                      {/* Cột 1: Tên & Avatar */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                            {(user.fullName || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">{user.fullName}</p>
                              {isCurrentAdmin && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                  Bạn
                                </span>
                              )}
                            </div>
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

                      {/* Cột 5: Nút thao tác (Bảo vệ tài khoản chính mình) */}
                      <td className="p-4 text-center">
                        {isCurrentAdmin ? (
                          <span className="text-xs text-gray-400 italic font-medium">
                            Đang đăng nhập
                          </span>
                        ) : (
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
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Phân quyền người dùng */}
      {isRoleModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <UserCog className="w-5 h-5 text-emerald-600" />
                <span>Cập nhật vai trò người dùng</span>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  {(editingUser.fullName || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{editingUser.fullName}</p>
                  <p className="text-xs text-gray-500">{editingUser.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Chọn vai trò mới:
                </label>
                <div className="space-y-2">
                  {/* BUYER */}
                  <div
                    onClick={() => setNewRole("BUYER")}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      newRole === "BUYER"
                        ? "border-emerald-600 bg-emerald-50/50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">Khách mua hàng (BUYER)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Quyền mua sắm nông sản và đánh giá</p>
                    </div>
                    {newRole === "BUYER" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </div>

                  {/* SELLER */}
                  <div
                    onClick={() => setNewRole("SELLER")}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      newRole === "SELLER"
                        ? "border-emerald-600 bg-emerald-50/50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">Đối tác Bán hàng (SELLER)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Quản lý gian hàng, sản phẩm và đơn bán</p>
                    </div>
                    {newRole === "SELLER" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </div>

                  {/* ADMIN */}
                  <div
                    onClick={() => setNewRole("ADMIN")}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      newRole === "ADMIN"
                        ? "border-emerald-600 bg-emerald-50/50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">Quản trị viên (ADMIN)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Toàn quyền giám sát hệ thống sàn</p>
                    </div>
                    {newRole === "ADMIN" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSaveRole}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}