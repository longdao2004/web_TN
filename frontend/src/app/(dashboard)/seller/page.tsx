"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign, ShoppingBag, Clock, AlertTriangle, Package, Truck,
  CheckCircle, XCircle, ArrowRight, TrendingUp, CheckCircle2, Layers,
  Users, Download, Star, CreditCard, AlertCircle, Sparkles,
} from "lucide-react";
import { statisticService } from "@/services/statistic.service";

/* ================================================================== */
/* HẰNG SỐ CẤU HÌNH                                                    */
/* Lưu ý: giữ nguyên chuỗi class Tailwind đầy đủ (không ghép động)     */
/* để Tailwind nhận diện được lúc build.                               */
/* ================================================================== */

// Các lựa chọn khoảng thời gian thống kê
const PERIODS = [
  ["all", "Toàn thời gian"],
  ["7d", "7 ngày qua"],
  ["30d", "30 ngày qua"],
  ["month", "Tháng này"],
] as const;

// Các tab điều hướng
const TABS = [
  ["overview", "1. Tổng quan & Quản trị Kho", Layers],
  ["products", "2. Nông sản & Dòng tiền", ShoppingBag],
  ["customers", "3. Khách hàng & Đánh giá", Users],
] as const;

type TabKey = (typeof TABS)[number][0];

// Các trạng thái đơn hàng: [key, nhãn, icon, class khung, class icon, class số]
const FUNNEL = [
  ["pending", "Chờ xác nhận", Clock, "bg-amber-50/60 border-amber-100", "text-amber-600", "text-amber-700"],
  ["packing", "Đang đóng gói", Package, "bg-indigo-50/60 border-indigo-100", "text-indigo-600", "text-indigo-700"],
  ["shipping", "Đang giao hàng", Truck, "bg-blue-50/60 border-blue-100", "text-blue-600", "text-blue-700"],
  ["completed", "Giao thành công", CheckCircle, "bg-emerald-50/60 border-emerald-100", "text-emerald-600", "text-emerald-700"],
  ["cancelled", "Đã hủy", XCircle, "bg-gray-50 border-gray-200/70", "text-gray-400", "text-gray-600"],
] as const;

// Map trạng thái đơn hàng sang tiếng Việt (dùng khi xuất CSV)
const STATUS_MAP: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  PACKING: "Đang đóng gói",
  SHIPPING: "Đang giao hàng",
  COMPLETED: "Giao thành công",
  CANCELLED: "Đã hủy",
};

/* ================================================================== */
/* HÀM TIỆN ÍCH                                                        */
/* ================================================================== */

// Định dạng tiền VNĐ: 1.000.000đ
const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

// Định dạng ngày theo kiểu Việt Nam
const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");

// Xuất danh sách đơn hàng ra CSV (có UTF-8 BOM để Excel hiển thị đúng tiếng Việt)
function exportOrdersCSV(data: any) {
  const orders = data?.recentOrdersForExport;
  if (!orders?.length) {
    alert("Chưa có dữ liệu đơn hàng để xuất báo cáo!");
    return;
  }

  try {
    const headers = [
      "Mã đơn hàng", "Ngày đặt hàng", "Tên khách hàng", "Số điện thoại",
      "Số món", "Tổng tiền (VNĐ)", "Thanh toán", "Trạng thái",
    ];

    const rows = orders.map((o: any) => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleString("vi-VN")}"`,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      o.itemsCount,
      o.totalAmount,
      `"${o.paymentMethod}"`,
      `"${STATUS_MAP[o.status] || o.status}"`,
    ]);

    // \uFEFF = BOM giúp Excel đọc đúng UTF-8
    const csv = "\uFEFF" + [headers, ...rows].map((r: any) => r.join(",")).join("\r\n");

    // Tạo tên file: Bao_cao_don_hang_<tên shop>_<ngày>.csv
    const shop = (data?.storeName || "Nong_San").replace(/[^a-zA-Z0-9]/g, "_");
    const day = new Date().toISOString().split("T")[0];

    // Tạo link ẩn để trình duyệt tải file xuống
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    link.download = `Bao_cao_don_hang_${shop}_${day}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Lỗi xuất file CSV:", err);
    alert("Có lỗi khi tạo file CSV.");
  }
}

/* ================================================================== */
/* COMPONENT DÙNG LẠI                                                  */
/* ================================================================== */

// Thẻ chỉ số (KPI) có tiêu đề, giá trị, ghi chú và icon (icon là tùy chọn)
function StatCard({ label, value, sub, icon: Icon, iconCls = "", valueCls = "text-gray-900" }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${valueCls}`}>{value}</p>
        <div className="text-xs text-gray-400 mt-1">{sub}</div>
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconCls}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}

// Link nhỏ có mũi tên (dùng cho các thẻ và tiêu đề khối)
function ArrowLink({ href, children, cls = "text-emerald-600 hover:text-emerald-700" }: any) {
  return (
    <Link href={href} className={`text-xs font-medium hover:underline inline-flex items-center gap-1 ${cls}`}>
      {children} <ArrowRight className="w-3 h-3" />
    </Link>
  );
}

// Khối nội dung (card) có tiêu đề, mô tả, link bên phải và vùng nội dung
function Section({ title, icon: Icon, iconCls = "", desc, link, right, children }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            {Icon && <Icon className={`w-5 h-5 ${iconCls}`} />}
            {title}
          </h2>
          {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
        </div>
        {link && <ArrowLink href={link.href}>{link.label}</ArrowLink>}
        {right}
      </div>
      {children}
    </div>
  );
}

// Hộp dòng tiền (thực nhận / đang luân chuyển / thất thoát)
function CashBox({ label, value, note, icon: Icon, cls, textCls, iconCls }: any) {
  return (
    <div className={`p-4 border rounded-2xl flex items-center justify-between ${cls}`}>
      <div>
        <p className={`text-xs font-bold uppercase tracking-wider ${textCls}`}>{label}</p>
        <p className={`text-2xl font-black mt-1 ${textCls}`}>{fmt(value)}</p>
        <p className={`text-xs mt-1 ${textCls}`}>{note}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconCls}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

// Dòng thông tin một kênh thanh toán (COD / Online)
function PaymentRow({ icon: Icon, iconCls, title, desc, revenue, orders, ordersCls }: any) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconCls}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-base font-bold text-gray-900">{fmt(revenue)}</p>
        <p className={`text-xs font-medium ${ordersCls}`}>{orders} đơn hàng</p>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TRANG CHÍNH                                                         */
/* ================================================================== */

export default function SellerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Tải dữ liệu thống kê mỗi khi đổi khoảng thời gian
  useEffect(() => {
    setIsLoading(true);
    statisticService
      .getOverview(period)
      .then(setData)
      .catch((err) => console.error("Lỗi tải thống kê:", err))
      .finally(() => setIsLoading(false));
  }, [period]);

  // Màn hình chờ khi tải lần đầu
  if (isLoading && !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[450px] text-gray-500">
        <div className="w-9 h-9 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">Đang tổng hợp dữ liệu thống kê cửa hàng...</p>
      </div>
    );
  }

  // Lấy dữ liệu kèm giá trị mặc định để tránh lỗi khi API trả thiếu
  const {
    storeName = "Cửa hàng nông sản",
    totalRevenue = 0,
    totalOrders = 0,
    pendingOrders = 0,
    actionRequiredBatchesCount = 0,
    expiringBatchesCount = 0,
    expiredBatchesCount = 0,
    orderStatusFunnel = {},
    alerts = { expiringSoon: [], lowStock: [], expired: [] },
    revenueChart7Days = [],
    topProducts = [],
    cashFlow = { completedRevenue: 0, pendingRevenue: 0, cancelledRevenue: 0 },
    paymentSplit = { codOrders: 0, codRevenue: 0, onlineOrders: 0, onlineRevenue: 0 },
    slowMovingProducts = [],
    customerMetrics = { totalCustomers: 0, repeatCustomers: 0, repeatRate: 0, averageOrderValue: 0 },
    topCustomers = [],
    reviewMetrics = { averageRating: 5.0, totalReviews: 0, ratingBreakdown: {}, recentReviews: [] },
  } = data || {};

  // Doanh thu cao nhất trong 7 ngày (để tính chiều cao cột biểu đồ)
  const maxDayRevenue = Math.max(...revenueChart7Days.map((d: any) => d.revenue), 1);

  // Gộp 3 loại cảnh báo kho thành một danh sách để render một lần
  const alertList = [
    ...(alerts.expired || []).map((i: any) => ({
      ...i,
      cls: "bg-red-50 border-red-200",
      textCls: "text-red-600 font-medium",
      badgeCls: "text-red-700 bg-red-100",
      text: `❌ Đã quá hạn (HSD: ${fmtDate(i.expiryDate)}) — Cần tiêu hủy khỏi kho`,
      badge: `Tồn: ${i.quantity} ${i.unit}`,
    })),
    ...(alerts.expiringSoon || []).map((i: any) => ({
      ...i,
      cls: "bg-rose-50/70 border-rose-100",
      textCls: "text-rose-600",
      badgeCls: "text-rose-700 bg-rose-100/80",
      text: `⏳ Còn ${i.daysLeft} ngày là hết hạn (HSD: ${fmtDate(i.expiryDate)})`,
      badge: `Tồn: ${i.quantity} ${i.unit}`,
    })),
    ...(alerts.lowStock || []).map((i: any) => ({
      ...i,
      cls: "bg-amber-50/70 border-amber-100",
      textCls: "text-amber-700",
      badgeCls: "text-amber-800 bg-amber-100",
      text: "📦 Sắp hết hàng — Cần thu hoạch vụ mới gối đầu",
      badge: `Còn: ${i.quantity} ${i.unit}`,
    })),
  ];

  // Class chung cho nút chọn thời gian
  const periodBtn = (active: boolean) =>
    `px-3 py-1.5 rounded-lg font-medium transition-all ${
      active ? "bg-white text-emerald-700 shadow-sm font-bold" : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ===== THANH TIÊU ĐỀ + BỘ LỌC THỜI GIAN + NÚT XUẤT CSV ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Thống kê & Phân tích</h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {storeName}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-0.5">
            Báo cáo hiệu quả kinh doanh, dòng tiền và chăm sóc khách hàng
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Bộ chọn khoảng thời gian */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 text-xs">
            {PERIODS.map(([value, label]) => (
              <button key={value} onClick={() => setPeriod(value)} className={periodBtn(period === value)}>
                {label}
              </button>
            ))}
          </div>

          {/* Nút xuất báo cáo CSV */}
          <button
            onClick={() => exportOrdersCSV(data)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-200 active:scale-95"
            title="Xuất danh sách đơn hàng sang file CSV (mở bằng Excel)"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất Excel / CSV
          </button>
        </div>
      </div>

      {/* ===== THANH ĐIỀU HƯỚNG TAB ===== */}
      <div className="flex border-b border-gray-200 bg-white px-4 rounded-xl shadow-sm gap-2">
        {TABS.map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 py-3.5 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === key
                ? "border-emerald-600 text-emerald-600 bg-emerald-50/50 rounded-t-lg"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: TỔNG QUAN & QUẢN TRỊ KHO                               */}
      {/* ============================================================ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 4 thẻ KPI chính */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Doanh thu thực tế"
              value={fmt(totalRevenue)}
              sub="Đơn hoàn thành"
              icon={DollarSign}
              iconCls="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              label="Tổng đơn hàng"
              value={totalOrders}
              sub="Không tính đơn hủy"
              icon={ShoppingBag}
              iconCls="bg-blue-50 text-blue-600"
            />
            <StatCard
              label="Đơn chờ duyệt"
              value={pendingOrders}
              valueCls="text-amber-600"
              sub={<ArrowLink href="/seller/orders" cls="text-amber-600">Xử lý ngay</ArrowLink>}
              icon={Clock}
              iconCls="bg-amber-50 text-amber-600"
            />
            <StatCard
              label="Lô cần xử lý"
              value={actionRequiredBatchesCount}
              valueCls="text-rose-600"
              sub={
                <ArrowLink href="/seller/batches" cls="text-rose-600">
                  {expiredBatchesCount > 0 ? `${expiredBatchesCount} hết hạn ` : ""}
                  {expiringBatchesCount > 0 ? `${expiringBatchesCount} cận date` : "Kho an toàn"}
                </ArrowLink>
              }
              icon={AlertTriangle}
              iconCls="bg-rose-50 text-rose-600"
            />
          </div>

          {/* Tiến độ đơn hàng + Cảnh báo kho */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tiến độ xử lý đơn hàng */}
            <Section title="Tiến độ Xử lý Đơn hàng" link={{ href: "/seller/orders", label: "Xem tất cả" }}>
              <div className="space-y-3">
                {FUNNEL.map(([key, label, Icon, wrapCls, iconCls, numCls]) => (
                  <div key={key} className={`flex items-center justify-between p-3 rounded-xl border ${wrapCls}`}>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${iconCls}`} />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </div>
                    <span className={`text-base font-bold ${numCls}`}>{orderStatusFunnel[key] ?? 0} đơn</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Cảnh báo kho nông sản */}
            <Section title="Cảnh báo Kho Nông sản" link={{ href: "/seller/batches", label: "Quản lý Lô" }}>
              <div className="space-y-2.5 overflow-y-auto max-h-[300px]">
                {alertList.length === 0 ? (
                  // Trạng thái an toàn: không có cảnh báo nào
                  <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Kho hàng đang rất an toàn!</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Không có lô hàng nào hết hạn, cận date hoặc sắp hết tồn kho.
                    </p>
                  </div>
                ) : (
                  alertList.map((item: any, idx: number) => (
                    <div key={idx} className={`p-3 border rounded-xl flex items-center justify-between ${item.cls}`}>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.productName}</p>
                        <p className={`text-xs mt-0.5 ${item.textCls}`}>{item.text}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${item.badgeCls}`}>
                        {item.badge}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Section>
          </div>

          {/* Biểu đồ doanh thu 7 ngày */}
          <Section
            title="Biểu đồ Doanh thu"
            icon={TrendingUp}
            iconCls="text-emerald-600"
            desc="Doanh thu thực tế theo từng ngày của các đơn hàng đã hoàn tất"
            right={
              <div className="text-xs text-gray-500 font-medium">
                Cao nhất:{" "}
                <span className="font-bold text-emerald-600">{maxDayRevenue > 1 ? fmt(maxDayRevenue) : "0đ"}</span>
              </div>
            }
          >
            <div className="pt-6 pb-2 overflow-x-auto">
              {/* Các cột biểu đồ */}
              <div className="h-56 min-w-[500px] flex items-end justify-between gap-2 sm:gap-6 border-b border-gray-100 pb-2">
                {revenueChart7Days.map((item: any, idx: number) => {
                  // Chiều cao cột theo %, tối thiểu 8% nếu có doanh thu, 4% nếu không
                  const height =
                    item.revenue > 0 ? Math.max(Math.round((item.revenue / maxDayRevenue) * 100), 8) : 4;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      {/* Tooltip khi rê chuột */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg pointer-events-none whitespace-nowrap shadow-lg z-10">
                        <p>{item.date} ({item.dayName}): {fmt(item.revenue)}</p>
                        <p className="text-[10px] text-gray-300 font-normal">{item.ordersCount} đơn thành công</p>
                      </div>

                      {/* Nhãn giá trị phía trên cột (đơn vị nghìn) */}
                      {item.revenue > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          {(item.revenue / 1000).toFixed(0)}k
                        </span>
                      )}

                      <div
                        style={{ height: `${height}%` }}
                        className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                          item.revenue > 0
                            ? "bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-700 group-hover:to-emerald-500 shadow-sm"
                            : "bg-gray-100"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Nhãn ngày bên dưới trục */}
              <div className="flex items-center min-w-[500px] justify-between gap-2 sm:gap-6 pt-3">
                {revenueChart7Days.map((item: any, idx: number) => (
                  <div key={idx} className="flex-1 text-center">
                    <p className="text-xs font-bold text-gray-700">{item.dayName}</p>
                    <p className="text-[10px] text-gray-400">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: NÔNG SẢN & DÒNG TIỀN                                   */}
      {/* ============================================================ */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Top 5 nông sản bán chạy */}
          <Section
            title="Top 5 Nông Sản Bán Chạy Nhất"
            icon={Sparkles}
            iconCls="text-amber-500"
            desc="Xếp hạng theo sản lượng bán ra thực tế của các đơn giao thành công"
            link={{ href: "/seller/products", label: "Quản lý Nông sản" }}
          >
            {topProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-medium">Chưa có dữ liệu bán hàng cho kỳ này.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Hạng</th>
                      <th className="py-3 px-3">Sản phẩm</th>
                      <th className="py-3 px-3 text-right">Đã bán</th>
                      <th className="py-3 px-3 text-right">Doanh thu thu về</th>
                      <th className="py-3 px-3 text-right">Tồn kho hiện tại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topProducts.map((p: any, idx: number) => (
                      <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                        {/* Màu huy hiệu theo thứ hạng: vàng, bạc, đồng, còn lại */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                              ["bg-amber-100 text-amber-800", "bg-gray-200 text-gray-700", "bg-amber-50 text-amber-700"][idx] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-gray-900">{p.name}</td>
                        <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                          {p.totalSold} {p.unit}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-gray-800">{fmt(p.revenue)}</td>
                        <td className="py-3.5 px-3 text-right text-xs">
                          {/* Tồn kho <= 10 hiển thị màu cảnh báo */}
                          <span
                            className={`px-2 py-0.5 rounded-md font-medium ${
                              p.stock > 10 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {p.stock} {p.unit}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Báo cáo dòng tiền & hình thức thanh toán */}
          <Section
            title="Báo cáo Dòng tiền & Hình thức Thanh toán"
            icon={CreditCard}
            iconCls="text-emerald-600"
            desc="Theo dõi trạng thái dòng tiền thực nhận, tiền đang giao và phân bổ thanh toán COD / Online"
            right={
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 shrink-0">
                Tài chính cửa hàng
              </span>
            }
          >
            {/* 3 hộp trạng thái dòng tiền */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <CashBox
                label="Tiền thực nhận"
                value={cashFlow.completedRevenue}
                note="✓ Đơn hàng đã giao thành công"
                icon={DollarSign}
                cls="bg-emerald-50/70 border-emerald-200/80"
                textCls="text-emerald-700"
                iconCls="bg-emerald-100 text-emerald-700"
              />
              <CashBox
                label="Tiền đang luân chuyển"
                value={cashFlow.pendingRevenue}
                note="⏳ Đang chờ xác nhận, đóng gói & giao"
                icon={Clock}
                cls="bg-blue-50/70 border-blue-200/80"
                textCls="text-blue-700"
                iconCls="bg-blue-100 text-blue-700"
              />
              <CashBox
                label="Doanh thu thất thoát"
                value={cashFlow.cancelledRevenue}
                note="✕ Đơn hàng đã bị hủy"
                icon={XCircle}
                cls="bg-rose-50/70 border-rose-200/80"
                textCls="text-rose-600"
                iconCls="bg-rose-100 text-rose-600"
              />
            </div>

            {/* Phân loại 2 hình thức thanh toán: COD và Online */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <PaymentRow
                icon={Truck}
                iconCls="bg-emerald-100 text-emerald-700"
                title="Tiền mặt khi nhận hàng (COD)"
                desc="Cần đối soát tiền thu hộ với bưu cục giao vận"
                revenue={paymentSplit.codRevenue}
                orders={paymentSplit.codOrders}
                ordersCls="text-emerald-700"
              />
              <PaymentRow
                icon={CreditCard}
                iconCls="bg-blue-100 text-blue-700"
                title="Chuyển khoản trực tuyến (VNPay / Ví)"
                desc="Tiền đã chuyển trực tiếp vào tài khoản cổng thanh toán"
                revenue={paymentSplit.onlineRevenue}
                orders={paymentSplit.onlineOrders}
                ordersCls="text-blue-700"
              />
            </div>
          </Section>

          {/* Cảnh báo nông sản bán chậm / tồn đọng */}
          <Section
            title="Cảnh báo Nông sản Bán chậm / Tồn đọng"
            icon={AlertCircle}
            iconCls="text-amber-500"
            desc="Các sản phẩm vẫn còn tồn kho nhưng chưa phát sinh đơn bán nào trong kỳ chọn — Shop nên chạy Flash Sale hoặc tạo Combo ưu đãi"
          >
            {slowMovingProducts.length === 0 ? (
              <p className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 font-medium">
                Tuyệt vời! Không có mặt hàng nào bị đóng băng tồn kho.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {slowMovingProducts.map((p: any) => (
                  <div key={p.id} className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl">
                    <p className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</p>
                    <p className="text-[11px] text-amber-700 mt-1">
                      Tồn kho: <span className="font-bold">{p.stock} {p.unit}</span>
                    </p>
                    <span className="mt-2 inline-block text-[10px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                      Chưa có đơn bán
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: KHÁCH HÀNG & ĐÁNH GIÁ                                  */}
      {/* ============================================================ */}
      {activeTab === "customers" && (
        <div className="space-y-6">
          {/* 3 thẻ chỉ số khách hàng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              label="Tổng khách hàng đã mua"
              value={`${customerMetrics.totalCustomers} người`}
              sub="Người tiêu dùng ủng hộ nông sản shop"
            />
            <StatCard
              label="Tỷ lệ quay lại mua lần 2+"
              value={`${customerMetrics.repeatRate}%`}
              valueCls="text-emerald-600"
              sub={<span className="text-emerald-700 font-medium">{customerMetrics.repeatCustomers} khách hàng thân thiết</span>}
            />
            <StatCard
              label="Giá trị trung bình đơn (AOV)"
              value={fmt(customerMetrics.averageOrderValue)}
              valueCls="text-blue-600"
              sub="Doanh thu trung bình trên mỗi đơn"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 khách hàng VIP */}
            <Section
              title="Top 5 Khách Hàng Thân Thiết (VIP)"
              icon={Users}
              iconCls="text-emerald-600"
              desc="Những khách hàng mua nhiều đơn và có mức chi tiêu lớn nhất cho cửa hàng"
            >
              {topCustomers.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center">Chưa có dữ liệu khách hàng</p>
              ) : (
                <div className="space-y-3">
                  {topCustomers.map((c: any, idx: number) => (
                    <div
                      key={c.userId}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{c.fullName}</p>
                          <p className="text-[11px] text-gray-500">
                            {c.phone || c.email} • {c.ordersCount} đơn đã mua
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-700">{fmt(c.totalSpent)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Điểm đánh giá & phân bố sao */}
            <Section
              title="Đánh giá Chất lượng Nông sản"
              icon={Star}
              iconCls="text-amber-500 fill-amber-500"
              desc="Mức độ hài lòng của khách hàng đối với các sản phẩm của shop"
            >
              <div className="flex items-center gap-6 mb-5 pb-4 border-b border-gray-100">
                {/* Điểm trung bình + số sao */}
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-amber-500">{reviewMetrics.averageRating}</p>
                  <div className="flex justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(reviewMetrics.averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{reviewMetrics.totalReviews} lượt đánh giá</p>
                </div>

                {/* Thanh phân bố từ 5 sao đến 1 sao */}
                <div className="flex-1 space-y-1.5 text-xs">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewMetrics.ratingBreakdown?.[star] || 0;
                    const percent =
                      reviewMetrics.totalReviews > 0 ? Math.round((count / reviewMetrics.totalReviews) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-7 text-gray-600 font-semibold">{star} ★</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-6 text-right text-gray-400 text-[11px]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3 nhận xét mới nhất */}
              <p className="text-xs font-bold text-gray-700 uppercase mb-2">Nhận xét mới nhất:</p>
              {reviewMetrics.recentReviews.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Chưa có bình luận nào</p>
              ) : (
                <div className="space-y-2">
                  {reviewMetrics.recentReviews.slice(0, 3).map((r: any) => (
                    <div key={r.id} className="p-2.5 bg-gray-50 rounded-xl text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-800">{r.customerName}</span>
                        <span className="text-[10px] text-amber-600 font-bold">
                          {r.rating} ★ ({r.productName})
                        </span>
                      </div>
                      <p className="text-gray-600 italic">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}