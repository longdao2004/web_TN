import React from 'react';
import { SearchBox } from './SearchBox';

export const SearchBoxExample = () => {
  return (
    <div className="flex flex-col gap-6 p-8 bg-white max-w-md">
      <div>
        <p className="mb-2 text-sm font-medium">Outline (Default)</p>
        <SearchBox 
          placeholder="Tìm kiếm nông sản, cửa hàng..." 
          onSearch={(val) => console.log('Searching for:', val)} 
        />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Filled Variant</p>
        <SearchBox 
          variant="filled" 
          placeholder="Tìm theo danh mục..." 
        />
      </div>
    </div>
  );
};
