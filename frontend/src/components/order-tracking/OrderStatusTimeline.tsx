import React from 'react';
import { TimelineStep } from '@/types/order';
import { CheckCircle2, Circle, Clock, Package, Truck, Home } from 'lucide-react';

interface OrderStatusTimelineProps {
  steps: TimelineStep[];
}

export const OrderStatusTimeline = ({ steps }: OrderStatusTimelineProps) => {
  
  const getIcon = (index: number, isActive: boolean, isCompleted: boolean) => {
    const iconProps = {
      className: `w-5 h-5 sm:w-6 sm:h-6 ${isCompleted ? 'text-white' : isActive ? 'text-emerald-600' : 'text-gray-400'}`
    };
    
    switch(index) {
      case 0: return <CheckCircle2 {...iconProps} />;
      case 1: return <Clock {...iconProps} />;
      case 2: return <Package {...iconProps} />;
      case 3: return <Truck {...iconProps} />;
      case 4: return <Home {...iconProps} />;
      default: return <Circle {...iconProps} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-6 duration-700 fade-in overflow-hidden">
      <h2 className="text-lg font-bold text-gray-900 mb-8">Trạng thái đơn hàng</h2>
      
      <div className="relative">
        {/* Desktop Line */}
        <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gray-100 z-0">
          <div 
            className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: '75%' }} // Mock progress for "Đang giao"
          ></div>
        </div>

        {/* Mobile Line */}
        <div className="md:hidden absolute top-[28px] bottom-[28px] left-[28px] w-[2px] bg-gray-100 z-0">
          <div 
            className="absolute top-0 left-0 w-full bg-emerald-500 transition-all duration-1000 ease-out"
            style={{ height: '75%' }} // Mock progress
          ></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 flex-1 group">
              <div 
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 transition-all duration-500
                  ${step.isCompleted 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : step.isActive 
                      ? 'bg-white border-emerald-500 ring-4 ring-emerald-50 scale-110' 
                      : 'bg-white border-gray-200'
                  }
                `}
              >
                {getIcon(index, step.isActive, step.isCompleted)}
              </div>
              <div className="text-left md:text-center flex-1">
                <p className={`text-sm font-semibold transition-colors duration-300 ${step.isCompleted || step.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {step.isActive && (
                  <p className="text-xs text-emerald-600 mt-1 font-medium animate-pulse">
                    Đang thực hiện...
                  </p>
                )}
                {step.isCompleted && (
                  <p className="text-xs text-gray-500 mt-1">
                    Hoàn tất
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
