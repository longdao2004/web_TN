"use client";
import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Textarea } from "@/components/ui";

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate simple
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      setIsSubmitting(false);
      return;
    }

    // Mock API Call
    setTimeout(() => {
      toast.success(
        "Đã gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất có thể!",
      );
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 animate-in slide-in-from-right-8 fade-in duration-1000">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gửi tin nhắn cho chúng tôi
        </h2>
        <p className="text-gray-600">
          Vui lòng điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24h
          làm việc.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              placeholder="Nhập họ và tên..."
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              name="email"
              type="email"
              placeholder="Địa chỉ email..."
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <Input
              name="phone"
              type="tel"
              placeholder="Nhập số điện thoại..."
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Chủ đề</label>
            <Input
              name="subject"
              placeholder="Vấn đề bạn cần hỗ trợ..."
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <Textarea
            name="message"
            placeholder="Mô tả chi tiết nội dung cần liên hệ..."
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto mt-4 min-w-[200px]"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang gửi...
            </>
          ) : (
            <>
              Gửi liên hệ
              <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
