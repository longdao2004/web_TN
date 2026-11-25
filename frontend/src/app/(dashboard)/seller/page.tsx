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
import { storeService } from "@/services/store.service";
import { productService } from "@/services/product.service";
import { formatOrderCode, formatBatchCode, formatProductCode } from "@/utils/order";
import { ExportDropdown } from "@/components/common/ExportDropdown";
import {
  exportWarehouseDocx,
  exportOrdersDocx,
  exportProductsDocx,
} from "@/utils/docxExport";

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
  [
    "pending",
    "Chờ xác nhận",
    Clock,
    "bg-amber-50/60 border-amber-100",
    "text-amber-600",
    "text-amber-700",
  ],
  [
    "packing",
    "Đang đóng gói",
    Package,
    "bg-indigo-50/60 border-indigo-100",
    "text-indigo-600",
    "text-indigo-700",
  ],
  [
    "shipping",
    "Đang giao hàng",
    Truck,
    "bg-blue-50/60 border-blue-100",
    "text-blue-600",
    "text-blue-700",
  ],
  [
    "completed",
    "Giao thành công",
    CheckCircle,
    "bg-emerald-50/60 border-emerald-100",
    "text-emerald-600",
    "text-emerald-700",
  ],
  [
    "cancelled",
    "Đã hủy",
    XCircle,
    "bg-gray-50 border-gray-200/70",
    "text-gray-400",
    "text-gray-600",
  ],
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
      `"${formatOrderCode(o.id, o.createdAt)}"`,
      `"${new Date(o.createdAt).toLocaleString("vi-VN")}"`,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      o.itemsCount,
      o.totalAmount,
      `"${o.paymentMethod}"`,
      `"${STATUS_MAP[o.status] || o.status}"`,
    ]);

    // \uFEFF = BOM giúp Microsoft Excel nhận diện đúng bảng mã UTF-8 tiếng Việt
    const csv =
      "\uFEFF" + [headers, ...rows].map((r: any) => r.join(",")).join("\r\n");

    const shop = (data?.storeName || "Nong_San").replace(/[^a-zA-Z0-9]/g, "_");
    const day = new Date().toISOString().split("T")[0];

    // Tạo link tải file ảo
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    link.download = `Bao_cao_don_hang_${shop}_${day}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Lỗi xuất file CSV:", err);
    alert("Có lỗi khi tạo file CSV.");
  }
}

// Hàm hỗ trợ bọc chuỗi an toàn cho file CSV (tránh lỗi tách cột khi có dấu phẩy hoặc ngoặc kép)
const escCSV = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;

// Bản đồ dịch tiêu chuẩn bảo quản logistics sang tiếng Việt
const LOGISTICS_MAP: Record<string, string> = {
  ULTRA_FRESH: "Siêu tươi ngắn ngày (Rau lá / Tươi sống)",
  CHILLED: "Bảo quản mát (2°C - 8°C)",
  DRY_STABLE: "Hàng khô / Bảo quản thường",
};

// Xuất danh mục sản phẩm & tồn kho ra CSV (có UTF-8 BOM \uFEFF)
function exportProductsCSV(products: any[], storeName: string) {
  if (!products || products.length === 0) {
    alert("Chưa có sản phẩm nào để xuất báo cáo!");
    return;
  }

  try {
    const todayStr = new Date().toLocaleDateString("vi-VN");

    // Tính toán các chỉ số tổng quan ở đầu file báo cáo
    const totalSKU = products.length;
    const activeCount = products.filter(
      (p) => !p.isExpired && p.stock > 0,
    ).length;
    const outOfStockCount = products.filter(
      (p) => !p.isExpired && p.stock <= 0,
    ).length;
    const expiredCount = products.filter((p) => p.isExpired).length;
    const certifiedCount = products.filter(
      (p) => p.certificates?.length > 0,
    ).length;
    const totalInventoryValue = products.reduce(
      (sum: number, p: any) => sum + (p.stock || 0) * (p.price || 0),
      0,
    );

    // Phần 1: Bảng tóm tắt tổng quan danh mục nông sản
    const summaryLines = [
      [escCSV("BÁO CÁO QUẢN LÝ DANH MỤC SẢN PHẨM NÔNG SẢN")],
      [escCSV(`Cửa hàng: ${storeName}`), escCSV(`Ngày xuất: ${todayStr}`)],
      [
        escCSV(`Tổng số mã sản phẩm: ${totalSKU}`),
        escCSV(`Đang mở bán: ${activeCount}`),
        escCSV(`Hết hàng: ${outOfStockCount}`),
        escCSV(`Hết date toàn bộ: ${expiredCount}`),
      ],
      [
        escCSV(
          `Sản phẩm có chứng nhận (VietGAP/OCOP): ${certifiedCount}/${totalSKU}`,
        ),
        escCSV(
          `Tổng giá trị tồn kho khả dụng: ${totalInventoryValue.toLocaleString("vi-VN")} VNĐ`,
        ),
      ],
      [], // Dòng trống ngăn cách
    ];

    // Phần 2: Tiêu đề các cột chi tiết
    const headers = [
      "Mã SP",
      "Tên Nông sản",
      "Danh mục",
      "Đơn vị tính",
      "Giá bán (VNĐ)",
      "Giá gốc niêm yết (VNĐ)",
      "Sản lượng đã bán",
      "Tồn kho khả dụng",
      "Tiêu chuẩn bảo quản",
      "Xuất xứ / Vùng trồng",
      "Chứng nhận chất lượng",
      "Đánh giá (CSAT)",
      "Phân loại & Khuyến nghị kinh doanh",
    ];

    // Duyệt từng sản phẩm để tạo dòng dữ liệu tương ứng
    const rows = products.map((p: any) => {
      const certNames =
        p.certificates && p.certificates.length > 0
          ? p.certificates.map((c: any) => c.name).join("; ")
          : "Chưa có chứng nhận";

      let statusAdvice = "Kinh doanh ổn định";
      if (p.isExpired) {
        statusAdvice = "HẾT DATE TOÀN BỘ - Cần dọn kho & nhập đợt mới";
      } else if (p.stock <= 0) {
        statusAdvice = "CHÁY HÀNG - Cần thu hoạch vụ mới gối đầu";
      } else if (p.stock <= 10) {
        statusAdvice = "SẮP HẾT HÀNG - Chuẩn bị nhập thêm";
      } else if ((p.soldCount || 0) >= 20) {
        statusAdvice = "BÁN CHẠY - Ưu tiên giữ nguồn cung ổn định";
      } else if ((p.soldCount || 0) === 0) {
        statusAdvice = "BÁN CHẬM - Nên tạo Combo hoặc khuyến mãi kích cầu";
      }

      const ratingText = `${p.rating || 5} sao (${p.reviewCount || 0} lượt)`;

      return [
        escCSV(formatProductCode(p.name, p.id)),
        escCSV(p.name),
        escCSV(p.category || "Chưa phân loại"),
        escCSV(p.unit || "kg"),
        p.price || 0,
        p.originalPrice || p.price || 0,
        p.soldCount || 0,
        p.stock || 0,
        escCSV(LOGISTICS_MAP[p.logisticsTier] || "Bảo quản thường"),
        escCSV(p.province || "Chưa cập nhật"),
        escCSV(certNames),
        escCSV(ratingText),
        escCSV(statusAdvice),
      ];
    });

    const csvContent =
      "\uFEFF" +
      [
        ...summaryLines.map((line) => line.join(",")),
        headers.map(escCSV).join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const cleanShop = storeName.replace(/[^a-zA-Z0-9]/g, "_");
    const fileDate = new Date().toISOString().split("T")[0];
    link.href = url;
    link.setAttribute(
      "download",
      `Bao_cao_san_pham_${cleanShop}_${fileDate}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Lỗi khi xuất Excel sản phẩm:", error);
    alert("Có lỗi xảy ra khi xuất file báo cáo sản phẩm!");
  }
}

// Xuất danh sách kiểm kê lô hàng & hạn dùng ra CSV (Chuẩn FEFO, có UTF-8 BOM \uFEFF)
function exportBatchesCSV(batches: any[], storeName: string) {
  if (!batches || batches.length === 0) {
    alert("Chưa có dữ liệu lô hàng để xuất báo cáo!");
    return;
  }

  const today = new Date();

  // Tính toán thông tin chi tiết ngày hết hạn và rủi ro cho từng lô
  const enrichedBatches = batches.map((b: any) => {
    const expDate = new Date(b.expiryDate);
    const diffMs = expDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const stock = b.quantity || 0;
    const price = b.price || 0;
    const totalValue = stock * price;

    let riskLevel = "AN TOÀN";
    let actionPlan = "Bảo quản đúng quy chuẩn, xuất kho theo thứ tự FEFO";

    if (stock <= 0) {
      riskLevel = "ĐÃ HẾT TỒN KHO";
      actionPlan = "Đã bán hết - Lưu lịch sử truy xuất";
    } else if (expDate.getTime() < today.getTime()) {
      riskLevel = "ĐÃ QUÁ HẠN SỬ DỤNG";
      actionPlan =
        "Tiêu hủy ngay khỏi kho lạnh (Tránh lây nấm mốc) & Lập biên bản hao hụt";
    } else if (daysLeft <= 7) {
      riskLevel = "CẬN DATE (<= 7 NGÀY)";
      actionPlan =
        "Chạy Flash Sale giảm giá 30%-50% / Ưu tiên xuất giao trước (FEFO)";
    }

    return {
      ...b,
      daysLeft,
      stock,
      price,
      totalValue,
      isExpired: stock > 0 && expDate.getTime() < today.getTime(),
      isExpiringSoon:
        stock > 0 && expDate.getTime() >= today.getTime() && daysLeft <= 7,
      riskLevel,
      actionPlan,
    };
  });

  try {
    const expiredList = enrichedBatches.filter((b) => b.isExpired);
    const expiringSoonList = enrichedBatches.filter((b) => b.isExpiringSoon);
    const expiredLossValue = expiredList.reduce(
      (sum: number, b: any) => sum + b.totalValue,
      0,
    );
    const expiringRiskValue = expiringSoonList.reduce(
      (sum: number, b: any) => sum + b.totalValue,
      0,
    );

    const summaryLines = [
      [escCSV("BÁO CÁO KIỂM KÊ TOÀN BỘ LÔ HÀNG & HẠN SỬ DỤNG")],
      [
        escCSV(`Cửa hàng: ${storeName}`),
        escCSV(`Ngày lập báo cáo: ${today.toLocaleDateString("vi-VN")}`),
      ],
      [
        escCSV(`Lô đã quá hạn (Cần tiêu hủy): ${expiredList.length} lô`),
        escCSV(
          `Thiệt hại ước tính: ${expiredLossValue.toLocaleString("vi-VN")} VNĐ`,
        ),
      ],
      [
        escCSV(
          `Lô cận date <= 7 ngày (Cần xả hàng gấp): ${expiringSoonList.length} lô`,
        ),
        escCSV(
          `Giá trị tiền kẹt cần cứu vãn: ${expiringRiskValue.toLocaleString("vi-VN")} VNĐ`,
        ),
      ],
      [], // Dòng trống ngăn cách
    ];

    const headers = [
      "Mã lô hàng",
      "Tên nông sản",
      "Ngày thu hoạch",
      "Hạn sử dụng (HSD)",
      "Số ngày còn lại",
      "Tồn kho lô",
      "Đơn vị tính",
      "Giá bán lô (VNĐ)",
      "Giá trị hàng tồn (VNĐ)",
      "Phân loại chất lượng",
      "Hành động thực tế khuyến nghị",
    ];

    const rows = enrichedBatches.map((b: any) => [
      escCSV(formatBatchCode(b.productName, b.harvestDate, b.id)),
      escCSV(b.productName),
      escCSV(new Date(b.harvestDate).toLocaleDateString("vi-VN")),
      escCSV(new Date(b.expiryDate).toLocaleDateString("vi-VN")),
      escCSV(
        b.daysLeft < 0
          ? `Quá hạn ${Math.abs(b.daysLeft)} ngày`
          : `Còn ${b.daysLeft} ngày`,
      ),
      b.stock,
      escCSV(b.unit),
      b.price,
      b.totalValue,
      escCSV(b.riskLevel),
      escCSV(b.actionPlan),
    ]);

    const csvContent =
      "\uFEFF" +
      [
        ...summaryLines.map((line) => line.join(",")),
        headers.map(escCSV).join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const cleanShop = storeName.replace(/[^a-zA-Z0-9]/g, "_");
    const fileDate = today.toISOString().split("T")[0];

    link.href = url;
    link.setAttribute(
      "download",
      `Bao_cao_lo_hang_${cleanShop}_${fileDate}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Lỗi khi xuất Excel lô hàng:", error);
    alert("Có lỗi xảy ra khi xuất file báo cáo lô hàng!");
  }
}

/* ================================================================== */
/* CÁC THÀNH PHẦN GIAO DIỆN CON (REUSABLE COMPONENTS)                 */
/* ================================================================== */

// Thẻ hiển thị chỉ số quan trọng (KPI Card)
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconCls = "",
  valueCls = "text-gray-900",
}: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className={`text-2xl font-bold mt-1 ${valueCls}`}>{value}</p>
        <div className="text-xs text-gray-400 mt-1">{sub}</div>
      </div>
      {Icon && (
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconCls}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}

// Đường dẫn nhanh có icon mũi tên điều hướng
function ArrowLink({
  href,
  children,
  cls = "text-emerald-600 hover:text-emerald-700",
}: any) {
  return (
    <Link
      href={href}
      className={`text-xs font-medium hover:underline inline-flex items-center gap-1 ${cls}`}
    >
      {children} <ArrowRight className="w-3 h-3" />
    </Link>
  );
}

// Khung chứa nội dung tiêu chuẩn (Section Card)
function Section({
  title,
  icon: Icon,
  iconCls = "",
  desc,
  link,
  right,
  children,
}: any) {
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

  // Trạng thái tải dữ liệu khi bấm nút xuất file
  const [isExportingProducts, setIsExportingProducts] = useState(false);
  const [isExportingBatches, setIsExportingBatches] = useState(false);
  // Bộ nhớ đệm danh sách sản phẩm và lô hàng để tránh gọi lại API nhiều lần
  const [cachedProducts, setCachedProducts] = useState<any[] | null>(null);

  // Hàm tải dữ liệu sản phẩm (kèm các lô hàng) của gian hàng
  const loadStoreProducts = async () => {
    if (cachedProducts) return cachedProducts;
    const store = await storeService.getMyStore();
    if (!store?.id) throw new Error("Không tìm thấy thông tin cửa hàng");
    const prods = await productService.getProducts({ storeId: store.id });
    setCachedProducts(prods);
    return prods;
  };

  // 1. Xử lý xuất file Danh mục sản phẩm & Tồn kho
  const handleExportProducts = async () => {
    try {
      setIsExportingProducts(true);
      const prods = await loadStoreProducts();
      const shop = storeName || "Nong_San";
      exportProductsCSV(prods, shop);
    } catch (err: any) {
      console.error("Lỗi xuất file sản phẩm:", err);
      alert("Không thể tải danh sách sản phẩm để xuất báo cáo!");
    } finally {
      setIsExportingProducts(false);
    }
  };

  // 2. Xử lý xuất file Kiểm kê lô hàng & Hạn dùng (Chuẩn FEFO)
  const handleExportBatches = async () => {
    try {
      setIsExportingBatches(true);
      const prods = await loadStoreProducts();

      // Gom toàn bộ lô hàng từ các sản phẩm của cửa hàng
      const allBatches: any[] = [];
      prods.forEach((p: any) => {
        if (p.batches && p.batches.length > 0) {
          p.batches.forEach((b: any) => {
            allBatches.push({
              ...b,
              productName: p.name,
              unit: p.unit || "kg",
            });
          });
        }
      });

      // Sắp xếp lô mới nhất lên đầu
      allBatches.sort(
        (a, b) =>
          new Date(b.createdAt || b.harvestDate).getTime() -
          new Date(a.createdAt || a.harvestDate).getTime(),
      );

      const shop = storeName || "Nong_San";
      exportBatchesCSV(allBatches, shop);
    } catch (err: any) {
      console.error("Lỗi xuất file lô hàng:", err);
      alert("Không thể tải danh sách lô hàng để xuất báo cáo!");
    } finally {
      setIsExportingBatches(false);
    }
  };

  // 3. Xử lý xuất file Word: Đơn hàng
  const handleExportOrdersWord = async () => {
    try {
      const orders = data?.recentOrdersForExport || [];
      if (orders.length === 0) return alert("Không có đơn hàng nào trong kỳ này!");
      const shop = data?.storeName || "Cửa hàng nông sản";
      await exportOrdersDocx(orders, shop);
    } catch (e: any) {
      console.error("Lỗi xuất Word đơn hàng:", e);
      alert("Lỗi xuất Word: " + e.message);
    }
  };

  // 4. Xử lý xuất file Word: Danh mục sản phẩm & Tồn kho
  const handleExportProductsWord = async () => {
    try {
      setIsExportingProducts(true);
      const prods = await loadStoreProducts();
      const shop = data?.storeName || "Cửa hàng nông sản";
      await exportProductsDocx(prods, shop);
    } catch (e: any) {
      console.error("Lỗi xuất Word sản phẩm:", e);
      alert("Lỗi xuất Word: " + e.message);
    } finally {
      setIsExportingProducts(false);
    }
  };

  // 5. Xử lý xuất file Word: Báo cáo kiểm kê kho & Lô hàng (Chuẩn FEFO)
  const handleExportBatchesWord = async () => {
    try {
      setIsExportingBatches(true);
      const prods = await loadStoreProducts();

      const enrichedBatches: any[] = [];
      const today = new Date();
      prods.forEach((p: any) => {
        (p.batches || []).forEach((b: any) => {
          const expDate = new Date(b.expiryDate);
          const diffMs = expDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          const stock = b.quantity || 0;
          const isExp = stock > 0 && expDate.getTime() < today.getTime();
          const isExpSoon =
            stock > 0 && expDate.getTime() >= today.getTime() && daysLeft <= 7;

          let riskLevel = "AN TOÀN";
          if (stock <= 0) riskLevel = "HẾT TỒN KHO";
          else if (isExp) riskLevel = "ĐÃ HẾT HẠN";
          else if (isExpSoon) riskLevel = "SẮP HẾT HẠN";

          enrichedBatches.push({
            productName: p.name,
            batchCode: formatBatchCode(p.name, b.harvestDate, b.id),
            expiryDate: b.expiryDate,
            stock,
            unit: p.unit || "kg",
            price: b.price || 0,
            isExpired: isExp,
            isExpiringSoon: isExpSoon,
            riskLevel,
          });
        });
      });

      const expiredLossValue = enrichedBatches
        .filter((b) => b.isExpired)
        .reduce((s, b) => s + b.stock * b.price, 0);
      const expiringSoonCount = enrichedBatches.filter(
        (b) => b.isExpiringSoon,
      ).length;

      const shop = data?.storeName || "Cửa hàng nông sản";
      await exportWarehouseDocx(
        enrichedBatches,
        expiredLossValue,
        expiringSoonCount,
        shop,
      );
    } catch (e: any) {
      console.error("Lỗi xuất Word lô hàng:", e);
      alert("Lỗi xuất Word: " + e.message);
    } finally {
      setIsExportingBatches(false);
    }
  };

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
        <p className="text-sm font-medium">
          Đang tổng hợp dữ liệu thống kê cửa hàng...
        </p>
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
  const maxDayRevenue = Math.max(
    ...revenueChart7Days.map((d: any) => d.revenue),
    1,
  );

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
      active
        ? "bg-white text-emerald-700 shadow-sm font-bold"
        : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ============================================================ */}
      {/* 1. THANH TIÊU ĐỀ + BỘ LỌC THỜI GIAN + NÚT XUẤT FILE EXCEL    */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Thống kê & Phân tích
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {storeName}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-0.5">
            Báo cáo hiệu quả kinh doanh, tiến độ xử lý đơn hàng và cảnh báo kho
            nông sản
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Bộ lọc khoảng thời gian thống kê */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 text-xs">
            {PERIODS.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={periodBtn(period === value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ============================================================ */}
          {/* CỤM NÚT XUẤT BÁO CÁO (ĐƠN HÀNG & SẢN PHẨM)                  */}
          {/* ============================================================ */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Nút 1: Xuất Báo cáo Đơn hàng đối soát */}
            <ExportDropdown
              label="Xuất Đơn hàng"
              variant="emerald"
              onExportCSV={() => exportOrdersCSV(data)}
              onExportWord={handleExportOrdersWord}
              title="Xuất danh sách đơn hàng đối soát theo kỳ chọn (hỗ trợ Excel và Word)"
            />

            {/* Nút 2: Xuất Danh mục Sản phẩm & Tồn kho */}
            <ExportDropdown
              label="Xuất Sản phẩm"
              variant="outline"
              icon={<Package className="w-3.5 h-3.5 text-emerald-600" />}
              isLoading={isExportingProducts}
              onExportCSV={handleExportProducts}
              onExportWord={handleExportProductsWord}
              title="Xuất toàn bộ danh mục sản phẩm, giá bán, tồn kho và chứng nhận (hỗ trợ Excel và Word)"
            />
          </div>
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
          sub={
            <ArrowLink href="/seller/orders" cls="text-amber-600">
              Xử lý ngay
            </ArrowLink>
          }
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
              {expiringBatchesCount > 0
                ? `${expiringBatchesCount} cận date`
                : "Kho an toàn"}
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
        <Section
          title="Tiến độ Xử lý Đơn hàng"
          link={{ href: "/seller/orders", label: "Xem tất cả" }}
        >
          <div className="space-y-3">
            {FUNNEL.map(([key, label, Icon, wrapCls, iconCls, numCls]) => (
              <div
                key={key}
                className={`flex items-center justify-between p-3 rounded-xl border ${wrapCls}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${iconCls}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                </div>
                <span className={`text-base font-bold ${numCls}`}>
                  {orderStatusFunnel[key] ?? 0} đơn
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Khối 2: Cảnh báo kho nông sản (Lô hết hạn, Cận date <= 7 ngày, Sắp hết tồn kho) */}
        <Section
          title="Cảnh báo Kho Nông sản"
          right={
            <div className="flex items-center gap-2">
              {/* Nút Xuất Báo cáo Kiểm kê Lô hàng & Hao hụt Hạn dùng */}
              <ExportDropdown
                label="Xuất Báo cáo Kho"
                variant="rose"
                icon={<AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                isLoading={isExportingBatches}
                onExportCSV={handleExportBatches}
                onExportWord={handleExportBatchesWord}
                title="Xuất biên bản kiểm kê kho và cảnh báo hao hụt theo chuẩn FEFO (hỗ trợ Excel và Word)"
              />
              <span className="text-gray-300">|</span>
              <ArrowLink href="/seller/batches">Quản lý Lô</ArrowLink>
            </div>
          }
        >
          <div className="space-y-2.5 overflow-y-auto max-h-[300px]">
            {alertList.length === 0 ? (
              // Trạng thái an toàn: không có lô hàng nào cần cảnh báo
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Kho hàng đang rất an toàn!
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Không có lô hàng nào hết hạn, cận date hoặc sắp hết tồn kho.
                </p>
              </div>
            ) : (
              alertList.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 border rounded-xl flex items-center justify-between ${item.cls}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">
                        {item.productName}
                      </p>
                      <span className="text-[10px] font-mono font-bold text-rose-700 bg-white/80 px-1.5 py-0.2 rounded border border-rose-200">
                        {formatBatchCode(
                          item.productName,
                          item.expiryDate,
                          item.batchId,
                        )}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${item.textCls}`}>
                      {item.text}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md ${item.badgeCls}`}
                  >
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
            <span className="font-bold text-emerald-600">
              {maxDayRevenue > 1 ? fmt(maxDayRevenue) : "0đ"}
            </span>
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
                item.revenue > 0
                  ? Math.max(
                      Math.round((item.revenue / maxDayRevenue) * 100),
                      8,
                    )
                  : 4;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center group relative h-full justify-end"
                >
                  {/* Tooltip hiển thị đầy đủ ngày tháng, doanh thu nổi bật và mũi tên trỏ xuống cột */}
                  {/* Sử dụng filter drop-shadow-md để bóng ôm sát viền thực tế của cả hộp lẫn mũi tên */}
                  <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 flex flex-col items-center whitespace-nowrap filter drop-shadow-md">
                    <div className="bg-gray-900 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg flex flex-col items-center text-center">
                      <p className="font-bold text-emerald-400">
                        {item.date} ({item.dayName}): {fmt(item.revenue)}
                      </p>
                      <p className="text-[10px] text-gray-300 font-normal mt-0.5">
                        {item.ordersCount} đơn thành công
                      </p>
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
                <p className="text-xs font-bold text-gray-700">
                  {item.dayName}
                </p>
                <p className="text-[10px] text-gray-400">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
