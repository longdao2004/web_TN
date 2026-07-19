import React from 'react';
import { TimelineStep } from '@/types/order';
import { Check, ClipboardList, Package, Truck, Home } from 'lucide-react';

interface OrderTimelineProps {
  steps: TimelineStep[];
}

export const OrderTimeline = ({ steps }: OrderTimelineProps) => {
  
  const getIcon = (index: number, isActive: boolean, isCompleted: boolean) => {
    const props = {
      className: `w-5 h-5 ${isCompleted ? 'text-white' : isActive ? 'text-emerald-600' : 'text-gray-400'}`
    };
    switch (index) {
      case 0: return <ClipboardList {...props} />;
      case 1: return <Check {...props} />;
      case 2: return <Package {...props} />;
      case 3: return <Truck {...props} />;
      case 4: return <Home {...props} />;
      default: return <Check {...props} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-5 duration-700 fade-in overflow-hidden">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Tiến trình đơn hàng</h2>
      
      {/* Mobile: Vertical, Desktop: Horizontal */}
      <div className="relative">
        {/* Desktop Line */}
        <div className="hidden md:block absolute top-[22px] left-[10%] right-[10%] h-[2px] bg-gray-100 z-0">
          <div 
            className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-1000"
            style={{ width: '25%' }} // Mock 25% for first step completed
          ></div>
        </div>

        {/* Mobile Line */}
        <div className="md:hidden absolute top-[22px] bottom-[22px] left-[22px] w-[2px] bg-gray-100 z-0">
          <div 
            className="absolute top-0 left-0 w-full bg-emerald-500 transition-all duration-1000"
            style={{ height: '25%' }} // Mock 25%
          ></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0 relative z-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 flex-1">
              <div 
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 transition-colors duration-500
                  ${step.isCompleted 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : step.isActive 
                      ? 'bg-white border-emerald-500 ring-4 ring-emerald-50' 
                      : 'bg-white border-gray-200'
                  }
                `}
              >
                {getIcon(index, step.isActive, step.isCompleted)}
              </div>
              <div className="text-left md:text-center">
                <p className={`text-sm font-semibold ${step.isCompleted || step.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {step.isActive && (
                  <p className="text-xs text-emerald-600 mt-0.5 font-medium animate-pulse">
                    Đang xử lý
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
