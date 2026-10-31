"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  MapPin,
  Phone,
  Mail,
  Package,
  Calendar,
  ExternalLink,
  Trash2,
  Eye,
  Star,
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
} from "lucide-react";
import { storeService } from "@/services/store.service";
import { userService } from "@/services/user.service";
import { toast } from "sonner";

export default function AdminStoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "PENDING">("ALL");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // State Modal xem chi tiết gian hàng
  const [selectedStore, setSelectedStore] = useState<any | null>(null);

  // 1. Tải danh sách cửa hàng (Admin lấy tất cả bao gồm Chờ duyệt)
  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const data = await storeService.getAllStoresForAdmin();
      setStores(data);
    } catch (error: any) {
      console.error("Lỗi tải danh sách cửa hàng:", error);
      toast.error("Lỗi tải danh sách cửa hàng: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // 2. Thống kê nhanh
  const activeStores = stores.filter((s) => s.owner?.role === "SELLER");
  const pendingStores = stores.filter((s) => s.owner?.role === "BUYER");
  const totalActiveStores = activeStores.length;
  const totalPendingStores = pendingStores.length;
  const totalProducts = stores.reduce(
    (sum, s) => sum + (s._count?.products || 0),
    0
  );
  const avgRating =
    totalActiveStores > 0
      ? (
          activeStores.reduce((sum, s) => sum + (s.rating || 5), 0) /
          totalActiveStores
        ).toFixed(1)
      : "5.0";

  // 3. Phê duyệt gian hàng
  const handleApproveStore = async (store: any) => {
    if (!store.owner?.id) {
      toast.error("Không tìm thấy thông tin chủ cửa hàng!");
      return;
    }
    try {
      setApprovingId(store.id);
      await userService.updateUserRole(store.owner.id, "SELLER" as any);
      toast.success(
        `Đã phê duyệt thành công gian hàng "${store.name}"! Chủ shop đã được nâng lên SELLER.`
      );
      if (selectedStore?.id === store.id) {
        setSelectedStore((prev: any) =>
          prev ? { ...prev, owner: { ...prev.owner, role: "SELLER" } } : null
        );
      }
      await fetchStores();
    } catch (error: any) {
      console.error("Lỗi duyệt gian hàng:", error);
      toast.error("Lỗi phê duyệt: " + (error.message || "Đã xảy ra lỗi"));
    } finally {
      setApprovingId(null);
    }
  };

  // 4. Lọc cửa hàng theo tìm kiếm & bộ lọc trạng thái
  const filteredStores = stores.filter((store) => {
    const term = searchTerm.toLowerCase();
    const matchName = (store.name || "").toLowerCase().includes(term);
    const matchOwner = (store.owner?.fullName || "").toLowerCase().includes(term);
    const matchAddress = (store.address || "").toLowerCase().includes(term);
    const matchPhone = (store.phone || "").includes(term);
    const matchSearch = matchName || matchOwner || matchAddress || matchPhone;

    if (!matchSearch) return false;

    if (statusFilter === "ACTIVE") return store.owner?.role === "SELLER";
    if (statusFilter === "PENDING") return store.owner?.role === "BUYER";
    return true;
  });

  // 5. Khóa / Xóa cửa hàng vi phạm
  const handleDeleteStore = async (store: any) => {
    const isPending = store.owner?.role === "BUYER";
    const confirmMsg = isPending
      ? `Bạn có chắc chắn muốn từ chối yêu cầu đăng ký gian hàng "${store.name}" của "${store.owner?.fullName || "Chưa rõ"}"?`
      : `Bạn có chắc chắn muốn khóa gian hàng "${store.name}" của đối tác "${store.owner?.fullName || "Chưa rõ"}" không? Gian hàng sẽ bị ẩn khỏi sàn.`;

    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      await storeService.deleteStore(store.id);
      toast.success(
        isPending ? "Đã từ chối gian hàng thành công!" : "Đã khóa gian hàng thành công!"
      );
      if (selectedStore?.id === store.id) {
        setSelectedStore(null);
      }
      fetchStores();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Đang tải danh sách gian hàng...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* TIÊU ĐỀ */}
      <div>
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý Gian hàng Nông sản
          </h1>
        </div>
        <p className="text-gray-500 text-sm mt-0.5">
          Giám sát đối tác kinh doanh, phê duyệt gian hàng đăng ký mới và kiểm soát cửa hàng trên sàn
        </p>
      </div>

      {/* THẺ THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gian hàng hoạt động */}
        <div
          onClick={() => setStatusFilter("ACTIVE")}
          className={`bg-white p-5 rounded-2xl shadow-sm border transition cursor-pointer ${
            statusFilter === "ACTIVE"
              ? "border-emerald-500 ring-2 ring-emerald-100"
              : "border-gray-100 hover:border-gray-200"
          } flex items-center justify-between`}
        >
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Gian hàng hoạt động
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {totalActiveStores}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Đã được phê duyệt</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Chờ phê duyệt */}
        <div
          onClick={() => setStatusFilter("PENDING")}
          className={`bg-white p-5 rounded-2xl shadow-sm border transition cursor-pointer ${
            statusFilter === "PENDING"
              ? "border-amber-500 ring-2 ring-amber-100"
              : "border-gray-100 hover:border-amber-200"
          } flex items-center justify-between`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Chờ phê duyệt
              </p>
              {totalPendingStores > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              )}
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {totalPendingStores}
            </p>
            <p className="text-xs text-amber-600 font-medium mt-0.5">
              {totalPendingStores > 0 ? "Cần admin xem xét" : "Không có yêu cầu"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Tổng sản phẩm */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tổng sản phẩm
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalProducts}</p>
            <p className="text-xs text-gray-400 mt-0.5">Mặt hàng đang niêm yết</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Đánh giá trung bình */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Đánh giá trung bình sàn
            </p>
            <p className="text-2xl font-bold text-amber-500 mt-1">⭐ {avgRating}</p>
            <p className="text-xs text-gray-400 mt-0.5">Chất lượng phục vụ chung</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên shop, chủ shop, SĐT, tỉnh thành..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>

        {/* Tab lọc trạng thái */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto bg-gray-100/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === "ALL"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Tất cả ({stores.length})
          </button>
          <button
            onClick={() => setStatusFilter("ACTIVE")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              statusFilter === "ACTIVE"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Hoạt động ({totalActiveStores})
          </button>
          <button
            onClick={() => setStatusFilter("PENDING")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              statusFilter === "PENDING"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-gray-500 hover:text-amber-700"
            }`}
          >
            Chờ duyệt ({totalPendingStores})
            {totalPendingStores > 0 && statusFilter !== "PENDING" && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>
        </div>
      </div>

      {/* BẢNG DANH SÁCH GIAN HÀNG */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Gian hàng</th>
                <th className="p-4">Chủ cửa hàng</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4">Liên hệ & Địa chỉ</th>
                <th className="p-4 text-center">Sản phẩm</th>
                <th className="p-4 text-center">Đánh giá</th>
                <th className="p-4">Ngày đăng ký</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredStores.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    Không tìm thấy gian hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredStores.map((store) => {
                  const isPending = store.owner?.role === "BUYER";
                  return (
                    <tr
                      key={store.id}
                      className={`hover:bg-gray-50/50 transition ${
                        isPending ? "bg-amber-50/30" : ""
                      }`}
                    >
                      {/* Cột 1: Tên & Logo Shop */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={store.logoUrl || "/images/products/cachuabi.avif"}
                            alt={store.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-100 bg-gray-50"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{store.name}</p>
                            <p className="text-xs text-gray-400 font-mono">
                              ID: {store.id.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Chủ cửa hàng */}
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">
                          {store.owner?.fullName || "Chưa rõ"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {store.owner?.email || "N/A"}
                        </p>
                      </td>

                      {/* Cột 3: Trạng thái (Chờ duyệt / Hoạt động) */}
                      <td className="p-4 text-center">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            Chờ duyệt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Hoạt động
                          </span>
                        )}
                      </td>

                      {/* Cột 4: Liên hệ & Địa chỉ */}
                      <td className="p-4">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{store.phone || "Chưa cập nhật SĐT"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500 max-w-xs truncate">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">
                              {store.address || "Chưa cập nhật địa chỉ"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 5: Số lượng sản phẩm */}
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          <Package className="w-3.5 h-3.5" />
                          {store._count?.products || 0} SP
                        </span>
                      </td>

                      {/* Cột 6: Đánh giá */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{store.rating || 5}</span>
                          <span className="text-gray-400 font-normal">
                            ({store.reviewsCount || 0})
                          </span>
                        </div>
                      </td>

                      {/* Cột 7: Ngày đăng ký */}
                      <td className="p-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {store.createdAt
                              ? new Date(store.createdAt).toLocaleDateString("vi-VN")
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Cột 8: Thao tác */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Phê duyệt nhanh nếu đang Chờ duyệt */}
                          {isPending && (
                            <button
                              onClick={() => handleApproveStore(store)}
                              disabled={approvingId === store.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition disabled:opacity-50"
                              title="Phê duyệt gian hàng"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              {approvingId === store.id ? "Đang duyệt..." : "Duyệt"}
                            </button>
                          )}

                          {/* Xem nhanh popup */}
                          <button
                            onClick={() => setSelectedStore(store)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Mở link public shop */}
                          <Link
                            href={`/cua-hang/${store.id}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Mở gian hàng trên web"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Khóa / Từ chối shop */}
                          <button
                            onClick={() => handleDeleteStore(store)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title={isPending ? "Từ chối yêu cầu" : "Khóa gian hàng"}
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
      </div>

      {/* ================= MODAL XEM CHI TIẾT GIAN HÀNG ================= */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Ảnh bìa */}
            <div className="h-28 bg-emerald-700 relative">
              {selectedStore.coverUrl && (
                <img
                  src={selectedStore.coverUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => setSelectedStore(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nội dung chi tiết */}
            <div className="p-6 pt-0 relative space-y-4">
              {/* Logo nổi */}
              <div className="-mt-10 flex items-end justify-between mb-2">
                <img
                  src={selectedStore.logoUrl || "/images/products/cachuabi.avif"}
                  alt={selectedStore.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                />
                {selectedStore.owner?.role === "SELLER" ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" /> Đối tác xác minh
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    <Clock className="w-3.5 h-3.5" /> Đang chờ phê duyệt
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedStore.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Chủ shop: <strong className="text-gray-800">{selectedStore.owner?.fullName}</strong> ({selectedStore.owner?.email})
                </p>
              </div>

              {/* Thông báo nếu đang chờ duyệt */}
              {selectedStore.owner?.role === "BUYER" && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-amber-900">Gian hàng chưa được kích hoạt</p>
                    <p className="text-amber-700 text-[11px] mt-0.5">
                      Chủ tài khoản đang mang quyền Buyer. Hãy bấm duyệt để cấp quyền Seller.
                    </p>
                  </div>
                  <button
                    onClick={() => handleApproveStore(selectedStore)}
                    disabled={approvingId === selectedStore.id}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-sm transition disabled:opacity-50"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    {approvingId === selectedStore.id ? "Đang duyệt..." : "Duyệt ngay"}
                  </button>
                </div>
              )}

              {/* Mô tả */}
              <div className="bg-gray-50 p-3.5 rounded-xl text-xs text-gray-600 leading-relaxed">
                {selectedStore.description || "Gian hàng chưa cập nhật phần giới thiệu."}
              </div>

              {/* Thông tin liên hệ */}
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{selectedStore.phone || "Chưa có"}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="truncate">{selectedStore.email || "Chưa có"}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 col-span-2">
                  <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span className="truncate">{selectedStore.address || "Chưa cập nhật địa chỉ"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
              <Link
                href={`/cua-hang/${selectedStore.id}`}
                target="_blank"
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                Mở trang gian hàng <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setSelectedStore(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
