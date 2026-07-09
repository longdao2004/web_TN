import React, { useState, useEffect } from 'react';
import { Loading } from './Loading';

export const LoadingExample = () => {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-12 p-8 bg-white max-w-md">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">1. Spinner (Các kích thước)</h3>
        <div className="flex items-end gap-6">
          <Loading variant="spinner" size="sm" />
          <Loading variant="spinner" size="md" />
          <Loading variant="spinner" size="lg" />
          <Loading variant="spinner" size="xl" colorClass="text-amber-500" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">2. Progress Bar (Có giá trị)</h3>
        <Loading variant="progress" value={progress} />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">3. Progress Bar (Chạy vô tận)</h3>
        {/* Cần khai báo keyframes 'progress' trong tailwind config, nhưng tạm dùng width css */}
        <Loading variant="progress" className="opacity-50" />
      </div>
    </div>
  );
};
