"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { Plus, Check, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export const StoreActionButtons = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast.success('Đã theo dõi cửa hàng');
    } else {
      toast.info('Đã hủy theo dõi cửa hàng');
    }
  };

  const handleContact = () => {
    toast.info('Tính năng Chat đang được phát triển');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      <Button 
        variant={isFollowing ? "outline" : "primary"}
        className={`rounded-xl font-bold h-11 px-6 flex-1 sm:flex-none ${isFollowing ? 'border-gray-200 text-gray-700 bg-white' : 'shadow-lg shadow-emerald-500/20'}`}
        onClick={handleFollow}
      >
        {isFollowing ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
        {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
      </Button>
      
      <Button 
        variant="outline"
        className="rounded-xl font-bold h-11 px-6 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 flex-1 sm:flex-none"
        onClick={handleContact}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Liên hệ
      </Button>
    </div>
  );
};
