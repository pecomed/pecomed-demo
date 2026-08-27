import React from 'react';
import { CareSetting, ClinicalRiskProfile, PathogenEngineResult } from '../types/cdss';
import { Bug, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Microscope, Flame } from 'lucide-react';

interface Step2Props {
  careSetting: CareSetting;
  riskProfile: ClinicalRiskProfile;
  result: PathogenEngineResult | null;
  onUpdateRisk: (updated: ClinicalRiskProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Pathogen: React.FC<Step2Props> = ({
  careSetting,
  riskProfile,
  result,
  onUpdateRisk,
  onNext,
  onBack
}) => {
  const toggle = (key: keyof ClinicalRiskProfile) => {
    onUpdateRisk({
      ...riskProfile,
      [key]: !riskProfile[key]
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bug className="w-6 h-6 text-indigo-600" />
            Bước 2: Dự Đoán Căn Nguyên & Yếu Tố Nguy Cơ Vi Khuẩn Đa Kháng
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Xác định nguy cơ nhiễm <em>Pseudomonas aeruginosa</em>, <em>MRSA</em>, <em>ESBL</em>, Vi khuẩn không điển hình, Kỵ khí hoặc <em>Burkholderia pseudomallei</em> (Whitmore).
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
            <span>Sang Bước 3: Chống Chỉ Định</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Risk Factors on Left (7 cols), Pathogen Insights on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Risk Checklist */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Section 1: Pseudomonas & MRSA Risk */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <Flame className="w-4 h-4 text-rose-600" />
              1. Nguy Cơ Pseudomonas aeruginosa & Tụ Cầu Vàng Kháng Thuốc (MRSA)
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50/40">
                <input type="checkbox" checked={!!riskProfile.priorPseudomonasIsolation} onChange={() => toggle('priorPseudomonasIsolation')} className="w-4 h-4 text-rose-600 rounded" />
                <div>
                  <span className="font-semibold text-slate-800">Từng phân lập P. aeruginosa trong vòng 1 năm qua</span>
                  <span className="block text-[11px] text-slate-500">Yếu tố nguy cơ mạnh nhất cần bao phủ kháng sinh kháng trực khuẩn mủ xanh</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50/40">
                <input type="checkbox" checked={!!riskProfile.priorMrsaIsolation} onChange={() => toggle('priorMrsaIsolation')} className="w-4 h-4 text-rose-600 rounded" />
                <div>
                  <span className="font-semibold text-slate-800">Từng phân lập hoặc nhiễm trùng MRSA trong vòng 1 năm qua</span>
                  <span className="block text-[11px] text-slate-500">Chỉ định xét nghiệm PCR tỵ hầu và cân nhắc thêm Vancomycin / Linezolid</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!riskProfile.recentHospitalization90d} onChange={() => toggle('recentHospitalization90d')} className="w-4 h-4 text-blue-600 rounded" />
                <span>Nằm viện ≥ 48 giờ trong vòng 90 ngày qua</span>
              </label>

              <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!riskProfile.recentIvAntibiotics90d} onChange={() => toggle('recentIvAntibiotics90d')} className="w-4 h-4 text-blue-600 rounded" />
                <span>Sử dụng kháng sinh tiêm truyền tĩnh mạch trong vòng 90 ngày qua</span>
              </label>

              <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!riskProfile.structuralLungDiseaseBronchiectasis} onChange={() => toggle('structuralLungDiseaseBronchiectasis')} className="w-4 h-4 text-blue-600 rounded" />
                <span>Bệnh phổi cấu trúc (Giãn phế quản, Xơ nang phổi - Bronchiectasis/CF)</span>
              </label>

              <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!riskProfile.frequentCopdExacerbationsSteroids} onChange={() => toggle('frequentCopdExacerbationsSteroids')} className="w-4 h-4 text-blue-600 rounded" />
                <span>COPD đợt cấp thường xuyên / Dùng Corticosteroid toàn thân kéo dài</span>
              </label>
            </div>
          </div>

          {/* Section 2: Whitmore, ESBL, Anaerobes & Atypicals */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <Microscope className="w-4 h-4 text-emerald-600" />
              2. Bệnh Whitmore, Vi Khuẩn Kỵ Khí, ESBL & Không Điển Hình
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center space-x-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 cursor-pointer hover:bg-emerald-100/60">
                <input type="checkbox" checked={!!riskProfile.diabetesMellitusChronicLiverRenal} onChange={() => toggle('diabetesMellitusChronicLiverRenal')} className="w-4 h-4 text-emerald-600 rounded" />
                <div>
                  <span className="font-semibold text-emerald-950">Tiền sử Đái tháo đường, Bệnh gan mạn tính hoặc Bệnh thận mạn</span>
                  <span className="block text-[11px] text-emerald-800">Cơ địa đặc biệt dễ nhiễm Burkholderia pseudomallei (Whitmore)</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 cursor-pointer hover:bg-emerald-100/60">
                <input type="checkbox" checked={!!riskProfile.exposureSoilWaterFlooding} onChange={() => toggle('exposureSoilWaterFlooding')} className="w-4 h-4 text-emerald-600 rounded" />
                <div>
                  <span className="font-semibold text-emerald-950">Tiếp xúc đất, bùn lầy, nước lũ hoặc chấn thương da trầy xước</span>
                  <span className="block text-[11px] text-emerald-800">Đường lây chính của B. pseudomallei tại vùng dịch tễ</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!riskProfile.poorDentalHygieneAspiration} onChange={() => toggle('poorDentalHygieneAspiration')} className="w-4 h-4 text-blue-600 rounded" />
                <span>Vệ sinh răng miệng kém / Nguy cơ hít sặc dịch hầu họng (Vi khuẩn kỵ khí)</span>
              </label>

              <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!riskProfile.esblRiskColonization} onChange={() => toggle('esblRiskColonization')} className="w-4 h-4 text-blue-600 rounded" />
                <span>Tiền sử mang hoặc nhiễm khuẩn tiết niệu/tiêu hóa do vi khuẩn sinh ESBL</span>
              </label>

              <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!riskProfile.atypicalEpidemicContext} onChange={() => toggle('atypicalEpidemicContext')} className="w-4 h-4 text-blue-600 rounded" />
                <span>Bối cảnh dịch tễ vi khuẩn không điển hình (Mycoplasma, Legionella)</span>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Realtime Pathogen Risk Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pathogen Alerts & Warnings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
              Dự Báo Nguy Cơ Vi Khuẩn
            </h4>

            {/* Pseudomonas Status */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              result?.pseudomonasRisk ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="text-xs font-bold">Pseudomonas aeruginosa</div>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                result?.pseudomonasRisk ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {result?.pseudomonasRisk ? 'NGUY CƠ CAO' : 'Nguy cơ thấp'}
              </span>
            </div>

            {/* MRSA Status */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              result?.mrsaRisk ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="text-xs font-bold">Tụ cầu vàng kháng Methicillin (MRSA)</div>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                result?.mrsaRisk ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {result?.mrsaRisk ? 'NGUY CƠ CAO' : 'Nguy cơ thấp'}
              </span>
            </div>

            {/* Whitmore Status */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              result?.melioidosisRisk ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="text-xs font-bold">Burkholderia pseudomallei (Whitmore)</div>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                result?.melioidosisRisk ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {result?.melioidosisRisk ? 'CẢNH BÁO WHITMORE' : 'Nguy cơ thấp'}
              </span>
            </div>

            {/* ESBL Status */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              result?.esblRisk ? 'bg-indigo-50 border-indigo-300 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="text-xs font-bold">Enterobacteriaceae sinh ESBL</div>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                result?.esblRisk ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {result?.esblRisk ? 'NGUY CƠ ESBL' : 'Nguy cơ thấp'}
              </span>
            </div>
          </div>

          {/* Likely Pathogens List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Căn Nguyên Thường Gặp Cần Bao Phủ
            </h4>
            <div className="space-y-1.5 text-xs">
              {result?.likelyPathogens?.map((p, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Indicated Diagnostic Tests */}
          {result?.indicatedDiagnosticTests && result.indicatedDiagnosticTests.length > 0 && (
            <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-200 text-xs space-y-2">
              <div className="font-bold text-indigo-900">Chỉ Định Xét Nghiệm Vi Sinh Đặc Hiệu</div>
              <ul className="space-y-1 text-indigo-950 list-disc list-inside">
                {result.indicatedDiagnosticTests.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Chest CT Scan Indications */}
          {result?.chestCtScanIndications && result.chestCtScanIndications.length > 0 && (
            <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 text-xs space-y-2">
              <div className="font-bold text-amber-950">Chỉ Định Chụp Cắt Lớp Vi Tính Lồng Ngực (Chest CT Scan):</div>
              <ul className="space-y-1 text-amber-900 list-disc list-inside">
                {result.chestCtScanIndications.map((ct, idx) => (
                  <li key={idx}>{ct}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Predicted Virus Subtypes */}
          {result?.predictedVirusSubtypes && result.predictedVirusSubtypes.length > 0 && (
            <div className="bg-violet-50/80 p-5 rounded-2xl border border-violet-200 text-xs space-y-2">
              <div className="font-bold text-violet-950">Dự Đoán Phân Type Virus Theo Yếu Tố Nguy Cơ:</div>
              <ul className="space-y-1 text-violet-900 list-disc list-inside">
                {result.predictedVirusSubtypes.map((v, idx) => (
                  <li key={idx}>{v}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Fungal Fallback Warning */}
          {result?.fungalFallback && (
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-300 text-xs text-orange-900">
              <span className="font-bold">⚠️ LƯU Ý CĂN NGUYÊN NẤM:</span> Không tìm thấy yếu tố nguy cơ vi khuẩn đặc hiệu. Nếu bệnh nhân không đáp ứng kháng sinh kinh nghiệm sau 72h, cần xem xét <strong>căn nguyên nấm</strong> (Aspergillus, Cryptococcus, Histoplasma) — chỉ định soi tìm nấm đờm/BAL.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
