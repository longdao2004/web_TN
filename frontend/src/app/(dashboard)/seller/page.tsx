export default function SellerDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tổng quan Cửa hàng</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Đơn hàng mới</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Doanh thu hôm nay</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">2,450,000đ</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Sản phẩm sắp hết hạn</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">3</p>
        </div>
      </div>
    </div>
  );
}