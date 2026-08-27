import React from 'react';
import { EmpiricalRegimenResult, CareSetting } from '../types/cdss';
import { Pill, ShieldCheck, ChevronRight, ChevronLeft, Clock, Activity, FileCheck, AlertTriangle } from 'lucide-react';

interface Step4Props {
  careSetting: CareSetting;
  result: EmpiricalRegimenResult | null;
  onNext: () => void;
  onBack: () => void;
}

export const Step4Empirical: React.FC<Step4Props> = ({
  careSetting,
  result,
  onNext,
  onBack
}) => {
  return (
    <div className="space-y-6">
      
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Pill className="w-6 h-6 text-blue-600" />
            Bước 4: Khuyến Nghị Phác Đồ Kháng Sinh Kinh Nghiệm Ban Đầu
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Phác đồ kháng sinh kinh nghiệm được cá thể hóa theo mức độ nặng ({result?.careSetting || careSetting}), nguy cơ vi khuẩn kháng thuốc và chống chỉ định.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
          <button
            onClick={onNext}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md transition active:scale-95"
          >
            <span>Sang Bước 5: Vi Sinh Đích</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Regimen Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Primary and Alternative Regimens */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Primary Regimen Card */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg border border-blue-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-blue-500/30 text-blue-200 border border-blue-400/40 rounded-full text-xs font-bold uppercase tracking-wider">
                ⭐ Phác Đồ Ưu Tiên Hàng 1 (First-line)
              </span>
              <span className="text-xs text-blue-200 font-medium">
                {result?.careSetting || 'Ngoại trú'}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {result?.regimenTitle || 'Phác đồ kháng sinh kinh nghiệm'}
              </h3>
              {result?.targetPatientGroup && (
                <p className="text-xs text-blue-200 mt-1">
                  {result.targetPatientGroup}
                </p>
              )}
            </div>

            {/* List of Primary Antibiotics */}
            <div className="space-y-2 pt-2">
              {result?.primaryRegimen && result.primaryRegimen.length > 0 ? (
                result.primaryRegimen.map((ab, idx) => (
                  <div key={idx} className="bg-white/10 p-3.5 rounded-xl text-xs text-blue-100 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between font-bold text-white text-sm">
                      <span>{ab.name}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-500/40 rounded-md font-semibold text-blue-100">
                        {ab.route}
                      </span>
                    </div>
                    <div className="text-blue-100">
                      <strong>Liều dùng:</strong> {ab.dose}
                    </div>
                    {ab.role && (
                      <div className="text-blue-200 text-[11px]">
                        <strong>Chỉ định:</strong> {ab.role}
                      </div>
                    )}
                    {ab.note && (
                      <div className="text-blue-300 text-[11px] italic">
                        💡 {ab.note}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-blue-200">Đang tính toán phác đồ...</div>
              )}
            </div>
          </div>

          {/* Add-ons (MRSA, Antiviral, etc.) */}
          {result?.addOns && result.addOns.length > 0 && (
            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 space-y-3">
              <div className="flex items-center space-x-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Kháng Sinh / Thuốc Bổ Sung Theo Nguy Cơ Đặc Biệt</span>
              </div>
              <div className="space-y-2">
                {result.addOns.map((ab, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-rose-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-rose-900">
                      <span>{ab.name}</span>
                      <span className="text-[11px] px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold">
                        {ab.route}
                      </span>
                    </div>
                    <div className="text-slate-700"><strong>Liều dùng:</strong> {ab.dose}</div>
                    {ab.note && <div className="text-rose-700 text-[11px]">💡 {ab.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Regimen Card */}
          {result?.alternativeRegimen && result.alternativeRegimen.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-bold uppercase tracking-wider">
                  Phác Đồ Thay Thế (Alternative)
                </span>
                <span className="text-xs text-slate-500">
                  (Dành cho bệnh nhân dị ứng nhẹ hoặc không dung nạp phác đồ chính)
                </span>
              </div>

              <div className="space-y-2">
                {result.alternativeRegimen.map((ab, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{ab.name}</span>
                      <span className="text-[11px] px-2 py-0.5 bg-slate-200 rounded font-semibold">
                        {ab.route}
                      </span>
                    </div>
                    <div className="text-slate-700"><strong>Liều:</strong> {ab.dose}</div>
                    {ab.role && <div className="text-slate-500 text-[11px]"><strong>Vai trò:</strong> {ab.role}</div>}
                    {ab.note && <div className="text-slate-500 text-[11px] italic">💡 {ab.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-down Regimen */}
          {result?.stepDownRegimen && result.stepDownRegimen.length > 0 && (
            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                🔄 Kháng Sinh Chuyển Tiếp Đường Uống Khi Xuất Viện (Oral Step-down)
              </span>
              <div className="space-y-2">
                {result.stepDownRegimen.map((ab, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div className="font-bold text-emerald-950">{ab.name}</div>
                    <div className="text-slate-700"><strong>Liều:</strong> {ab.dose}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monitoring Plan */}
          {result?.monitoringPlan && result.monitoringPlan.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Kế Hoạch Theo Dõi Lâm Sàng
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside leading-relaxed">
                {result.monitoringPlan.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Spectrum Coverage & Adjunctive Therapies */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Adjunctive Therapy: Corticosteroids */}
          {result?.corticosteroidRecommendation && (
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-700" />
                Khuyến Cáo Corticosteroid Sớm
              </div>
              <p className="leading-relaxed">
                {result.corticosteroidRecommendation}
              </p>
            </div>
          )}

          {/* Adjunctive Therapy: Respiratory Support */}
          {result?.respiratorySupport && (
            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-2">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-700" />
                Hỗ Trợ Hô Hấp & Thông Khí
              </div>
              <p className="leading-relaxed">
                {result.respiratorySupport}
              </p>
            </div>
          )}

          {/* Golden Hour Reminder */}
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              Quy Tắc "Giờ Vàng" Kháng Sinh
            </div>
            <p className="leading-relaxed">
              Bắt đầu liều kháng sinh tĩnh mạch đầu tiên trong vòng <strong>1 giờ</strong> đối với bệnh nhân sốc nhiễm khuẩn / ICU, và trong vòng <strong>4 giờ</strong> đối với bệnh nhân nội trú thông thường.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
