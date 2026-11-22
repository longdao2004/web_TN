"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Download,
} from "lucide-react";
import { statisticService } from "@/services/statistic.service";

/* ================================================================== */
/* HẰNG SỐ CẤU HÌNH & BẢN ĐỒ DỮ LIỆU                                  */
/* ================================================================== */

// Các lựa chọn khoảng thời gian thống kê
const PERIODS = [
  ["all", "Toàn thời gian"],
  ["7d", "7 ngày qua"],
  ["30d", "30 ngày qua"],
  ["month", "Tháng này"],
] as const;

// Các trạng thái đơn hàng: [key, nhãn, icon, class khung, class icon, class số]
const FUNNEL = [
  ["pending", "Chờ xác nhận", Clock, "bg-amber-50/60 border-amber-100", "text-amber-600", "text-amber-700"],
  ["packing", "Đang đóng gói", Package, "bg-indigo-50/60 border-indigo-100", "text-indigo-600", "text-indigo-700"],
  ["shipping", "Đang giao hàng", Truck, "bg-blue-50/60 border-blue-100", "text-blue-600", "text-blue-700"],
  ["completed", "Giao thành công", CheckCircle, "bg-emerald-50/60 border-emerald-100", "text-emerald-600", "text-emerald-700"],
  ["cancelled", "Đã hủy", XCircle, "bg-gray-50 border-gray-200/70", "text-gray-400", "text-gray-600"],
] as const;

// Map trạng thái đơn hàng sang tiếng Việt khi xuất file CSV đối soát
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

// Định dạng tiền tệ VNĐ: 1.000.000đ
const fmt = (n: number) => (n || 0).toLocaleString("vi-VN") + "đ";

// Định dạng ngày theo định dạng Việt Nam (DD/MM/YYYY)
const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");

// Xuất danh sách đơn hàng đối soát ra CSV (có UTF-8 BOM \uFEFF chống lỗi font tiếng Việt trong Excel)
function exportOrdersCSV(data: any) {
  const orders = data?.recentOrdersForExport;
  if (!orders?.length) {
    alert("Chưa có dữ liệu đơn hàng để xuất báo cáo!");
    return;
  }

  try {
    const headers = [
      "Mã đơn hàng",
      "Ngày đặt hàng",
      "Tên khách hàng",
      "Số điện thoại",
      "Số món",
      "Tổng tiền (VNĐ)",
      "Thanh toán",
      "Trạng thái",
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

    // \uFEFF = BOM giúp Microsoft Excel nhận diện đúng bảng mã UTF-8 tiếng Việt
    const csv = "\uFEFF" + [headers, ...rows].map((r: any) => r.join(",")).join("\r\n");

    const shop = (data?.storeName || "Nong_San").replace(/[^a-zA-Z0-9]/g, "_");
    const day = new Date().toISOString().split("T")[0];

    // Tạo link tải file ảo
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
/* CÁC THÀNH PHẦN GIAO DIỆN CON (REUSABLE COMPONENTS)                 */
/* ================================================================== */

// Thẻ hiển thị chỉ số quan trọng (KPI Card)
function StatCard({ label, value, sub, icon: Icon, iconCls = "", valueCls = "text-gray-900" }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${valueCls}`}>{value}</p>
        <div className="text-xs text-gray-400 mt-1">{sub}</div>
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconCls}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}

// Đường dẫn nhanh có icon mũi tên điều hướng
function ArrowLink({ href, children, cls = "text-emerald-600 hover:text-emerald-700" }: any) {
  return (
    <Link href={href} className={`text-xs font-medium hover:underline inline-flex items-center gap-1 ${cls}`}>
      {children} <ArrowRight className="w-3 h-3" />
    </Link>
  );
}

// Khung chứa nội dung tiêu chuẩn (Section Card)
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

/* ================================================================== */
/* MÀN HÌNH DASHBOARD DUY NHẤT DÀNH CHO NGƯỜI BÁN (SELLER DASHBOARD)  */
/* ================================================================== */

export default function SellerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<string>("all");

  // Nạp dữ liệu thống kê từ Backend theo khoảng thời gian đã chọn
  useEffect(() => {
    setIsLoading(true);
    statisticService
      .getOverview(period)
      .then(setData)
      .catch((err) => console.error("Lỗi tải thống kê:", err))
      .finally(() => setIsLoading(false));
  }, [period]);

  // Giao diện tải dữ liệu ban đầu
  if (isLoading && !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[450px] text-gray-500">
        <div className="w-9 h-9 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">Đang tổng hợp dữ liệu thống kê cửa hàng...</p>
      </div>
    );
  }

  // Bóc tách dữ liệu thống kê từ API
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
  } = data || {};

  // Doanh thu lớn nhất trong 7 ngày để tính chiều cao tỷ lệ % cho cột biểu đồ
  const maxDayRevenue = Math.max(...revenueChart7Days.map((d: any) => d.revenue), 1);

  // Tổng hợp danh sách cảnh báo kho nông sản (quá hạn, cận date, tồn thấp)
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

  // Kiểu dáng của nút chọn khoảng thời gian
  const periodBtn = (active: boolean) =>
    `px-3 py-1.5 rounded-lg font-medium transition-all ${
      active ? "bg-white text-emerald-700 shadow-sm font-bold" : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ============================================================ */}
      {/* 1. THANH TIÊU ĐỀ + BỘ LỌC THỜI GIAN + NÚT XUẤT FILE EXCEL    */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Thống kê & Phân tích</h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {storeName}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-0.5">
            Báo cáo hiệu quả kinh doanh, tiến độ xử lý đơn hàng và cảnh báo kho nông sản
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Bộ lọc khoảng thời gian thống kê */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 text-xs">
            {PERIODS.map(([value, label]) => (
              <button key={value} onClick={() => setPeriod(value)} className={periodBtn(period === value)}>
                {label}
              </button>
            ))}
          </div>

          {/* Nút xuất báo cáo Excel đối soát đơn hàng */}
          <button
            onClick={() => exportOrdersCSV(data)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-200 active:scale-95 cursor-pointer"
            title="Xuất danh sách đơn hàng sang file CSV (mở chuẩn tiếng Việt bằng Excel)"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất Excel / CSV
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. BỐN THẺ CHỈ SỐ KPI CỐT LÕI CỦA CỬA HÀNG                   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Doanh thu thực tế"
          value={fmt(totalRevenue)}
          sub="Từ các đơn hoàn thành"
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

      {/* ============================================================ */}
      {/* 3. TIẾN ĐỘ ĐƠN HÀNG VÀ CẢNH BÁO KHO NÔNG SẢN ĐẶC THÙ         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Khối 1: Tiến độ xử lý đơn hàng theo phễu trạng thái */}
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

        {/* Khối 2: Cảnh báo kho nông sản (Lô hết hạn, Cận date <= 7 ngày, Sắp hết tồn kho) */}
        <Section title="Cảnh báo Kho Nông sản" link={{ href: "/seller/batches", label: "Quản lý Lô" }}>
          <div className="space-y-2.5 overflow-y-auto max-h-[300px]">
            {alertList.length === 0 ? (
              // Trạng thái an toàn: không có lô hàng nào cần cảnh báo
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

      {/* ============================================================ */}
      {/* 4. BIỂU ĐỒ DOANH THU 7 NGÀY GẦN NHẤT                         */}
      {/* ============================================================ */}
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
        {/* Khoảng đệm pt-14 (56px) tạo không gian thoáng, không bị che khuất Tooltip khi hover */}
        <div className="pt-14 pb-2 overflow-x-auto">
          {/* Các cột biểu đồ */}
          <div className="h-56 min-w-[500px] flex items-end justify-between gap-2 sm:gap-6 border-b border-gray-100 pb-2">
            {revenueChart7Days.map((item: any, idx: number) => {
              // Chiều cao cột theo %, tối thiểu 8% nếu có doanh thu, 4% nếu bằng 0
              const height =
                item.revenue > 0 ? Math.max(Math.round((item.revenue / maxDayRevenue) * 100), 8) : 4;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip hiển thị đầy đủ ngày tháng, doanh thu nổi bật và mũi tên trỏ xuống cột */}
                  {/* Sử dụng filter drop-shadow-md để bóng ôm sát viền thực tế của cả hộp lẫn mũi tên */}
                  <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 flex flex-col items-center whitespace-nowrap filter drop-shadow-md">
                    <div className="bg-gray-900 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg flex flex-col items-center text-center">
                      <p className="font-bold text-emerald-400">{item.date} ({item.dayName}): {fmt(item.revenue)}</p>
                      <p className="text-[10px] text-gray-300 font-normal mt-0.5">{item.ordersCount} đơn thành công</p>
                    </div>
                    {/* Mũi tên tam giác hướng xuống đầu cột, overlap -mt-px để liền khối hoàn hảo */}
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-gray-900 -mt-px" />
                  </div>

                  {/* Nhãn giá trị phía trên cột (đơn vị nghìn) */}
                  {item.revenue > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      {(item.revenue / 1000).toFixed(0)}k
                    </span>
                  )}

                  {/* Thanh cột doanh thu */}
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

          {/* Nhãn ngày bên dưới trục hoành */}
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
  );
}
