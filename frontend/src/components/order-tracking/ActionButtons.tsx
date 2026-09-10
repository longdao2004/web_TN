import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ShoppingBag, MessageCircle, Store, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { orderService } from "@/services/order.service";

interface ActionButtonsProps {
  storeSlug?: string;
  orderId?: string;
  orderStatus?: string;
  onOrderCancelled?: () => void;
}

export const ActionButtons = ({
  storeSlug,
  orderId,
  orderStatus,
  onOrderCancelled,
}: ActionButtonsProps) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = async () => {
    if (!orderId) return;

    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này không? Tồn kho sản phẩm sẽ được hoàn lại.",
    );
    if (!confirmCancel) return;

    try {
      setIsCancelling(true);
      await orderService.cancelOrder(orderId);
      toast.success("Đã hủy đơn hàng thành công!");
      if (onOrderCancelled) {
        onOrderCancelled();
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể hủy đơn hàng");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-400 fill-mode-both">
      {/* Nút Hủy đơn hàng (Chỉ hiển thị khi trạng thái là PENDING) */}
      {orderStatus === "PENDING" && orderId && (
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-xl bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-semibold"
          disabled={isCancelling}
          onClick={handleCancelOrder}
        >
          {isCancelling ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <XCircle className="w-4 h-4 mr-2" />
          )}
          {isCancelling ? "Đang xử lý..." : "Hủy đơn hàng"}
        </Button>
      )}

      {storeSlug && (
        <Link href={`/cua-hang/${storeSlug}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl bg-white border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold"
          >
            <Store className="w-4 h-4 mr-2" />
            Xem cửa hàng
          </Button>
        </Link>
      )}

      <Button
        variant="outline"
        className="flex-1 h-12 rounded-xl bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100 font-semibold"
        onClick={() => toast.info("Tính năng Chat đang được phát triển")}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Liên hệ cửa hàng
      </Button>

      <Link href="/san-pham" className="flex-1">
        <Button
          variant="primary"
          className="w-full h-12 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Tiếp tục mua sắm
        </Button>
      </Link>
    </div>
  );
};