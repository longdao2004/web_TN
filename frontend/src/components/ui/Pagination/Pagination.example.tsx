import React, { useState } from 'react';
import { Pagination } from './Pagination';

export const PaginationExample = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-8 p-8 bg-white">
      <div>
        <p className="mb-4 text-sm font-medium">Standard Pagination (12 pages)</p>
        <Pagination 
          currentPage={page} 
          totalPages={12} 
          onPageChange={setPage} 
        />
      </div>

      <div>
        <p className="mb-4 text-sm font-medium">Pagination with Text</p>
        <Pagination 
          currentPage={page} 
          totalPages={5} 
          onPageChange={setPage} 
          showText
        />
      </div>
    </div>
  );
};
