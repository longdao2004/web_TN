import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import { Badge } from '../Badge';

export const TableExample = () => {
  const invoices = [
    { id: 'INV001', status: 'Đã thanh toán', method: 'VNPay', amount: '250,000 đ' },
    { id: 'INV002', status: 'Chờ xử lý', method: 'COD', amount: '150,000 đ' },
    { id: 'INV003', status: 'Đã hủy', method: 'Chuyển khoản', amount: '500,000 đ' },
  ];

  return (
    <div className="p-8 bg-gray-50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Mã đơn</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Phương thức</TableHead>
            <TableHead className="text-right">Tổng tiền</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>
                <Badge variant={invoice.status === 'Đã thanh toán' ? 'success' : invoice.status === 'Đã hủy' ? 'danger' : 'warning'}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell className="text-right">{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
