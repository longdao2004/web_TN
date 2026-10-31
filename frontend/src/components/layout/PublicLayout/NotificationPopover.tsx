"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  LogIn,
  Store,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { orderService } from "@/services/order.service";
import { storeService } from "@/services/store.service";
import { toast } from "sonner";

// Trợ thủ phân loại thông báo theo trạng thái đơn hàng
const getNotificationInfo = (order: any) => {
  const shortId = order.id ? order.id.split("-")[0].toUpperCase() : "";
  switch (order.status) {
    case "PENDING":
      return {
        title: `Đơn hàng #${shortId} đã được tạo`,
        desc: "Đang chờ nhà vườn xác nhận và chuẩn bị hàng.",
        icon: Clock,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50",
      };
    case "PACKING":
      return {
        title: `Đơn hàng #${shortId} đang đóng gói`,
        desc: "Nhà vườn đang kiểm tra độ tươi ngon và đóng gói.",
        icon: Package,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50",
      };
    case "SHIPPING":
      return {
        title: `Đơn hàng #${shortId} đang được giao`,
        desc: "Nông sản đang trên đường vận chuyển tới bạn.",
        icon: Truck,
        iconColor: "text-indigo-500",
        iconBg: "bg-indigo-50",
      };
    case "COMPLETED":
    case "DELIVERED":
      return {
        title: `Đơn hàng #${shortId} giao thành công`,
        desc: "Cảm ơn bạn đã tin dùng nông sản sạch tại AgriMarket!",
        icon: CheckCircle2,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-50",
      };
    case "CANCELLED":
      return {
        title: `Đơn hàng #${shortId} đã hủy`,
        desc: "Đơn hàng đã được hủy và tồn kho đã hoàn lại.",
        icon: XCircle,
        iconColor: "text-rose-500",
        iconBg: "bg-rose-50",
      };
    default:
      return {
        title: `Đơn hàng #${shortId}`,
        desc: "Có cập nhật mới về đơn hàng của bạn.",
        icon: Package,
        iconColor: "text-gray-500",
        iconBg: "bg-gray-50",
      };
  }
};

export const NotificationPopover = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [myStore, setMyStore] = useState<any | null>(null);
  const [isStoreSeen, setIsStoreSeen] = useState(false);
  const [isStoreLockedSeen, setIsStoreLockedSeen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lắng nghe sự kiện click bên ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 1. Lấy dữ liệu đơn hàng & thông tin gian hàng khi đăng nhập
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotificationData = async () => {
      try {
        setIsLoading(true);
        // Đồng thời lấy lịch sử đơn hàng và thông tin gian hàng của user
        const [ordersData, storeData] = await Promise.all([
          orderService.getOrderHistory().catch(() => []),
          storeService.getMyStore().catch(() => null),
        ]);

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setMyStore(storeData);

        if (storeData && typeof window !== "undefined") {
          const seenApproved = localStorage.getItem(`store_approved_seen_${storeData.id}`);
          setIsStoreSeen(!!seenApproved);

          if (storeData.deletedAt) {
            const seenLocked = localStorage.getItem(`store_locked_seen_${storeData.id}_${storeData.deletedAt}`);
            setIsStoreLockedSeen(!!seenLocked);
          }
        }
      } catch (err) {
        console.error("Lỗi tải thông báo:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationData();
  }, [isAuthenticated, user?.role, isOpen]);

  // 2. Tự động bắn Toast thông báo (Duyệt hoặc Khóa gian hàng)
  useEffect(() => {
    if (!myStore || typeof window === "undefined") return;

    // 2a. Trường hợp gian hàng BỊ KHÓA bởi Admin
    if (myStore.deletedAt) {
      const lockKey = `store_locked_toast_${myStore.id}_${myStore.deletedAt}`;
      const alreadyNotified = localStorage.getItem(lockKey);

      if (!alreadyNotified) {
        localStorage.setItem(lockKey, "true");
        toast.error(
          `⚠️ Gian hàng "${myStore.name}" của bạn đã bị Ban quản trị tạm khóa!`,
          {
            description:
              "Gian hàng và toàn bộ sản phẩm đã bị ẩn khỏi sàn. Quyền tài khoản đã chuyển về Người mua. Vui lòng liên hệ ban quản trị để được hỗ trợ.",
            duration: 9000,
          }
        );
      }
      return;
    }

    // 2b. Trường hợp gian hàng ĐƯỢC PHÊ DUYỆT thành SELLER
    if (user?.role === "SELLER") {
      const approveKey = `store_approved_toast_${myStore.id}`;
      const alreadyNotified = localStorage.getItem(approveKey);

      if (!alreadyNotified) {
        localStorage.setItem(approveKey, "true");
        toast.success(
          `🎉 Chúc mừng bạn! Gian hàng "${myStore.name}" đã được phê duyệt!`,
          {
            description:
              "Bạn đã chính thức trở thành Đối tác bán hàng. Hãy vào Kênh Người Bán để đăng nông sản ngay.",
            duration: 8000,
            action: {
              label: "Vào Kênh Bán",
              onClick: () => router.push("/seller"),
            },
          }
        );
      }
    }
  }, [myStore, user?.role, router]);

  // Đánh dấu đã xem thông báo gian hàng khi mở popup
  const handleOpenPopover = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState && myStore) {
      if (typeof window !== "undefined") {
        if (!myStore.deletedAt && user?.role === "SELLER" && !isStoreSeen) {
          localStorage.setItem(`store_approved_seen_${myStore.id}`, "true");
          setIsStoreSeen(true);
        }
        if (myStore.deletedAt && !isStoreLockedSeen) {
          localStorage.setItem(`store_locked_seen_${myStore.id}_${myStore.deletedAt}`, "true");
          setIsStoreLockedSeen(true);
        }
      }
    }
  };

  // Số lượng đơn hàng đang chờ hoặc đang giao
  const activeOrdersCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PACKING" || o.status === "SHIPPING"
  ).length;

  // Cờ thông báo phê duyệt gian hàng mới (chưa xem)
  const hasUnreadStoreApproval = Boolean(
    myStore && !myStore.deletedAt && user?.role === "SELLER" && !isStoreSeen
  );

  // Cờ thông báo gian hàng bị khóa (chưa xem)
  const hasUnreadStoreLocked = Boolean(
    myStore && myStore.deletedAt && !isStoreLockedSeen
  );

  const totalBadgeCount =
    activeOrdersCount +
    (hasUnreadStoreApproval ? 1 : 0) +
    (hasUnreadStoreLocked ? 1 : 0);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Nút bấm Quả chuông */}
      <button
        type="button"
        onClick={handleOpenPopover}
        className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none"
        title="Thông báo"
      >
        <Bell className="h-5 w-5" />
        {isAuthenticated && totalBadgeCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {totalBadgeCount > 9 ? "9+" : totalBadgeCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Tiêu đề Popover */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">Thông báo</span>
              {totalBadgeCount > 0 && (
                <span className="bg-amber-100 text-amber-700 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                  {totalBadgeCount} mới
                </span>
              )}
            </div>
            {isAuthenticated && orders.length > 0 && (
              <Link
                href="/tai-khoan/don-hang"
                onClick={() => setIsOpen(false)}
                className="text-xs text-[var(--color-primary)] hover:underline font-medium"
              >
                Xem đơn hàng
              </Link>
            )}
          </div>

          {/* Danh sách thông báo */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
            {!isAuthenticated ? (
              <div className="p-6 text-center">
                <LogIn className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800">Chưa đăng nhập</p>
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  Đăng nhập để nhận thông báo về trạng thái đơn hàng và gian hàng.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dang-nhap");
                  }}
                  className="bg-[var(--color-primary)] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Đăng nhập ngay
                </button>
              </div>
            ) : isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-9 h-9 bg-gray-100 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5 py-1">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* 🚫 THÔNG BÁO GIAN HÀNG BỊ KHÓA / TẠM DỪNG */}
                {myStore && myStore.deletedAt && (
                  <div className="p-3.5 bg-rose-50/80 hover:bg-rose-50 transition-colors flex items-start gap-3 border-b border-rose-100">
                    <div className="p-2 rounded-xl shrink-0 bg-rose-600 text-white shadow-sm ring-2 ring-rose-200">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                          <XCircle className="w-2.5 h-2.5" /> ĐÃ BỊ TẠM KHÓA
                        </span>
                        <span className="text-[11px] text-rose-800 font-medium">
                          Thông báo vi phạm
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 mt-1">
                        Gian hàng &ldquo;{myStore.name}&rdquo; đã bị Ban quản trị tạm khóa
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        Gian hàng và toàn bộ sản phẩm của bạn hiện đã bị ẩn khỏi sàn giao dịch. Quyền tài khoản đã chuyển về Người mua. Vui lòng liên hệ ban quản trị AgriMarket nếu cần hỗ trợ giải quyết.
                      </p>
                    </div>
                  </div>
                )}

                {/* 🌟 THÔNG BÁO GIAN HÀNG ĐÃ ĐƯỢC DUYỆT (Dành cho SELLER) */}
                {myStore && !myStore.deletedAt && user?.role === "SELLER" && (
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/seller");
                    }}
                    className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 hover:bg-emerald-100/60 cursor-pointer transition-colors flex items-start gap-3 border-b border-emerald-100"
                  >
                    <div className="p-2 rounded-xl shrink-0 bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-200">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                          <Sparkles className="w-2.5 h-2.5" /> ĐÃ PHÊ DUYỆT 🎉
                        </span>
                        <span className="text-[11px] text-emerald-800 font-medium">
                          Đối tác bán hàng
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 mt-1">
                        Gian hàng &ldquo;{myStore.name}&rdquo; đã sẵn sàng hoạt động!
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        Ban quản trị đã phê duyệt yêu cầu của bạn. Bấm để vào Kênh Người Bán và đăng nông sản ngay.
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800">
                        <span>Vào Kênh Người Bán</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ⏳ THÔNG BÁO GIAN HÀNG ĐANG CHỜ DUYỆT (Dành cho BUYER có gian hàng) */}
                {myStore && !myStore.deletedAt && user?.role === "BUYER" && (
                  <div className="p-3.5 bg-amber-50/60 hover:bg-amber-50 cursor-default transition-colors flex items-start gap-3 border-b border-amber-100">
                    <div className="p-2 rounded-xl shrink-0 bg-amber-500 text-white shadow-sm">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                          ĐANG CHỜ DUYỆT
                        </span>
                        <span className="text-[11px] text-amber-800 font-medium">
                          Hồ sơ mở shop
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 mt-1">
                        Yêu cầu mở gian hàng &ldquo;{myStore.name}&rdquo; đang được xử lý
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        Hệ thống đã lưu thông tin đăng ký. Quản trị viên đang xem xét và sẽ cấp quyền sớm cho bạn.
                      </p>
                    </div>
                  </div>
                )}

                {/* Danh sách thông báo đơn hàng */}
                {orders.length === 0 && !myStore ? (
                  <div className="p-8 text-center">
                    <Bell className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Chưa có thông báo nào</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Các cập nhật về đơn hàng và gian hàng sẽ xuất hiện tại đây.
                    </p>
                  </div>
                ) : (
                  orders.slice(0, 5).map((order) => {
                    const info = getNotificationInfo(order);
                    const IconComponent = info.icon;
                    return (
                      <div
                        key={order.id}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/theo-doi-don-hang/${order.id}`);
                        }}
                        className="p-3.5 hover:bg-gray-50/80 cursor-pointer transition-colors flex items-start gap-3"
                      >
                        <div
                          className={`p-2 rounded-xl shrink-0 ${info.iconBg} ${info.iconColor}`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {info.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {info.desc}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                            <span>
                              {new Intl.DateTimeFormat("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(new Date(order.createdAt))}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-600">
                              {order.totalAmount.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}
          </div>

          {/* Chân Popover */}
          {isAuthenticated && orders.length > 0 && (
            <div className="p-2 border-t border-gray-100 text-center bg-gray-50/50 rounded-b-2xl">
              <Link
                href="/tai-khoan/don-hang"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-600 hover:text-[var(--color-primary)] font-medium inline-flex items-center gap-1 py-1"
              >
                Xem toàn bộ đơn mua
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
