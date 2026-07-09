import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from './Breadcrumb';

export const BreadcrumbExample = () => {
  return (
    <div className="p-8 bg-white">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Trái cây</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          <BreadcrumbItem>
            <BreadcrumbLink href="/products/apple" isCurrentPage>
              Táo nhập khẩu
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
