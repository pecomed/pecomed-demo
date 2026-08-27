import React, { useState } from 'react';
import { ExclusionRiskTriggers, ExclusionAssessmentResult } from '../types/cdss';
import { ShieldAlert, AlertTriangle, ChevronRight, ChevronLeft, HeartCrack, Activity, Ban, CheckCircle, Stethoscope, FileSearch } from 'lucide-react';

interface Step3Props {
  triggers: ExclusionRiskTriggers;
  result: ExclusionAssessmentResult | null;
  onUpdateTriggers: (updated: ExclusionRiskTriggers) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Exclusion: React.FC<Step3Props> = ({
  triggers,
  result,
  onUpdateTriggers,
  onNext,
  onBack
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'safety' | 'differential'>('safety');

  const toggle = (key: keyof ExclusionRiskTriggers) => {
    onUpdateTriggers({
      ...triggers,
      [key]: !triggers[key]
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            Bước 3: Rà Soát Chống Chỉ Định, Hiệu Chỉnh Liều Thận & Chẩn Đoán Loại Trừ
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sàng lọc nguy cơ kéo dài khoảng QT (xoắn đỉnh), nhược cơ, tổn thương gân, dị ứng thuốc, hiệu chỉnh liều theo CrCl (Cockcroft-Gault) và phân tích loại trừ 8 bệnh lý giả viêm phổi.
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
            <span>Sang Bước 4: Kháng Sinh Kinh Nghiệm</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-tabs for Step 3 */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-sm gap-1">
        <button
          onClick={() => setActiveSubTab('safety')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
            activeSubTab === 'safety'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>1. An Toàn Kháng Sinh & Hiệu Chỉnh Liều Thận</span>
        </button>

        <button
          onClick={() => setActiveSubTab('differential')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
            activeSubTab === 'differential'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>2. Chẩn Đoán Phân Biệt & Loại Trừ 8 Bệnh Lý Mô Phỏng</span>
        </button>
      </div>

      {/* TAB 1: SAFETY & RENAL ADJUSTMENT */}
      {activeSubTab === 'safety' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Clinical Contraindication Checkboxes */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Renal Function Assessment */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                1. Chức Năng Thận & Độ Thanh Thải Creatinine (CrCl)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cân nặng bệnh nhân (kg)
                  </label>
                  <input
                    type="number"
                    value={triggers.weightKg ?? 60}
                    onChange={(e) => onUpdateTriggers({ ...triggers, weightKg: parseFloat(e.target.value) || undefined })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="VD: 60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Creatinine máu (mg/dL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={triggers.serumCreatinineMgDl ?? ''}
                    onChange={(e) => onUpdateTriggers({ ...triggers, serumCreatinineMgDl: parseFloat(e.target.value) || undefined })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="VD: 1.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CrCl ước tính (mL/phút)
                  </label>
                  <input
                    type="number"
                    value={triggers.crclMlMin ?? result?.calculatedCrCl ?? ''}
                    onChange={(e) => onUpdateTriggers({ ...triggers, crclMlMin: parseFloat(e.target.value) || undefined })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Tự động tính hoặc nhập"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 text-xs">
                <input
                  type="checkbox"
                  checked={!!triggers.hasSevereRenalFailure}
                  onChange={() => toggle('hasSevereRenalFailure')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-medium text-slate-800">Suy thận nặng / Lọc máu chu kỳ (HD / CRRT)</span>
              </label>
            </div>

            {/* Cardiac, Neuromuscular & Tendon Risks */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                <HeartCrack className="w-4 h-4 text-rose-600" />
                2. Nguy Cơ Tim Mạch, Thần Kinh Cơ & Viêm Gân
              </h3>

              <div className="space-y-2 text-xs">
                <label className="flex items-center space-x-3 bg-rose-50/50 p-3 rounded-xl border border-rose-200 cursor-pointer hover:bg-rose-100/50">
                  <input type="checkbox" checked={!!triggers.hasLongQtSyndrome} onChange={() => toggle('hasLongQtSyndrome')} className="w-4 h-4 text-rose-600 rounded" />
                  <div>
                    <span className="font-bold text-rose-950">Hội chứng QT kéo dài (Long QT / QTc &gt; 450ms) / Đang dùng thuốc kéo dài QT</span>
                    <span className="block text-[11px] text-rose-800">Chống chỉ định Quinolone (Moxifloxacin, Levofloxacin) & Macrolide (Xoắn đỉnh)</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 bg-rose-50/50 p-3 rounded-xl border border-rose-200 cursor-pointer hover:bg-rose-100/50">
                  <input type="checkbox" checked={!!triggers.hasMyastheniaGravis} onChange={() => toggle('hasMyastheniaGravis')} className="w-4 h-4 text-rose-600 rounded" />
                  <div>
                    <span className="font-bold text-rose-950">Bệnh Nhược cơ (Myasthenia Gravis)</span>
                    <span className="block text-[11px] text-rose-800">Chống chỉ định Quinolone & Aminoglycoside do nguy cơ ức chế thần kinh cơ cấp</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 bg-rose-50/50 p-3 rounded-xl border border-rose-200 cursor-pointer hover:bg-rose-100/50">
                  <input type="checkbox" checked={!!triggers.hasTendinitisOrFluoroquinoloneAllergy} onChange={() => toggle('hasTendinitisOrFluoroquinoloneAllergy')} className="w-4 h-4 text-rose-600 rounded" />
                  <div>
                    <span className="font-bold text-rose-950">Tiền sử viêm gân / đứt gân gót Achilles hoặc dị ứng Quinolone</span>
                    <span className="block text-[11px] text-rose-800">Chống chỉ định tuyệt đối toàn bộ nhóm Fluoroquinolones</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input type="checkbox" checked={!!triggers.isPregnantOrNursing} onChange={() => toggle('isPregnantOrNursing')} className="w-4 h-4 text-blue-600 rounded" />
                  <div>
                    <span className="font-semibold text-slate-800">Phụ nữ có thai hoặc đang cho con bú</span>
                    <span className="block text-[11px] text-slate-500">Tránh Fluoroquinolones, Tetracyclines, Aminoglycosides</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input type="checkbox" checked={!!triggers.hasG6pdDeficiency} onChange={() => toggle('hasG6pdDeficiency')} className="w-4 h-4 text-amber-600 rounded" />
                  <div>
                    <span className="font-semibold text-slate-800">Thiếu hụt men G6PD</span>
                    <span className="block text-[11px] text-slate-500">Chống chỉ định Cotrimoxazole (Bactrim) do nguy cơ tán huyết</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Drug Allergy History */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                <Ban className="w-4 h-4 text-amber-600" />
                3. Tiền Sử Dị Ứng Kháng Sinh
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input type="checkbox" checked={!!triggers.hasKnownPenicillinAnaphylaxis} onChange={() => toggle('hasKnownPenicillinAnaphylaxis')} className="w-4 h-4 text-rose-600 rounded" />
                  <span className="font-semibold text-rose-900">Sốc phản vệ Penicillin</span>
                </label>

                <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input type="checkbox" checked={!!triggers.hasKnownCephalosporinAnaphylaxis} onChange={() => toggle('hasKnownCephalosporinAnaphylaxis')} className="w-4 h-4 text-rose-600 rounded" />
                  <span className="font-semibold text-rose-900">Dị ứng Cephalosporin</span>
                </label>

                <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input type="checkbox" checked={!!triggers.hasKnownMacrolideAllergy} onChange={() => toggle('hasKnownMacrolideAllergy')} className="w-4 h-4 text-blue-600 rounded" />
                  <span>Dị ứng Macrolide (Azithro, Clarithro)</span>
                </label>

                <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input type="checkbox" checked={!!triggers.hasKnownDoxycyclineAllergy} onChange={() => toggle('hasKnownDoxycyclineAllergy')} className="w-4 h-4 text-blue-600 rounded" />
                  <span>Dị ứng Doxycycline / Tetracycline</span>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Exclusion Safety Verdict & Renal Adjustments */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contraindicated Antibiotics */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                <Ban className="w-4 h-4 text-rose-600" />
                Kháng Sinh BỊ CHỐNG CHỈ ĐỊNH
              </h4>

              {result?.contraindicatedDrugs && result.contraindicatedDrugs.length > 0 ? (
                <div className="space-y-1.5 text-xs">
                  {result.contraindicatedDrugs.map((drug, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                      <span>{drug}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Không có chống chỉ định tuyệt đối nào được phát hiện.</span>
                </div>
              )}
            </div>

            {/* Renal Dose Adjustment Details */}
            <div className={`p-5 rounded-2xl border shadow-sm ${
              result?.renalDoseAdjustmentRequired
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Yêu Cầu Hiệu Chỉnh Liều Theo Độ Thanh Thải Thận (CrCl)
              </h4>
              <div className="text-sm font-black mt-1">
                {result?.renalDoseAdjustmentRequired ? 'BẮT BUỘC HIỆU CHỈNH LIỀU' : 'Dùng liều chuẩn (CrCl ≥ 50 mL/phút)'}
              </div>
              {result?.calculatedCrCl !== undefined && (
                <div className="text-xs font-medium mt-1">
                  Độ thanh thải CrCl: <strong>{result.calculatedCrCl} mL/phút</strong>
                </div>
              )}

              {/* Table of Specific Renal Adjustments */}
              {result?.renalDoseAdjustments && result.renalDoseAdjustments.length > 0 && (
                <div className="mt-3 space-y-2 text-xs pt-2 border-t border-amber-200">
                  <div className="font-bold text-amber-900">Bảng liều kháng sinh đã hiệu chỉnh:</div>
                  {result.renalDoseAdjustments.map((adj, idx) => (
                    <div key={idx} className="bg-white/80 p-2.5 rounded-lg border border-amber-300 space-y-0.5">
                      <div className="font-bold text-amber-950">{adj.drugName}: <span className="text-rose-700">{adj.adjustedDose}</span></div>
                      <div className="text-[11px] text-amber-800">Liều chuẩn: {adj.normalDose}</div>
                      <div className="text-[10px] text-slate-500 italic">{adj.monitoringNote}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clinical Safety Warnings */}
            {result?.warnings && result.warnings.length > 0 && (
              <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 text-xs space-y-2">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Cảnh Báo Lâm Sàng & An Toàn Thuốc
                </div>
                <ul className="space-y-1.5 text-rose-950 list-disc list-inside leading-relaxed">
                  {result.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: DIFFERENTIAL DIAGNOSES & EXCLUSION (8 RESPIRATORY MIMICS) */}
      {activeSubTab === 'differential' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-indigo-600" />
              Chẩn Đoán Phân Biệt & Loại Trừ 8 Bệnh Lý Mô Phỏng Viêm Phổi (Differential Diagnosis)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Khi bệnh nhân không tìm thấy căn nguyên vi sinh rõ ràng hoặc không đáp ứng với kháng sinh kinh nghiệm ban đầu, cần chủ động rà soát loại trừ 8 bệnh lý sau theo sơ đồ thiết kế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result?.differentialDiagnoses && result.differentialDiagnoses.length > 0 ? (
              result.differentialDiagnoses.map((diff, idx) => (
                <div key={idx} className="p-4 rounded-2xl border bg-slate-50 space-y-2 border-indigo-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-indigo-950">{diff.condition}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      diff.probability.includes('Cao') ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {diff.probability}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <div><strong>Dấu hiệu gợi ý:</strong></div>
                    <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-600">
                      {diff.keyClues.map((clue, cIdx) => (
                        <li key={cIdx}>{clue}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <div><strong>Cận lâm sàng loại trừ:</strong></div>
                    <ul className="list-disc list-inside text-[11px] space-y-0.5 text-indigo-800">
                      {diff.suggestedExclusionTests.map((test, tIdx) => (
                        <li key={tIdx}>{test}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2 bg-indigo-50/60 rounded-lg text-[11px] text-indigo-900 border border-indigo-100">
                    <strong>Xử trí:</strong> {diff.clinicalAction}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                Không phát hiện dấu hiệu gợi ý bệnh lý mô phỏng đặc biệt nào. Tiếp tục theo dõi phác đồ điều trị viêm phổi mắc phải cộng đồng.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
