import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const StorePagination = () => {
  return (
    <div className="flex items-center justify-center gap-2 mt-12 animate-in fade-in duration-700 delay-500 fill-mode-both">
      <button
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        disabled
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20">
        1
      </button>

      <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer font-medium">
        2
      </button>

      <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer font-medium">
        3
      </button>

      <span className="w-10 h-10 flex items-center justify-center text-gray-400">
        ...
      </span>

      <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer font-medium">
        12
      </button>

      <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
