const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const statisticService = {
  // Lấy thống kê cho Người bán (Seller) với bộ lọc thời gian: all | 7d | 30d | month
  getOverview: async (period = "all") => {
    try {
      const res = await fetch(`${API_URL}/statistics/overview?period=${encodeURIComponent(period)}`, {
        method: "GET",
        headers: getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Lấy thống kê toàn sàn cho Quản trị viên (Admin)
  getAdminOverview: async () => {
    try {
      const res = await fetch(`${API_URL}/statistics/admin/overview`, {
        method: "GET",
        headers: getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};