import React from 'react';
import { Stethoscope, Bug, ShieldAlert, Pill, Microscope } from 'lucide-react';

export interface StepNavigationProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  settingBadge?: string;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
  settingBadge
}) => {
  const steps = [
    { id: 1, title: 'Bước 1', subtitle: 'Phân Tầng Mức Độ Nặng', icon: Stethoscope },
    { id: 2, title: 'Bước 2', subtitle: 'Căn Nguyên & Yếu Tố Nguy Cơ', icon: Bug },
    { id: 3, title: 'Bước 3', subtitle: 'Chống Chỉ Định & Hiệu Chỉnh', icon: ShieldAlert },
    { id: 4, title: 'Bước 4', subtitle: 'Kháng Sinh Kinh Nghiệm', icon: Pill },
    { id: 5, title: 'Bước 5', subtitle: 'Vi Sinh Đích & Đáp Ứng 72h', icon: Microscope },
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 gap-2">
          
          {/* Stepper Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.id;
              const isPast = currentStep > s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => onSelectStep(s.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : isPast
                      ? 'bg-blue-50 text-blue-800 hover:bg-blue-100/80 border border-blue-200/60'
                      : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isPast ? 'text-blue-600' : 'text-slate-500'}`} />
                  <div className="text-left">
                    <span className="block font-bold">{s.title}</span>
                    <span className={`text-[10px] hidden sm:block ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      {s.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Setting Badge Display */}
          {settingBadge && (
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs text-slate-500 font-medium">Khuyến nghị nơi điều trị:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                settingBadge.includes('ICU')
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : settingBadge.includes('Nội trú')
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {settingBadge}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
