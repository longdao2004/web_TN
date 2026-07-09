import React from 'react';
import { Dropdown } from './Dropdown';
import { Avatar } from '../Avatar';
import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '../Button';

export const DropdownExample = () => {
  const menuItems = [
    { label: 'Hồ sơ cá nhân', icon: <User /> },
    { label: 'Cài đặt hệ thống', icon: <Settings /> },
    { divider: true, label: '' },
    { label: 'Tính năng Pro', disabled: true },
    { divider: true, label: '' },
    { label: 'Đăng xuất', icon: <LogOut />, danger: true, onClick: () => alert('Đã đăng xuất!') },
  ];

  return (
    <div className="flex gap-16 p-8 bg-gray-50 h-[300px]">
      <Dropdown
        align="left"
        trigger={<Button variant="outline">Tùy chọn</Button>}
        items={menuItems}
      />

      <Dropdown
        align="right"
        trigger={
          <div className="hover:ring-2 ring-[var(--color-primary)] rounded-full transition-all">
            <Avatar src="https://github.com/shadcn.png" size="md" />
          </div>
        }
        items={menuItems}
      />
    </div>
  );
};
