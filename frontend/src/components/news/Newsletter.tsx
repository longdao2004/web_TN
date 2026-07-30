"use client";
import React, { useState } from 'react';
import { Send, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '@/components/ui';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email của bạn');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      toast.success('Đăng ký nhận tin thành công!');
      setEmail('');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className="py-24 bg-emerald-900 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-4 border-emerald-400 border-dashed animate-[spin_20s_linear_infinite]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border-4 border-emerald-400 border-dashed animate-[spin_20s_linear_infinite_reverse]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-in zoom-in-95 duration-1000">
        <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Mail className="w-8 h-8 text-emerald-300" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Đăng ký nhận bản tin</h2>
        <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
          Nhận ngay các cập nhật mới nhất về thị trường nông sản, kiến thức canh tác và các chương trình khuyến mãi đặc biệt từ AgriMarket.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <Input 
            type="email" 
            placeholder="Nhập địa chỉ email của bạn..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 bg-white/10 border-emerald-700 text-white placeholder:text-emerald-300 focus:bg-white/20"
            required
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl min-w-[140px]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Đăng ký
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
        <p className="text-xs text-emerald-400 mt-4">
          Chúng tôi cam kết không chia sẻ email của bạn với bất kỳ bên thứ 3 nào.
        </p>
      </div>
    </section>
  );
};
