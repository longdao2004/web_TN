import React from 'react';
import { EmptyState } from './EmptyState';

export const EmptyStateExample = () => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-bold mb-4">EmptyState Example</h3>
      <EmptyState />
    </div>
  );
};
