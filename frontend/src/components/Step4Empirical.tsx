import React from 'react';
import { EmpiricalRegimenResult, CareSetting } from '../types/cdss';
import { Pill, ShieldCheck, ChevronRight, ChevronLeft, Clock, Route, FileCheck, CheckCircle2 } from 'lucide-react';

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
  const regimen = result?.selectedRegimen;

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
              <span className="text-xs text-blue-200 font-medium flex items-center gap-1">
                <Route className="w-3.5 h-3.5" />
                {regimen?.administrationRoute || 'IV / PO'}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {regimen?.primaryRegimen || 'Đang tải phác đồ...'}
              </h3>
            </div>

            {regimen?.dosageDetails && (
              <div className="bg-white/10 p-3.5 rounded-xl text-xs text-blue-100 leading-relaxed border border-white/10">
                <strong>Hướng dẫn liều & cách dùng:</strong> {regimen.dosageDetails}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center space-x-1.5 text-blue-200">
                <Clock className="w-4 h-4 text-blue-300" />
                <span>Thời gian điều trị: <strong>{regimen?.recommendedDurationDays || '5-7 ngày'}</strong></span>
              </div>
            </div>
          </div>

          {/* Alternative Regimen Card */}
          {regimen?.alternativeRegimen && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-bold uppercase tracking-wider">
                  Phác Đồ Thay Thế (Alternative)
                </span>
                <span className="text-xs text-slate-500">
                  (Dành cho bệnh nhân dị ứng nhẹ hoặc không dung nạp phác đồ chính)
                </span>
              </div>

              <div className="text-sm font-bold text-slate-800 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200">
                {regimen.alternativeRegimen}
              </div>
            </div>
          )}

          {/* Clinical Regimen Notes */}
          {regimen?.clinicalNotes && regimen.clinicalNotes.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Lưu Ý Thực Hành Lâm Sàng
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside leading-relaxed">
                {regimen.clinicalNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Spectrum Coverage & Monitoring */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Pathogen Coverage Spectrum */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Phổ Kháng Khuẩn Đã Bao Phủ
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span>Pseudomonas aeruginosa</span>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  result?.hasPseudomonasCoverage ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {result?.hasPseudomonasCoverage ? 'ĐÃ BAO PHỦ' : 'Không'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span>Tụ cầu vàng kháng Methicillin (MRSA)</span>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  result?.hasMrsaCoverage ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {result?.hasMrsaCoverage ? 'ĐÃ BAO PHỦ' : 'Không'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span>Vi khuẩn không điển hình (Atypical)</span>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  result?.hasAtypicalCoverage ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {result?.hasAtypicalCoverage ? 'ĐÃ BAO PHỦ' : 'Không'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span>Vi khuẩn kỵ khí (Anaerobes)</span>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  result?.hasAnaerobeCoverage ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {result?.hasAnaerobeCoverage ? 'ĐÃ BAO PHỦ' : 'Không'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span>Burkholderia pseudomallei (Whitmore)</span>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  result?.hasMelioidosisCoverage ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {result?.hasMelioidosisCoverage ? 'ĐÃ BAO PHỦ' : 'Không'}
                </span>
              </div>
            </div>
          </div>

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
