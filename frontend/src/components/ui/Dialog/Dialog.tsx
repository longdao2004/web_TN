import React, { forwardRef } from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { DialogProps } from './Dialog.types';
import { cn } from '@/utils/cn';

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      variant = 'warning',
      confirmText = 'Xác nhận',
      onConfirm,
      cancelText = 'Hủy',
      isConfirmLoading = false,
      ...props
    },
    ref
  ) => {
    const icons = {
      danger: <AlertCircle className="w-6 h-6 text-red-600" />,
      warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      info: <Info className="w-6 h-6 text-blue-600" />,
    };

    const iconBg = {
      danger: 'bg-red-100',
      warning: 'bg-amber-100',
      info: 'bg-blue-100',
    };

    const confirmButtonVariants = {
      danger: 'danger',
      warning: 'primary',
      info: 'primary',
    } as const;

    return (
      <Modal
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        preventCloseOnOutsideClick
        {...props}
      >
        <div className="flex flex-col items-center text-center pt-4">
          {/* Icon tròn */}
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-full mb-4', iconBg[variant])}>
            {icons[variant]}
          </div>

          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            {title}
          </h3>
          <div className="text-sm text-[var(--color-text-secondary)] mb-6">
            {description}
          </div>

          <div className="flex w-full gap-3 mt-2">
            <Button variant="outline" fullWidth onClick={onClose} disabled={isConfirmLoading}>
              {cancelText}
            </Button>
            <Button
              variant={confirmButtonVariants[variant]}
              fullWidth
              onClick={onConfirm}
              isLoading={isConfirmLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);

Dialog.displayName = 'Dialog';
