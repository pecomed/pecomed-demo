import React from 'react';
import { Step1Request, SeverityAssessmentResult } from '../types/cdss';
import { AlertTriangle, CheckCircle, Info, ChevronRight, Activity, Thermometer, Stethoscope, Droplets, Heart } from 'lucide-react';

interface Step1Props {
  requestData: Step1Request;
  result: SeverityAssessmentResult | null;
  onChange: (updated: Step1Request) => void;
  onNext: () => void;
}

export const Step1Severity: React.FC<Step1Props> = ({
  requestData,
  result,
  onChange,
  onNext
}) => {
  const updateVitals = (key: string, val: any) => {
    onChange({
      ...requestData,
      vitals: { ...requestData.vitals, [key]: val }
    });
  };

  const updateLabs = (key: string, val: any) => {
    onChange({
      ...requestData,
      labs: { ...requestData.labs, [key]: val }
    });
  };

  const updateComorb = (key: string, val: boolean) => {
    onChange({
      ...requestData,
      comorbidities: { ...requestData.comorbidities, [key]: val }
    });
  };

  const updateImaging = (key: string, val: boolean) => {
    onChange({
      ...requestData,
      imaging: { ...requestData.imaging, [key]: val }
    });
  };

  const vitals = requestData.vitals || {};
  const labs = requestData.labs || {};
  const comorb = requestData.comorbidities || {};
  const imaging = requestData.imaging || {};

  return (
    <div className="space-y-6">
      
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            Bước 1: Đánh Giá & Phân Tầng Mức Độ Nặng Viêm Phổi (CAP)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp thang điểm CURB-65, CRB-65, PSI/PORT, SMART-COP và Tiêu chuẩn ATS/IDSA 2007 để quyết định nơi điều trị tối ưu.
          </p>
        </div>
        <button
          onClick={onNext}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 shrink-0"
        >
          <span>Sang Bước 2: Căn Nguyên</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Inputs on Left (7 cols), Realtime Scoring on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Clinical Inputs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Demographics & Vital Signs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              1. Thông Tin Chung & Dấu Hiệu Sinh Tồn (Vitals)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tuổi (năm)</label>
                <input
                  type="number"
                  value={requestData.age || ''}
                  onChange={(e) => onChange({ ...requestData, age: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: 65"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
                <select
                  value={requestData.gender}
                  onChange={(e) => onChange({ ...requestData, gender: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              </div>

              {/* Respiratory Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nhịp thở (lần/phút)</label>
                <input
                  type="number"
                  value={vitals.respiratoryRate ?? ''}
                  onChange={(e) => updateVitals('respiratoryRate', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: 24"
                />
              </div>

              {/* Systolic BP */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">HA Tâm thu (mmHg)</label>
                <input
                  type="number"
                  value={vitals.systolicBp ?? ''}
                  onChange={(e) => updateVitals('systolicBp', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: 120"
                />
              </div>

              {/* Diastolic BP */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">HA Tâm trương (mmHg)</label>
                <input
                  type="number"
                  value={vitals.diastolicBp ?? ''}
                  onChange={(e) => updateVitals('diastolicBp', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: 80"
                />
              </div>

              {/* Heart Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mạch (nhịp/phút)</label>
                <input
                  type="number"
                  value={vitals.heartRate ?? ''}
                  onChange={(e) => updateVitals('heartRate', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: 90"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thân nhiệt (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperature ?? ''}
                  onChange={(e) => updateVitals('temperature', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: 38.5"
                />
              </div>

              {/* SpO2 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SpO2 (%)</label>
                <input
                  type="number"
                  value={vitals.spo2 ?? ''}
                  onChange={(e) => updateVitals('spo2', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: 95"
                />
              </div>
            </div>

            {/* Checkbox Triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <label className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-blue-50/50">
                <input
                  type="checkbox"
                  checked={!!vitals.alteredMentalStatus}
                  onChange={(e) => updateVitals('alteredMentalStatus', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-medium text-rose-700">Rối loạn ý thức / Lú lẫn (Confusion)</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-blue-50/50">
                <input
                  type="checkbox"
                  checked={!!vitals.onAggressiveFluidResuscitation}
                  onChange={(e) => updateVitals('onAggressiveFluidResuscitation', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-medium text-rose-700">Tụt HA cần bù dịch tích cực / Vận mạch</span>
              </label>
            </div>
          </div>

          {/* Section 2: Laboratory Tests */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <Droplets className="w-4 h-4 text-indigo-600" />
              2. Xét Nghiệm Cận Lâm Sàng & Khí Máu (Labs)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ure máu (mmol/L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={labs.ureaMmolL ?? ''}
                  onChange={(e) => updateLabs('ureaMmolL', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="> 7.0 (CURB-65)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bạch cầu WBC (G/L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={labs.wbcGL ?? ''}
                  onChange={(e) => updateLabs('wbcGL', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="VD: 12.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiểu cầu PLT (G/L)</label>
                <input
                  type="number"
                  value={labs.plateletsGL ?? ''}
                  onChange={(e) => updateLabs('plateletsGL', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="< 100 (ATS)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">pH máu động mạch</label>
                <input
                  type="number"
                  step="0.01"
                  value={labs.arterialPh ?? ''}
                  onChange={(e) => updateLabs('arterialPh', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="< 7.35 (PSI)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PaO2 / FiO2</label>
                <input
                  type="number"
                  value={labs.pao2Fio2Ratio ?? ''}
                  onChange={(e) => updateLabs('pao2Fio2Ratio', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="≤ 250 (ATS)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Albumin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={labs.albuminGDl ?? ''}
                  onChange={(e) => updateLabs('albuminGDl', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="< 3.5 (SMART-COP)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Natri Na+ (mmol/L)</label>
                <input
                  type="number"
                  value={labs.sodiumMmolL ?? ''}
                  onChange={(e) => updateLabs('sodiumMmolL', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="< 130 (PSI)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Glucose (mmol/L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={labs.glucoseMmolL ?? ''}
                  onChange={(e) => updateLabs('glucoseMmolL', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="≥ 14.0 (PSI)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hematocrit Hct (%)</label>
                <input
                  type="number"
                  value={labs.hematocritPct ?? ''}
                  onChange={(e) => updateLabs('hematocritPct', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="< 30% (PSI)"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Comorbidities & Imaging */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
              <Heart className="w-4 h-4 text-rose-600" />
              3. Bệnh Đồng Mắc & Hình Ảnh X-quang / CT Ngực
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!comorb.copdChronicLung} onChange={(e) => updateComorb('copdChronicLung', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span>Bệnh phổi mạn tính / COPD</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!comorb.diabetes} onChange={(e) => updateComorb('diabetes', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span>Đái tháo đường</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!comorb.congestiveHeartFailure} onChange={(e) => updateComorb('congestiveHeartFailure', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span>Suy tim xung huyết (+10 PSI)</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!comorb.cerebrovascularDisease} onChange={(e) => updateComorb('cerebrovascularDisease', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span>Bệnh mạch máu não / Đột quỵ (+10 PSI)</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!comorb.renalDisease} onChange={(e) => updateComorb('renalDisease', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span>Bệnh thận mạn (+10 PSI)</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!comorb.liverDisease} onChange={(e) => updateComorb('liverDisease', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span>Bệnh gan mạn (+20 PSI)</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!comorb.neoplasm} onChange={(e) => updateComorb('neoplasm', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span>Bệnh ác tính / Ung thư (+30 PSI)</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" checked={!!comorb.nursingHomeResident} onChange={(e) => updateComorb('nursingHomeResident', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                <span>Ở viện dưỡng lão (+10 PSI)</span>
              </label>
            </div>

            {/* Imaging & Invasive criteria */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center space-x-2 bg-rose-50/80 p-2.5 rounded-lg border border-rose-200 cursor-pointer hover:bg-rose-100/70">
                <input type="checkbox" checked={!!imaging.multilobarInfiltrates} onChange={(e) => updateImaging('multilobarInfiltrates', e.target.checked)} className="w-4 h-4 text-rose-600 rounded" />
                <span className="font-semibold text-rose-800">Tổn thương thâm nhiễm nhiều thùy (Multilobar)</span>
              </label>

              <label className="flex items-center space-x-2 bg-rose-50/80 p-2.5 rounded-lg border border-rose-200 cursor-pointer hover:bg-rose-100/70">
                <input type="checkbox" checked={!!imaging.pleuralEffusion} onChange={(e) => updateImaging('pleuralEffusion', e.target.checked)} className="w-4 h-4 text-rose-600 rounded" />
                <span className="font-semibold text-rose-800">Tràn dịch màng phổi (+10 PSI)</span>
              </label>

              <label className="flex items-center space-x-2 bg-rose-100 p-2.5 rounded-lg border border-rose-300 cursor-pointer hover:bg-rose-200/80">
                <input type="checkbox" checked={!!imaging.mechanicalVentilation} onChange={(e) => updateImaging('mechanicalVentilation', e.target.checked)} className="w-4 h-4 text-rose-700 rounded" />
                <span className="font-bold text-rose-900">Suy hô hấp cần thở máy xâm nhập (Tiêu chuẩn chính ATS)</span>
              </label>

              <label className="flex items-center space-x-2 bg-rose-100 p-2.5 rounded-lg border border-rose-300 cursor-pointer hover:bg-rose-200/80">
                <input type="checkbox" checked={!!imaging.septicShockVasopressors} onChange={(e) => updateImaging('septicShockVasopressors', e.target.checked)} className="w-4 h-4 text-rose-700 rounded" />
                <span className="font-bold text-rose-900">Sốc nhiễm khuẩn cần dùng vận mạch (Tiêu chuẩn chính ATS)</span>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Realtime Scoring Results */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Triage Decision Card */}
          <div className={`p-6 rounded-2xl border shadow-md ${
            result?.recommendedCareSetting?.includes('ICU')
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : result?.recommendedCareSetting?.includes('Nội trú')
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <span className="text-xs uppercase tracking-widest font-bold opacity-75">
              Quyết Định Phân Tầng Nơi Điều Trị
            </span>
            <h3 className="text-2xl font-black mt-1">
              {result?.recommendedCareSetting || 'Chưa tính toán'}
            </h3>
            <div className="mt-2 text-xs font-semibold">
              Mức độ nặng: <span className="underline">{result?.severityLevel || 'N/A'}</span>
            </div>

            {result?.clinicalNotes && result.clinicalNotes.length > 0 && (
              <p className="mt-3 text-xs leading-relaxed opacity-90 border-t border-current/20 pt-2.5">
                {result.clinicalNotes[0]}
              </p>
            )}
          </div>

          {/* Detailed Scores Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
              Chi Tiết Các Thang Điểm Tiên Lượng
            </h4>

            {/* CURB-65 & CRB-65 */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-800">CURB-65 / CRB-65</div>
                <div className="text-[11px] text-slate-500">
                  {result?.curb65Score !== undefined ? `CURB: ${result.curb65Score}/5 | CRB: ${result.crb65Score}/4` : '--'}
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${
                (result?.curb65Score ?? 0) >= 3 ? 'bg-rose-100 text-rose-800' :
                (result?.curb65Score ?? 0) === 2 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {result?.curb65Score ?? 0} Điểm
              </span>
            </div>

            {/* PSI / PORT Score */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-800">PSI / PORT Score</div>
                <div className="text-[11px] text-slate-500">
                  {result?.psiClass || 'Chưa phân tầng'}
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${
                (result?.psiScore ?? 0) > 130 ? 'bg-rose-100 text-rose-800' :
                (result?.psiScore ?? 0) >= 71 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {result?.psiScore ?? 0} Điểm
              </span>
            </div>

            {/* SMART-COP Score */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-800">SMART-COP (Dự đoán cần Hỗ trợ hô hấp/Vận mạch)</div>
                <div className="text-[11px] text-slate-500">
                  {result?.smartCopRisk || 'Chưa đánh giá'}
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${
                (result?.smartCopScore ?? 0) >= 5 ? 'bg-rose-100 text-rose-800' :
                (result?.smartCopScore ?? 0) >= 3 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {result?.smartCopScore ?? 0} Điểm
              </span>
            </div>

            {/* ATS / IDSA 2007 Severe CAP Criteria */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800">Tiêu Chuẩn ATS / IDSA 2007 (ICU)</div>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                  result?.atsSevereCap ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {result?.atsSevereCap ? 'VIÊM PHỔI NẶNG (ICU)' : 'Không thỏa'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Tiêu chuẩn chính: <strong>{result?.atsMajorCount ?? 0}/2</strong> | Tiêu chuẩn phụ: <strong>{result?.atsMinorCount ?? 0}/9</strong>
              </div>
            </div>
          </div>

          {/* Routine Lab Orders Guidance */}
          {result?.routineLabOrders && result.routineLabOrders.length > 0 && (
            <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 text-xs space-y-2">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-700" />
                Chỉ Định Cận Lâm Sàng Thường Quy Đề Xuất
              </div>
              <ul className="space-y-1 text-blue-950 leading-relaxed list-disc list-inside">
                {result.routineLabOrders.map((order, idx) => (
                  <li key={idx}>{order}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
