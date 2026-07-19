"use client";
import React, { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => setIsAnimating(true), 0);
      document.body.style.overflow = "hidden";
    } else {
      timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
      >
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>

          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
            Xóa sản phẩm
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Bạn có chắc chắn muốn xóa{" "}
            <span className="font-semibold text-gray-700">
              {itemName || "sản phẩm này"}
            </span>{" "}
            khỏi giỏ hàng?
          </p>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Hủy
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Xóa ngay
            </Button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
