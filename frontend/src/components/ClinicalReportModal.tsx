import React from 'react';
import { X, Printer, Copy, Check, FileText } from 'lucide-react';
import {
  Step1Request,
  SeverityAssessmentResult,
  PathogenEngineResult,
  ExclusionAssessmentResult,
  EmpiricalRegimenResult,
  TargetedRegimenResult,
  OralStepDownResult,
  TreatmentResponse72hResult
} from '../types/cdss';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  step1Req: Step1Request;
  step1Res: SeverityAssessmentResult | null;
  step2Res: PathogenEngineResult | null;
  step3Res: ExclusionAssessmentResult | null;
  step4Res: EmpiricalRegimenResult | null;
  step5Targeted: TargetedRegimenResult | null;
  oralStepDown: OralStepDownResult | null;
  response72: TreatmentResponse72hResult | null;
}

export const ClinicalReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  step1Req,
  step1Res,
  step2Res,
  step3Res,
  step4Res,
  step5Targeted,
  oralStepDown,
  response72
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const now = new Date().toLocaleString('vi-VN');

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = document.getElementById('report-printable-area')?.innerText || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-base">Báo Cáo Khuyến Cáo Lâm Sàng Tổng Hợp (CDSS Report)</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã Sao Chép' : 'Sao Chép'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Báo Cáo</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content Body */}
        <div id="report-printable-area" className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed">
          
          {/* Hospital Header Banner */}
          <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
            <h1 className="text-lg font-black tracking-wide uppercase text-blue-950">
              HỆ THỐNG HỖ TRỢ RA QUYẾT ĐỊNH ĐIỀU TRỊ VIÊM PHỔI MẮC PHẢI CỘNG ĐỒNG
            </h1>
            <p className="text-[11px] text-slate-500">
              PECOMED CAP CDSS v1.0 • Thời gian kết xuất: {now}
            </p>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div><strong>Tuổi:</strong> {step1Req.age} tuổi</div>
            <div><strong>Giới tính:</strong> {step1Req.gender === 'MALE' ? 'Nam' : 'Nữ'}</div>
            <div><strong>Nơi điều trị khuyến nghị:</strong> <span className="font-bold text-blue-700">{step1Res?.recommendedCareSetting || 'Ngoại trú'}</span></div>
          </div>

          {/* Section 1: Severity Assessment */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b pb-1">
              1. Kết Quả Phân Tầng Mức Độ Nặng (Step 1)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border"><strong>CURB-65:</strong> {step1Res?.curb65Score ?? 0}/5 điểm</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border"><strong>CRB-65:</strong> {step1Res?.crb65Score ?? 0}/4 điểm</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border"><strong>PSI/PORT:</strong> {step1Res?.psiScore ?? 0} ({step1Res?.psiClass})</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border"><strong>SMART-COP:</strong> {step1Res?.smartCopScore ?? 0} điểm</div>
            </div>
            {step1Res?.atsSevereCap && (
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-900 font-bold rounded-lg">
                ⚠️ Thỏa tiêu chuẩn Viêm phổi nặng theo ATS/IDSA 2007 (Chỉ định ICU).
              </div>
            )}
          </div>

          {/* Section 2: Pathogen Risk */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b pb-1">
              2. Đánh Giá Nguy Cơ Căn Nguyên & Vi Khuẩn Đa Kháng (Step 2)
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Nguy cơ Pseudomonas aeruginosa: <strong>{step2Res?.pseudomonasRisk ? 'CÓ (Cao)' : 'Không'}</strong></li>
              <li>Nguy cơ tụ cầu vàng MRSA: <strong>{step2Res?.mrsaRisk ? 'CÓ (Cao)' : 'Không'}</strong></li>
              <li>Nguy cơ trực khuẩn sinh ESBL: <strong>{step2Res?.esblRisk ? 'CÓ (Cần bao phủ)' : 'Không'}</strong></li>
              <li>Nguy cơ Burkholderia pseudomallei (Whitmore): <strong>{step2Res?.melioidosisRisk ? 'CÓ (Cần phác đồ Whitmore)' : 'Không'}</strong></li>
            </ul>
          </div>

          {/* Section 3: Safety & Contraindications */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b pb-1">
              3. Rà Soát Chống Chỉ Định & Hiệu Chỉnh Liều (Step 3)
            </h2>
            <div><strong>Kháng sinh chống chỉ định:</strong> {step3Res?.contraindicatedDrugs?.join(', ') || 'Không có'}</div>
            <div><strong>Hiệu chỉnh theo chức năng thận (CrCl):</strong> {step3Res?.renalDoseAdjustmentRequired ? `Bắt buộc hiệu chỉnh (CrCl = ${step3Res.crclMlMin || '<50'} mL/phút)` : 'Dùng liều chuẩn'}</div>
          </div>

          {/* Section 4: Empirical Regimen */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b pb-1">
              4. Phác Đồ Kháng Sinh Kinh Nghiệm Khuyến Nghị (Step 4)
            </h2>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <div>
                <strong>Tiêu đề phác đồ:</strong> <span className="font-bold text-blue-900">{step4Res?.regimenTitle}</span>
              </div>
              {step4Res?.primaryRegimen && step4Res.primaryRegimen.length > 0 && (
                <div>
                  <strong>Phác đồ ưu tiên:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {step4Res.primaryRegimen.map((ab, idx) => (
                      <li key={idx}><strong>{ab.name}:</strong> {ab.dose} ({ab.route})</li>
                    ))}
                  </ul>
                </div>
              )}
              {step4Res?.alternativeRegimen && step4Res.alternativeRegimen.length > 0 && (
                <div>
                  <strong>Phác đồ thay thế:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {step4Res.alternativeRegimen.map((ab, idx) => (
                      <li key={idx}><strong>{ab.name}:</strong> {ab.dose} ({ab.route})</li>
                    ))}
                  </ul>
                </div>
              )}
              {step4Res?.addOns && step4Res.addOns.length > 0 && (
                <div>
                  <strong>Thuốc bổ sung (MRSA/Kháng virus):</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {step4Res.addOns.map((ab, idx) => (
                      <li key={idx}><strong>{ab.name}:</strong> {ab.dose} ({ab.route})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Targeted & Step-down */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b pb-1">
              5. Hướng Dẫn Vi Sinh Đích & Xuống Thang Uống (Step 5)
            </h2>
            {step5Targeted && (
              <div><strong>Kháng sinh nhắm trúng đích ({step5Targeted.pathogenName}):</strong> {step5Targeted.targetedAntibiotics?.join(' HOẶC ')}</div>
            )}
            {oralStepDown && (
              <div><strong>Xuống thang kháng sinh uống:</strong> {oralStepDown.eligible ? 'ĐỦ ĐIỀU KIỆN' : `Chưa đủ điều kiện (${oralStepDown.metCriteriaCount}/7 tiêu chí)`}</div>
            )}
            {response72 && (
              <div><strong>Đáp ứng sau 72h:</strong> {response72.responseStatus} ({response72.pctKineticsInterpretation})</div>
            )}
          </div>

          {/* Signature Signoff */}
          <div className="pt-8 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="font-bold">BÁC SĨ ĐIỀU TRỊ</p>
              <p className="text-[11px] text-slate-400 mt-12">(Ký và ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-bold">DƯỢC SĨ LÂM SÀNG</p>
              <p className="text-[11px] text-slate-400 mt-12">(Ký và ghi rõ họ tên)</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
