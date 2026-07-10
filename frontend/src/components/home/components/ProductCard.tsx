import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Badge, Button } from '@/components/ui';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    store: string;
    image: string;
    badges?: string[];
    unit: string;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.badges.map((badge, idx) => (
              <Badge key={idx} variant={badge === 'Khuyến mãi' ? 'danger' : 'primary'} size="sm">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/store/${product.store}`} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:underline mb-1">
          {product.store}
        </Link>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 hover:text-[var(--color-primary)] transition-colors h-10">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="flex items-end gap-2">
              <span className="text-lg font-bold text-[var(--color-primary)]">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-500 mb-1">/{product.unit}</span>
            </div>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <Button size="icon" className="h-9 w-9 rounded-full shadow-sm">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
