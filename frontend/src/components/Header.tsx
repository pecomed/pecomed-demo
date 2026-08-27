import React from 'react';
import { Activity, RotateCcw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { PatientCase } from '../types/cdss';

interface HeaderProps {
  isBackendConnected: boolean;
  onReset: () => void;
  onLoadCase: (preset: PatientCase) => void;
  onOpenReport: () => void;
}

export const sampleCases: { name: string; caseData: PatientCase }[] = [
  {
    name: 'Ca 1: Ngoại trú (Nhẹ - CURB=0, PSI II)',
    caseData: {
      patientId: 'BN-NGOAITRU-01',
      age: 45,
      gender: 'MALE',
      vitals: { respiratoryRate: 20, systolicBp: 125, diastolicBp: 80, heartRate: 82, temperature: 38.2, spo2: 97, alteredMentalStatus: false },
      comorbidities: { diabetes: false, copdChronicLung: false, congestiveHeartFailure: false, renalDisease: false },
      labs: { ureaMmolL: 4.8, wbcGL: 9.2, arterialPh: 7.4 },
      imaging: { multilobarInfiltrates: false, pleuralEffusion: false, mechanicalVentilation: false, septicShockVasopressors: false },
      symptoms: { fever: 38.2, coughWithSputum: true, dyspnea: false },
      riskProfile: {},
      exclusionTriggers: { hasSevereRenalFailure: false, crclMlMin: 90 }
    }
  },
  {
    name: 'Ca 2: Nội trú (Trung bình - CURB=2, PSI IV)',
    caseData: {
      patientId: 'BN-NOITRU-02',
      age: 72,
      gender: 'MALE',
      vitals: { respiratoryRate: 30, systolicBp: 110, diastolicBp: 70, heartRate: 98, temperature: 38.8, spo2: 92, alteredMentalStatus: false },
      comorbidities: { copdChronicLung: true, diabetes: true, congestiveHeartFailure: false },
      labs: { ureaMmolL: 8.5, wbcGL: 14.5, arterialPh: 7.36, albuminGDl: 3.2 },
      imaging: { multilobarInfiltrates: false, pleuralEffusion: true, mechanicalVentilation: false, septicShockVasopressors: false },
      symptoms: { fever: 38.8, coughWithSputum: true, pleuriticChestPain: true, dyspnea: true },
      riskProfile: { frequentCopdExacerbationsSteroids: true, recentIvAntibiotics90d: true },
      exclusionTriggers: { crclMlMin: 55 }
    }
  },
  {
    name: 'Ca 3: Hồi sức ICU (Nặng / Sốc nhiễm khuẩn)',
    caseData: {
      patientId: 'BN-ICU-03',
      age: 68,
      gender: 'FEMALE',
      vitals: { respiratoryRate: 34, systolicBp: 80, diastolicBp: 50, heartRate: 130, temperature: 39.4, spo2: 84, alteredMentalStatus: true, onAggressiveFluidResuscitation: true },
      comorbidities: { neoplasm: false, renalDisease: true, diabetes: true, immunocompromised: false },
      labs: { ureaMmolL: 14.8, arterialPh: 7.28, sodiumMmolL: 128, wbcGL: 22.0, plateletsGL: 85, pao2Fio2Ratio: 160, albuminGDl: 2.8 },
      imaging: { multilobarInfiltrates: true, pleuralEffusion: true, mechanicalVentilation: true, septicShockVasopressors: true },
      symptoms: { fever: 39.4, dyspnea: true },
      riskProfile: { priorPseudomonasIsolation: true, recentHospitalization90d: true, priorMrsaIsolation: true },
      exclusionTriggers: { hasSevereRenalFailure: true, crclMlMin: 25 }
    }
  },
  {
    name: 'Ca 4: Whitmore (Nhiễm B. pseudomallei)',
    caseData: {
      patientId: 'BN-WHITMORE-04',
      age: 56,
      gender: 'MALE',
      vitals: { respiratoryRate: 26, systolicBp: 105, diastolicBp: 65, heartRate: 104, temperature: 39.8, spo2: 93 },
      comorbidities: { diabetes: true, liverDisease: true },
      labs: { ureaMmolL: 7.5, wbcGL: 18.0, albuminGDl: 3.0 },
      imaging: { multilobarInfiltrates: true, pleuralEffusion: false },
      symptoms: { fever: 39.8, coughWithSputum: true, dyspnea: true },
      riskProfile: { diabetesMellitusChronicLiverRenal: true, exposureSoilWaterFlooding: true, recentTravelEndemicMelioidosis: true },
      exclusionTriggers: { crclMlMin: 70 }
    }
  }
];

export const Header: React.FC<HeaderProps> = ({
  isBackendConnected,
  onReset,
  onLoadCase,
  onOpenReport
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-md flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  PECOMED
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                  CAP CDSS v1.0
                </span>
              </div>
              <p className="text-xs text-blue-200/80 font-medium">
                Hệ Thống Hỗ Trợ Quyết Định Lâm Sàng Viêm Phổi Mắc Phải Cộng Đồng
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Backend Status Indicator */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
              isBackendConnected
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/40'
            }`}>
              {isBackendConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>REST API Java Online</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chế độ Offline Engine</span>
                </>
              )}
            </div>

            {/* Preset Selector */}
            <select
              onChange={(e) => {
                const idx = parseInt(e.target.value);
                if (!isNaN(idx) && sampleCases[idx]) {
                  onLoadCase(sampleCases[idx].caseData);
                }
              }}
              defaultValue=""
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 hover:bg-slate-750 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="" disabled>📋 Nạp Ca Bệnh Mẫu...</option>
              {sampleCases.map((c, i) => (
                <option key={i} value={i} className="bg-slate-800 text-slate-100">
                  {c.name}
                </option>
              ))}
            </select>

            {/* Medical Report Modal Trigger */}
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Báo Cáo Y Khoa</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
              title="Đặt lại toàn bộ dữ liệu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
