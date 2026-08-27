import React, { useState } from 'react';
import {
  TargetedTherapyRequest,
  TargetedRegimenResult,
  OralStepDownRequest,
  OralStepDownResult,
  Response72hRequest,
  TreatmentResponse72hResult
} from '../types/cdss';
import {
  Microscope,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  Activity,
  Calendar,
  Sparkles,
  Wind
} from 'lucide-react';

interface Step5Props {
  targetedReq: TargetedTherapyRequest;
  targetedRes: TargetedRegimenResult | null;
  oralReq: OralStepDownRequest;
  oralRes: OralStepDownResult | null;
  response72Req: Response72hRequest;
  response72Res: TreatmentResponse72hResult | null;
  onUpdateTargeted: (updated: TargetedTherapyRequest) => void;
  onUpdateOral: (updated: OralStepDownRequest) => void;
  onUpdate72h: (updated: Response72hRequest) => void;
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
    { id: 'haemophilus_influenzae', name: 'Haemophilus influenzae / Moraxella catarrhalis' },
    { id: 'streptococcus_pneumoniae', name: 'Streptococcus pneumoniae (Phế cầu)' },
    { id: 'staphylococcus_aureus', name: 'Staphylococcus aureus (Tụ cầu vàng MSSA/MRSA)' },
    { id: 'klebsiella_pneumoniae', name: 'Klebsiella pneumoniae' },
    { id: 'pseudomonas_aeruginosa', name: 'Pseudomonas aeruginosa (Trực khuẩn mủ xanh)' },
    { id: 'burkholderia_pseudomallei', name: 'Burkholderia pseudomallei (Bệnh Whitmore)' },
    { id: 'mycoplasma_pneumoniae', name: 'Vi khuẩn không điển hình (Mycoplasma / Legionella / Chlamydia)' },
    { id: 'influenza_virus', name: 'Virus hô hấp (Cúm A/B / Parainfluenza / RSV)' }
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
          <span>1. Kháng Sinh Đích Theo Vi Sinh & KSĐ</span>
        </button>

        <button
          onClick={() => setActiveTab('oral')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
            activeTab === 'oral'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>2. Tiêu Chuẩn Xuống Thang Uống (7/7 Tiêu Chí)</span>
        </button>

        <button
          onClick={() => setActiveTab('response72')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
            activeTab === 'response72'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>3. Đánh Giá Đáp Ứng 72H & Động Học PCT</span>
        </button>
      </div>

      {/* TAB 1: TARGETED THERAPY */}
      {activeTab === 'targeted' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Pathogen Selection & Specific Controls */}
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              Kết Quả Định Danh Vi Sinh & Kháng Sinh Đồ
            </h3>

            {/* Pathogen Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vi khuẩn / Tác nhân phân lập được</label>
              <select
                value={targetedReq.pathogenId}
                onChange={(e) => onUpdateTargeted({ ...targetedReq, pathogenId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {pathogensList.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* H. influenzae & M. catarrhalis */}
            {targetedReq.pathogenId.includes('influenzae') && (
              <div className="space-y-2 text-xs p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
                <div className="font-bold text-indigo-950 mb-1">Đặc tính men & dị ứng:</div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!targetedReq.isBetaLactamasePositive}
                    onChange={(e) => onUpdateTargeted({ ...targetedReq, isBetaLactamasePositive: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span className="font-medium text-slate-800">Sinh men Beta-lactamase dương tính (Beta-lactamase +)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!targetedReq.hasBetaLactamAllergy}
                    onChange={(e) => onUpdateTargeted({ ...targetedReq, hasBetaLactamAllergy: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600"
                  />
                  <span className="font-medium text-rose-800">Bệnh nhân dị ứng với nhóm Beta-lactam (Penicillin / Cephalosporin)</span>
                </label>
              </div>
            )}

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
                  <div className="text-xs text-indigo-900 font-bold">
                    {(targetedReq.micPenicillin ?? 1.0) <= 2.0 ? '🟢 Nhạy cảm (MIC ≤ 2 µg/mL)' :
                     (targetedReq.micPenicillin ?? 1.0) < 8.0 ? '🟡 Trung gian (2 < MIC < 8 µg/mL)' : '🔴 Đề kháng (MIC ≥ 8 µg/mL)'}
                  </div>
                </div>
              </div>
            )}

            {/* S. aureus (MSSA vs MRSA & Bacteremia) */}
            {targetedReq.pathogenId.includes('aureus') && (
              <div className="space-y-2 text-xs p-4 bg-rose-50/50 rounded-xl border border-rose-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.isMrsa} onChange={(e) => onUpdateTargeted({ ...targetedReq, isMrsa: e.target.checked })} className="w-4 h-4 rounded text-rose-600" />
                  <span className="font-bold text-rose-900">Kháng Methicillin (MRSA - Kháng Cefoxitin / mecA+)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.isBacteremia} onChange={(e) => onUpdateTargeted({ ...targetedReq, isBacteremia: e.target.checked })} className="w-4 h-4 rounded text-rose-600" />
                  <span className="font-bold text-rose-900">Có Nhiễm khuẩn huyết (Cấy máu dương tính - Điều trị 4 tuần)</span>
                </label>
              </div>
            )}

            {/* Klebsiella */}
            {targetedReq.pathogenId.includes('klebsiella') && (
              <div className="space-y-2 text-xs p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.isEsbl} onChange={(e) => onUpdateTargeted({ ...targetedReq, isEsbl: e.target.checked })} className="w-4 h-4 rounded text-indigo-600" />
                  <span className="font-semibold text-slate-800">Chủng sinh men ESBL dương tính (ESBL+)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.isCarbapenemResistant} onChange={(e) => onUpdateTargeted({ ...targetedReq, isCarbapenemResistant: e.target.checked })} className="w-4 h-4 rounded text-rose-600" />
                  <span className="font-semibold text-rose-800">Đề kháng Carbapenem (CRE / KPC / NDM)</span>
                </label>
              </div>
            )}

            {/* Pseudomonas */}
            {targetedReq.pathogenId.includes('pseudomonas') && (
              <div className="space-y-2 text-xs p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.isCarbapenemResistant} onChange={(e) => onUpdateTargeted({ ...targetedReq, isCarbapenemResistant: e.target.checked })} className="w-4 h-4 rounded text-rose-600" />
                  <span className="font-bold text-rose-900">Kháng Ceftazidime & Cefepime (MDR/XDR)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.isCysticFibrosis} onChange={(e) => onUpdateTargeted({ ...targetedReq, isCysticFibrosis: e.target.checked })} className="w-4 h-4 rounded text-emerald-600" />
                  <span className="font-bold text-emerald-900">Bệnh nhân Xơ nang (Cystic Fibrosis - Kèm khí dung dự phòng)</span>
                </label>
              </div>
            )}

            {/* Whitmore (Burkholderia pseudomallei) */}
            {targetedReq.pathogenId.includes('pseudomallei') && (
              <div className="space-y-2 text-xs p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                <div className="font-bold border-b border-amber-200 pb-1">Phân tầng giai đoạn tấn công Whitmore:</div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.multilobar} onChange={(e) => onUpdateTargeted({ ...targetedReq, multilobar: e.target.checked })} className="w-4 h-4 rounded text-amber-600" />
                  <span>Tổn thương mờ nhiều thùy phổi trên X-quang</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.isBacteremia} onChange={(e) => onUpdateTargeted({ ...targetedReq, isBacteremia: e.target.checked })} className="w-4 h-4 rounded text-amber-600" />
                  <span>Có Nhiễm khuẩn huyết (Cấy máu +)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.hasArthritisAbscess} onChange={(e) => onUpdateTargeted({ ...targetedReq, hasArthritisAbscess: e.target.checked })} className="w-4 h-4 rounded text-amber-600" />
                  <span>Kèm Viêm khớp nhiễm khuẩn / Áp xe đa cơ quan (Tấn công 4 tuần)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.hasOsteomyelitis} onChange={(e) => onUpdateTargeted({ ...targetedReq, hasOsteomyelitis: e.target.checked })} className="w-4 h-4 rounded text-amber-600" />
                  <span>Kèm Viêm tủy xương (Tấn công 6 tuần)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.isPregnant} onChange={(e) => onUpdateTargeted({ ...targetedReq, isPregnant: e.target.checked })} className="w-4 h-4 rounded text-rose-600" />
                  <span>Phụ nữ có thai (Duy trì bằng Augmentin thay vì Cotrimoxazole)</span>
                </label>
              </div>
            )}

            {/* Virus */}
            {targetedReq.pathogenId.includes('virus') && (
              <div className="space-y-2 text-xs p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={!!targetedReq.cannotSwallow} onChange={(e) => onUpdateTargeted({ ...targetedReq, cannotSwallow: e.target.checked })} className="w-4 h-4 rounded text-indigo-600" />
                  <span>Bệnh nhân không thể uống / nôn nhiều</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={targetedReq.crclGt60 ?? true} onChange={(e) => onUpdateTargeted({ ...targetedReq, crclGt60: e.target.checked })} className="w-4 h-4 rounded text-indigo-600" />
                  <span>CrCl &gt; 60 mL/phút (Chỉ định Peramivir 600mg IV liều duy nhất)</span>
                </label>
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
                <div className="text-xs text-indigo-200 pt-2 border-t border-white/10 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-300" />
                  <span><strong>Thời gian điều trị:</strong> {targetedRes.duration}</span>
                </div>
              )}

              {targetedRes?.dosageAndAdministration && (
                <div className="text-xs text-indigo-100 bg-white/5 p-3 rounded-xl border border-white/10">
                  <strong>Hướng dẫn dùng thuốc:</strong> {targetedRes.dosageAndAdministration}
                </div>
              )}

              {/* Aerosol Prophylaxis */}
              {targetedRes?.aerosolProphylaxis && targetedRes.aerosolProphylaxis.length > 0 && (
                <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/30 text-xs space-y-1.5">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-emerald-400" />
                    Khí Dung Dự Phòng Cho Bệnh Nhân Xơ Nang (Cystic Fibrosis):
                  </div>
                  <ul className="list-disc list-inside text-emerald-200 space-y-0.5 text-[11px]">
                    {targetedRes.aerosolProphylaxis.map((ae, idx) => (
                      <li key={idx}>{ae}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Warnings */}
            {targetedRes?.monitoringAndWarnings && targetedRes.monitoringAndWarnings.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Lưu ý & Cảnh Báo Lâm Sàng
                </div>
                <ul className="list-disc list-inside text-amber-950 space-y-1">
                  {targetedRes.monitoringAndWarnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ORAL STEP-DOWN (7/7 CRITERIA) */}
      {activeTab === 'oral' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              7 Tiêu Chuẩn Ổn Định Lâm Sàng Để Chuyển Kháng Sinh Uống
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">1. Thân nhiệt (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={oralReq.temp}
                    onChange={(e) => onUpdateOral({ ...oralReq, temp: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Mục tiêu: ≤ 37.8°C trong 24h</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">2. Nhịp tim (lần/phút)</label>
                  <input
                    type="number"
                    value={oralReq.hr}
                    onChange={(e) => onUpdateOral({ ...oralReq, hr: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Mục tiêu: ≤ 100 lần/phút</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">3. Nhịp thở (lần/phút)</label>
                  <input
                    type="number"
                    value={oralReq.rr}
                    onChange={(e) => onUpdateOral({ ...oralReq, rr: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Mục tiêu: ≤ 24 lần/phút</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">4. HA tâm thu (mmHg)</label>
                  <input
                    type="number"
                    value={oralReq.sbp}
                    onChange={(e) => onUpdateOral({ ...oralReq, sbp: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Mục tiêu: ≥ 90 mmHg</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">5. SpO2 khí phòng (%)</label>
                <input
                  type="number"
                  value={oralReq.spo2}
                  onChange={(e) => onUpdateOral({ ...oralReq, spo2: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500">Mục tiêu: ≥ 90% khi thở khí phòng</span>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 p-2.5 rounded-lg border">
                  <input
                    type="checkbox"
                    checked={oralReq.canEatAndSwallow}
                    onChange={(e) => onUpdateOral({ ...oralReq, canEatAndSwallow: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">6. Bệnh nhân có khả năng ăn uống và dung nạp thuốc đường tiêu hóa</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 p-2.5 rounded-lg border">
                  <input
                    type="checkbox"
                    checked={oralReq.normalMentalStatus}
                    onChange={(e) => onUpdateOral({ ...oralReq, normalMentalStatus: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">7. Tình trạng tâm thần / tri giác hoàn toàn bình thường</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              Kết Quả Đánh Giá Xuống Thang Uống
            </h3>

            <div className={`p-5 rounded-2xl border ${
              oralRes?.eligible
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center space-x-3">
                {oralRes?.eligible ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-amber-600 shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-base">
                    {oralRes?.eligible ? 'ĐỦ ĐIỀU KIỆN CHUYỂN UỐNG (7/7 Tiêu chí)' : `CHƯA ĐỦ ĐIỀU KIỆN (${oralRes?.metCriteriaCount ?? 0}/7 Tiêu chí)`}
                  </h4>
                  <p className="text-xs mt-0.5">{oralRes?.clinicalGuidance}</p>
                </div>
              </div>
            </div>

            {/* Checklist Details */}
            <div className="space-y-1.5 text-xs">
              <h5 className="font-bold text-slate-700">Chi tiết 7 tiêu chuẩn lâm sàng:</h5>
              {oralRes?.criteriaDetails?.map((cd, idx) => (
                <div key={idx} className={`p-2 rounded-lg border text-[11px] ${
                  cd.includes('[ĐẠT]') ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 font-medium' : 'bg-rose-50/50 border-rose-200 text-rose-900 font-medium'
                }`}>
                  {cd}
                </div>
              ))}
            </div>

            {/* Suggested Oral Regimens */}
            {oralRes?.eligible && oralRes.suggestedOralRegimens && oralRes.suggestedOralRegimens.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Gợi Ý Phác Đồ Kháng Sinh Đường Uống Xuất Viện:
                </h5>
                <ul className="space-y-1 text-slate-700">
                  {oralRes.suggestedOralRegimens.map((reg, idx) => (
                    <li key={idx} className="p-2 bg-white rounded border border-slate-200">
                      {reg}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: 72H TREATMENT RESPONSE & PCT KINETICS */}
      {activeTab === 'response72' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              Dấu Hiệu Lâm Sàng & Động Học Procalcitonin Sau 72H
            </h3>

            {/* PCT Inputs */}
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-3">
              <h4 className="text-xs font-bold text-indigo-950 uppercase">Động học Procalcitonin (PCT - ng/mL)</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-indigo-900 font-semibold mb-1">D0 (Nhập viện)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={response72Req.pctD0 ?? ''}
                    onChange={(e) => onUpdate72h({ ...response72Req, pctD0: parseFloat(e.target.value) || undefined })}
                    className="w-full bg-white border border-indigo-300 rounded p-2 text-sm font-bold"
                    placeholder="VD: 5.0"
                  />
                </div>
                <div>
                  <label className="block text-indigo-900 font-semibold mb-1">D3 (Sau 72h)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={response72Req.pctD3 ?? ''}
                    onChange={(e) => onUpdate72h({ ...response72Req, pctD3: parseFloat(e.target.value) || undefined })}
                    className="w-full bg-white border border-indigo-300 rounded p-2 text-sm font-bold"
                    placeholder="VD: 0.8"
                  />
                </div>
                <div>
                  <label className="block text-indigo-900 font-semibold mb-1">D5-D7</label>
                  <input
                    type="number"
                    step="0.1"
                    value={response72Req.pctD5D7 ?? ''}
                    onChange={(e) => onUpdate72h({ ...response72Req, pctD5D7: parseFloat(e.target.value) || undefined })}
                    className="w-full bg-white border border-indigo-300 rounded p-2 text-sm font-bold"
                    placeholder="VD: 0.2"
                  />
                </div>
              </div>
            </div>

            {/* Failure Triggers */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-rose-900">Dấu hiệu diễn tiến xấu / Thất bại điều trị:</h4>
              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!response72Req.hrGt125OrRrGt33}
                  onChange={(e) => onUpdate72h({ ...response72Req, hrGt125OrRrGt33: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span>Mạch &gt; 125 lần/phút hoặc Nhịp thở &gt; 33 lần/phút</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!response72Req.bpLt9060}
                  onChange={(e) => onUpdate72h({ ...response72Req, bpLt9060: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span>Huyết áp tụt &lt; 90/60 mmHg (cần bù dịch hoặc vận mạch)</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!response72Req.imagingWorsening}
                  onChange={(e) => onUpdate72h({ ...response72Req, imagingWorsening: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span>Hình ảnh học X-quang/CT xấu đi: Tăng kích thước tổn thương cũ hoặc có tổn thương mới</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!response72Req.atsScoreIncreased}
                  onChange={(e) => onUpdate72h({ ...response72Req, atsScoreIncreased: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span>Tăng thang điểm ATS (xuất hiện thêm tiêu chuẩn nặng)</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!response72Req.respFailureWorsening}
                  onChange={(e) => onUpdate72h({ ...response72Req, respFailureWorsening: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span>Suy hô hấp tiến triển (PaO2 &lt; 60 mmHg hoặc SpO2 &lt; 90% ở FiO2 21%)</span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              Kết Luận Đánh Giá 72H & Hướng Xử Trí
            </h3>

            <div className={`p-5 rounded-2xl border ${
              response72Res?.isTreatmentFailure
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <h4 className="font-bold text-base flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {response72Res?.responseStatus || 'ĐÁP ỨNG ĐIỀU TRỊ'}
              </h4>
              <p className="text-xs mt-1 font-medium">{response72Res?.pctKineticsInterpretation}</p>
            </div>

            {/* Recommended Actions */}
            {response72Res?.recommendedActions && response72Res.recommendedActions.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h5 className="font-bold text-slate-800">Khuyến nghị xử trí lâm sàng:</h5>
                <ul className="space-y-1.5 text-slate-700">
                  {response72Res.recommendedActions.map((act, idx) => (
                    <li key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 leading-relaxed font-medium">
                      {act}
                    </li>
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
