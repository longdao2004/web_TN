import React, { forwardRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ModalProps } from './Modal.types';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      isOpen,
      onClose,
      title,
      description,
      children,
      footer,
      size = 'md',
      preventCloseOnOutsideClick = false,
      ...props
    },
    ref
  ) => {
    // Xử lý khóa scroll khi Modal mở
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    // Lắng nghe phím ESC
    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-[90vw] h-[90vh]',
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => !preventCloseOnOutsideClick && onClose()}
        />

        {/* Modal Panel */}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative z-50 flex w-full flex-col bg-white rounded-xl shadow-xl',
            'animate-in fade-in zoom-in-95 duration-200',
            sizes[size],
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
                <button
                  onClick={onClose}
                  className="rounded-full p-1 opacity-70 hover:opacity-100 hover:bg-gray-100 transition-opacity"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {description && <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>}
            </div>
          )}

          {/* Nếu không có Title, vẫn phải có nút Close */}
          {!title && !description && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 opacity-70 hover:opacity-100 hover:bg-gray-100 z-10"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Body */}
          <div className={cn('p-6 overflow-y-auto', size === 'full' ? 'flex-1' : '')}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end p-6 pt-4 border-t border-[var(--color-border)] gap-2 bg-gray-50/50 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
