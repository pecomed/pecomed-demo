import React, { useState } from 'react';
import {
  Step5TargetedRequest,
  TargetedRegimenResult,
  OralStepDownRequest,
  OralStepDownResult,
  Response72hRequest,
  TreatmentResponse72hResult
} from '../types/cdss';
import { Microscope, CheckCircle2, AlertTriangle, ArrowRightLeft, TrendingDown, ChevronLeft, ShieldCheck, Activity } from 'lucide-react';

interface Step5Props {
  targetedReq: Step5TargetedRequest;
  targetedRes: TargetedRegimenResult | null;
  oralReq: OralStepDownRequest;
  oralRes: OralStepDownResult | null;
  response72Req: Response72hRequest;
  response72Res: TreatmentResponse72hResult | null;
  onUpdateTargeted: (req: Step5TargetedRequest) => void;
  onUpdateOral: (req: OralStepDownRequest) => void;
  onUpdate72h: (req: Response72hRequest) => void;
  onBack: () => void;
  onOpenReport: () => void;
}

export const Step5Targeted: React.FC<Step5Props> = ({
  targetedReq,
  targetedRes,
  oralReq,
  oralRes,
  response72Req,
  response72Res,
  onUpdateTargeted,
  onUpdateOral,
  onUpdate72h,
  onBack,
  onOpenReport
}) => {
  const [activeTab, setActiveTab] = useState<'targeted' | 'oral' | 'response72'>('targeted');

  const pathogensList = [
    { id: 'streptococcus_pneumoniae', name: 'Streptococcus pneumoniae (Phế cầu)' },
    { id: 'staphylococcus_aureus', name: 'Staphylococcus aureus (Tụ cầu vàng)' },
    { id: 'klebsiella_pneumoniae', name: 'Klebsiella pneumoniae' },
    { id: 'pseudomonas_aeruginosa', name: 'Pseudomonas aeruginosa (Mủ xanh)' },
    { id: 'burkholderia_pseudomallei', name: 'Burkholderia pseudomallei (Bệnh Whitmore)' },
    { id: 'haemophilus_influenzae', name: 'Haemophilus influenzae' },
    { id: 'mycoplasma_pneumoniae', name: 'Mycoplasma / Chlamydia / Legionella' },
    { id: 'influenza_virus', name: 'Cúm (Influenza A/B / Virus)' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Microscope className="w-6 h-6 text-indigo-600" />
            Bước 5: Kháng Sinh Đích Theo Vi Sinh, Động Học PCT & Xuống Thang Uống
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Điều trị nhắm trúng đích theo kết quả cấy / Kháng sinh đồ (MIC), theo dõi đáp ứng điều trị sau 72 giờ và đánh giá tiêu chí chuyển sang kháng sinh đường uống (Oral Step-down).
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại Bước 4</span>
          </button>
          <button
            onClick={onOpenReport}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md transition active:scale-95"
          >
            <span>📄 Xuất Báo Cáo Tổng Hợp</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-sm gap-1">
        <button
          onClick={() => setActiveTab('targeted')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
            activeTab === 'targeted'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Microscope className="w-4 h-4" />
          <span>1. Kháng Sinh Đích (Targeted Therapy)</span>
        </button>

        <button
          onClick={() => setActiveTab('oral')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
            activeTab === 'oral'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>2. Tiêu Chí Chuyển Kháng Sinh Uống (7/7)</span>
        </button>

        <button
          onClick={() => setActiveTab('response72')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
            activeTab === 'response72'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>3. Đánh Giá Đáp Ứng Sau 72h & Động Học PCT</span>
        </button>
      </div>

      {/* TAB 1: TARGETED THERAPY */}
      {activeTab === 'targeted' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Pathogen & MIC selection */}
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              Kết Quả Nuôi Cấy & Kháng Sinh Đồ
            </h3>

            {/* Pathogen Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vi khuẩn phân lập được</label>
              <select
                value={targetedReq.pathogenId}
                onChange={(e) => onUpdateTargeted({ ...targetedReq, pathogenId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {pathogensList.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* S. pneumoniae MIC */}
            {targetedReq.pathogenId.includes('pneumoniae') && !targetedReq.pathogenId.includes('klebsiella') && (
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-2">
                <label className="block text-xs font-bold text-indigo-950">
                  Nồng độ ức chế tối thiểu MIC Penicillin (mcg/mL)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    step="0.1"
                    value={targetedReq.micPenicillin ?? 1.0}
                    onChange={(e) => onUpdateTargeted({ ...targetedReq, micPenicillin: parseFloat(e.target.value) || 0 })}
                    className="w-28 bg-white border border-indigo-300 rounded-lg p-2 text-sm font-bold text-indigo-900"
                  />
                  <div className="text-xs text-indigo-900">
                    {(targetedReq.micPenicillin ?? 1.0) <= 2.0 ? '🟢 Nhạy cảm (MIC ≤ 2 µg/mL)' :
                     (targetedReq.micPenicillin ?? 1.0) < 8.0 ? '🟡 Trung gian (2 < MIC < 8 µg/mL)' : '🔴 Đề kháng (MIC ≥ 8 µg/mL)'}
                  </div>
                </div>
              </div>
            )}

            {/* Klebsiella ESBL triggers */}
            {targetedReq.pathogenId.includes('klebsiella') && (
              <div className="space-y-2 text-xs">
                <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.isEsbl} onChange={(e) => onUpdateTargeted({ ...targetedReq, isEsbl: e.target.checked })} className="w-4 h-4 rounded text-indigo-600" />
                  <span className="font-semibold">Chủng sinh men ESBL dương tính (ESBL+)</span>
                </label>
                <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.isCarbapenemResistant} onChange={(e) => onUpdateTargeted({ ...targetedReq, isCarbapenemResistant: e.target.checked })} className="w-4 h-4 rounded text-rose-600" />
                  <span className="font-semibold text-rose-800">Đề kháng Carbapenem (CRE)</span>
                </label>
              </div>
            )}

            {/* MRSA trigger */}
            {targetedReq.pathogenId.includes('aureus') && (
              <label className="flex items-center space-x-2 bg-rose-50 p-2.5 rounded-lg border border-rose-200 cursor-pointer text-xs">
                <input type="checkbox" checked={!!targetedReq.isMrsa} onChange={(e) => onUpdateTargeted({ ...targetedReq, isMrsa: e.target.checked })} className="w-4 h-4 rounded text-rose-600" />
                <span className="font-bold text-rose-900">Kháng Methicillin (MRSA - Cefoxitin kháng / mecA+)</span>
              </label>
            )}

            {/* Whitmore triggers */}
            {targetedReq.pathogenId.includes('pseudomallei') && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                  <strong>Khuyến cáo Whitmore:</strong> Cần điều trị 2 giai đoạn: Tấn công tĩnh mạch (Ceftazidime/Meropenem ≥ 14 ngày) + Duy trì đường uống Cotrimoxazole (TMP/SMX) 3 - 6 tháng.
                </div>
              </div>
            )}
          </div>

          {/* Right: Targeted Regimen Results */}
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              Phác Đồ Điều Trị Trúng Đích Đề Xuất
            </h3>

            <div className="p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl space-y-3">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                {targetedRes?.pathogenName || 'Phác đồ nhắm đích'}
              </span>
              
              <div className="space-y-2 pt-1">
                {targetedRes?.targetedAntibiotics?.map((ab, idx) => (
                  <div key={idx} className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs font-bold text-white flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{ab}</span>
                  </div>
                ))}
              </div>

              {targetedRes?.duration && (
                <div className="text-xs text-indigo-200 pt-2 border-t border-white/10">
                  Thời gian điều trị: <strong>{targetedRes.duration}</strong>
                </div>
              )}
            </div>

            {targetedRes?.monitoringAndWarnings && targetedRes.monitoringAndWarnings.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-xl border text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-slate-800">Lưu ý theo dõi lâm sàng:</div>
                <ul className="list-disc list-inside space-y-1">
                  {targetedRes.monitoringAndWarnings.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ORAL STEP-DOWN (7 CRITERIA) */}
      {activeTab === 'oral' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              7 Tiêu Chí Xuống Thang Kháng Sinh Đường Uống (Oral Step-down)
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                <span>1. Thân nhiệt ≤ 37.8°C trong ít nhất 24 giờ qua</span>
                <input
                  type="number"
                  step="0.1"
                  value={oralReq.temp}
                  onChange={(e) => onUpdateOral({ ...oralReq, temp: parseFloat(e.target.value) || 0 })}
                  className="w-20 bg-white border rounded p-1 text-center font-bold"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                <span>2. Tần số tim &lt; 100 chu kỳ/phút</span>
                <input
                  type="number"
                  value={oralReq.hr}
                  onChange={(e) => onUpdateOral({ ...oralReq, hr: parseInt(e.target.value) || 0 })}
                  className="w-20 bg-white border rounded p-1 text-center font-bold"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                <span>3. Tần số thở &lt; 24 lần/phút</span>
                <input
                  type="number"
                  value={oralReq.rr}
                  onChange={(e) => onUpdateOral({ ...oralReq, rr: parseInt(e.target.value) || 0 })}
                  className="w-20 bg-white border rounded p-1 text-center font-bold"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                <span>4. Huyết áp tâm thu ≥ 90 mmHg</span>
                <input
                  type="number"
                  value={oralReq.sbp}
                  onChange={(e) => onUpdateOral({ ...oralReq, sbp: parseInt(e.target.value) || 0 })}
                  className="w-20 bg-white border rounded p-1 text-center font-bold"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                <span>5. Độ bão hòa oxy SpO2 ≥ 90% (thở khí trời)</span>
                <input
                  type="number"
                  value={oralReq.spo2}
                  onChange={(e) => onUpdateOral({ ...oralReq, spo2: parseFloat(e.target.value) || 0 })}
                  className="w-20 bg-white border rounded p-1 text-center font-bold"
                />
              </div>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border cursor-pointer">
                <span>6. Có khả năng ăn uống và hấp thu thuốc đường tiêu hóa</span>
                <input
                  type="checkbox"
                  checked={oralReq.canEatAndSwallow}
                  onChange={(e) => onUpdateOral({ ...oralReq, canEatAndSwallow: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border cursor-pointer">
                <span>7. Tình trạng tri giác / ý thức hoàn toàn bình thường</span>
                <input
                  type="checkbox"
                  checked={oralReq.normalMentalStatus}
                  onChange={(e) => onUpdateOral({ ...oralReq, normalMentalStatus: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Right: Oral Eligibility Verdict */}
          <div className="lg:col-span-5 space-y-5">
            <div className={`p-6 rounded-2xl border shadow-sm ${
              oralRes?.eligible
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <span className="text-xs uppercase tracking-wider font-bold">
                Đánh Giá Đủ Điều Kiện Xuống Thang Uống
              </span>
              <h4 className="text-xl font-black mt-1">
                {oralRes?.eligible ? 'ĐỦ ĐIỀU KIỆN CHUYỂN UỐNG' : 'CHƯA ĐỦ ĐIỀU KIỆN'}
              </h4>
              <p className="text-xs mt-2 font-medium">
                Đạt <strong>{oralRes?.metCriteriaCount ?? 0}/7</strong> tiêu chuẩn lâm sàng ổn định.
              </p>
            </div>

            {oralRes?.suggestedOralRegimens && oralRes.suggestedOralRegimens.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
                  Thuốc Kháng Sinh Đường Uống Đề Xuất
                </h4>
                <div className="space-y-2 text-xs">
                  {oralRes.suggestedOralRegimens.map((reg, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                      {reg}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: 72H RESPONSE & PROCALCITONIN */}
      {activeTab === 'response72' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              Dấu Hiệu Diễn Tiến Lâm Sàng & Động Học Procalcitonin (PCT) Sau 72h
            </h3>

            {/* PCT Kinetics */}
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-3">
              <span className="text-xs font-bold text-indigo-950 block">
                Nồng độ Procalcitonin (ng/mL):
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">PCT Ngày 0 (D0 - Nhập viện)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={response72Req.pctD0 ?? ''}
                    onChange={(e) => onUpdate72h({ ...response72Req, pctD0: parseFloat(e.target.value) || undefined })}
                    className="w-full bg-white border border-indigo-300 rounded-lg p-2 text-sm font-bold"
                    placeholder="VD: 10.0"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">PCT Ngày 3 (D3 - Sau 72h)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={response72Req.pctD3 ?? ''}
                    onChange={(e) => onUpdate72h({ ...response72Req, pctD3: parseFloat(e.target.value) || undefined })}
                    className="w-full bg-white border border-indigo-300 rounded-lg p-2 text-sm font-bold"
                    placeholder="VD: 1.5 (giảm ≥80%)"
                  />
                </div>
              </div>
            </div>

            {/* Failure Warnings */}
            <div className="space-y-2 text-xs">
              <label className="flex items-center space-x-2 bg-rose-50 p-2.5 rounded-lg border border-rose-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!response72Req.hrGt125OrRrGt33}
                  onChange={(e) => onUpdate72h({ ...response72Req, hrGt125OrRrGt33: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="text-rose-950 font-semibold">Mạch ≥ 125 bpm HOẶC Nhịp thở ≥ 33 lần/phút sau 72h</span>
              </label>

              <label className="flex items-center space-x-2 bg-rose-50 p-2.5 rounded-lg border border-rose-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!response72Req.bpLt9060}
                  onChange={(e) => onUpdate72h({ ...response72Req, bpLt9060: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="text-rose-950 font-semibold">Huyết áp tụt (HA &lt; 90/60 mmHg) / Xuất hiện sốc</span>
              </label>

              <label className="flex items-center space-x-2 bg-rose-50 p-2.5 rounded-lg border border-rose-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!response72Req.imagingWorsening}
                  onChange={(e) => onUpdate72h({ ...response72Req, imagingWorsening: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="text-rose-950 font-semibold">X-quang / CT ngực tiến triển xấu (&gt;50% tổn thương lan rộng)</span>
              </label>
            </div>
          </div>

          {/* Right: Response Assessment & Actions */}
          <div className="lg:col-span-5 space-y-5">
            <div className={`p-6 rounded-2xl border shadow-sm ${
              response72Res?.isTreatmentFailure
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <span className="text-xs uppercase tracking-wider font-bold">
                Trạng Thái Đáp Ứng Điều Trị
              </span>
              <h4 className="text-xl font-black mt-1">
                {response72Res?.responseStatus || 'Chưa đánh giá'}
              </h4>
              {response72Res?.pctKineticsInterpretation && (
                <p className="text-xs mt-2 leading-relaxed">
                  {response72Res.pctKineticsInterpretation}
                </p>
              )}
            </div>

            {response72Res?.recommendedActions && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
                  Khuyến Cáo Xử Trí Tiếp Theo
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                  {response72Res.recommendedActions.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
