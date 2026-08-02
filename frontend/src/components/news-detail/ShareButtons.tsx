"use client";
import React from 'react';
import { Link as LinkIcon, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export const ShareButtons = () => {
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép đường dẫn bài viết!');
    }
  };

  return (
    <div className="flex items-center gap-4 py-8 border-t border-b border-gray-100 my-8">
      <span className="text-gray-900 font-bold flex items-center gap-2">
        <Share2 className="w-5 h-5 text-emerald-600" />
        Chia sẻ:
      </span>
      <div className="flex gap-2">
        <button 
          onClick={() => toast.info('Chức năng chia sẻ Facebook đang phát triển')}
          className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors font-bold text-xs"
          aria-label="Share on Facebook"
        >
          FB
        </button>
        <button 
          onClick={() => toast.info('Chức năng chia sẻ Zalo đang phát triển')}
          className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors font-bold text-xs"
          aria-label="Share on Zalo"
        >
          Zalo
        </button>
        <button 
          onClick={() => toast.info('Chức năng chia sẻ LinkedIn đang phát triển')}
          className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors font-bold text-xs"
          aria-label="Share on LinkedIn"
        >
          IN
        </button>
        <button 
          onClick={handleCopyLink}
          className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors"
          aria-label="Copy Link"
        >
          <LinkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
