import React from 'react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';
import { Info } from 'lucide-react';

export const TooltipExample = () => {
  return (
    <div className="flex gap-12 p-16 bg-white items-center justify-center">
      <Tooltip content="Lưu nháp thành công" position="top">
        <Button variant="outline">Hover Top</Button>
      </Tooltip>

      <Tooltip content="Cài đặt hệ thống" position="bottom">
        <Button variant="outline">Hover Bottom</Button>
      </Tooltip>

      <Tooltip content="Trợ giúp" position="right">
        <div className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer">
          <Info className="w-5 h-5 text-gray-600" />
        </div>
      </Tooltip>
    </div>
  );
};
