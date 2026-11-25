"use client";
import React, { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, FileSpreadsheet, FileText, Loader2 } from "lucide-react";

interface ExportDropdownProps {
  label: string;
  icon?: React.ReactNode;
  variant?: "emerald" | "outline" | "rose";
  isLoading?: boolean;
  onExportCSV: () => void | Promise<void>;
  onExportWord: () => void | Promise<void>;
  title?: string;
}

export const ExportDropdown = ({
  label,
  icon,
  variant = "emerald",
  isLoading = false,
  onExportCSV,
  onExportWord,
  title,
}: ExportDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi người dùng bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Định kiểu màu sắc theo variant
  let btnClasses = "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200";
  if (variant === "outline") {
    btnClasses = "bg-white hover:bg-emerald-50 border border-emerald-600 text-emerald-700 shadow-xs";
  } else if (variant === "rose") {
    btnClasses = "bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 shadow-xs";
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        disabled={isLoading}
        onClick={() => setIsOpen(!isOpen)}
        title={title}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all active:scale-95 cursor-pointer disabled:opacity-60 ${btnClasses}`}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          icon || <Download className="w-3.5 h-3.5" />
        )}
        <span>{isLoading ? "Đang xử lý..." : label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Menu xổ xuống */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Chọn định dạng tải về
          </div>

          {/* Lựa chọn 1: Excel / CSV */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportCSV();
            }}
            className="w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-emerald-50/70 transition group cursor-pointer"
          >
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg group-hover:scale-105 transition shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 group-hover:text-emerald-700">
                Bảng tính Excel / CSV (.csv)
              </p>
              <p className="text-[11px] text-gray-500">
                Phù hợp lọc số liệu, kế toán doanh thu
              </p>
            </div>
          </button>

          {/* Lựa chọn 2: Biểu mẫu Word */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportWord();
            }}
            className="w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-blue-50/70 transition group cursor-pointer border-t border-gray-50"
          >
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg group-hover:scale-105 transition shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 group-hover:text-blue-700">
                Biểu mẫu Word in ấn (.docx)
              </p>
              <p className="text-[11px] text-gray-500">
                Biên bản chuẩn có tiêu ngữ & chữ ký
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};