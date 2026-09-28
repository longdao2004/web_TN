const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const statisticService = {
  getOverview: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(`${API_URL}/statistics/overview`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu thống kê");
    return res.json();
  },
};