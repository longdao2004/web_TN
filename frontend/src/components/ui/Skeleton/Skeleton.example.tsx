import React from 'react';
import { Skeleton } from './Skeleton';

export const SkeletonExample = () => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-bold mb-4">Skeleton Example</h3>
      <Skeleton />
    </div>
  );
};
