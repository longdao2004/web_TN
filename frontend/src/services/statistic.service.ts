const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const statisticService = {
  // Lấy thống kê cho Người bán (Seller)
  getOverview: async () => {
    const res = await fetch(`${API_URL}/statistics/overview`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu thống kê cửa hàng");
    return res.json();
  },

  // Lấy thống kê toàn sàn cho Quản trị viên (Admin)
  getAdminOverview: async () => {
    const res = await fetch(`${API_URL}/statistics/admin/overview`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu thống kê quản trị");
    return res.json();
  },
};