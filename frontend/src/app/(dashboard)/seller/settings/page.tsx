"use client";
import React, { useState, useEffect } from 'react';
import { Save, UploadCloud } from 'lucide-react';
import { storeService } from '@/services/store.service';

export default function SellerSettingsPage() {
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');

  useEffect(() => {
    const fetchStoreData = async () => {
      setIsLoading(true);
      try {
        const store = await storeService.getMyStore();
        setStoreName(store.name);
        setDescription(store.description || '');
        
        if (store.logoUrl) {
          setLogoPreview(store.logoUrl);
        }
        if (store.coverUrl) {
          setCoverPreview(store.coverUrl);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin cửa hàng:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const formData = new FormData();
      formData.append('name', storeName);
      formData.append('description', description);
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      if (coverFile) {
        formData.append('cover', coverFile);
      }

      await storeService.updateMyStore(formData);
      alert("Cập nhật thông tin cửa hàng thành công!");
    } catch (error) {
      alert("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Đang tải thông tin cửa hàng...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Thiết lập Cửa hàng</h1>
        <p className="text-gray-500 mt-1">Quản lý thông tin hiển thị của cửa hàng bạn trên Nông Sản Việt</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-8">
          
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Hình ảnh Cửa hàng</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện (Logo)</label>
                <label className="h-32 w-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-emerald-500 cursor-pointer transition relative overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Cửa Hàng" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 mb-2" />
                      <span className="text-xs font-medium">Tải ảnh lên</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>
              <div className="flex-[2]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh bìa (Banner)</label>
                <label className="h-32 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-emerald-500 cursor-pointer transition relative overflow-hidden">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover Cửa Hàng" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 mb-2" />
                      <span className="text-xs font-medium">Tải ảnh lên</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Thông tin cửa hàng</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên Cửa hàng *</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn gọn</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none transition"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Thông tin Liên hệ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                <input type="text" defaultValue="0945678901" className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email hỗ trợ</label>
                <input type="email" defaultValue="hotro@mocchauxanh.com" className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition" />
              </div>
            </div>
          </div>

        </div>

        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 font-medium transition shadow-sm disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Đang xử lý..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
