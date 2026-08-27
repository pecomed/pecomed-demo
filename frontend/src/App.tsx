import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { StepNavigation } from './components/StepNavigation';
import { Step1Severity } from './components/Step1Severity';
import { Step2Pathogen } from './components/Step2Pathogen';
import { Step3Exclusion } from './components/Step3Exclusion';
import { Step4Empirical } from './components/Step4Empirical';
import { Step5Targeted } from './components/Step5Targeted';
import { ClinicalReportModal } from './components/ClinicalReportModal';

import {
  Step1Request,
  SeverityAssessmentResult,
  ClinicalRiskProfile,
  PathogenEngineResult,
  ExclusionRiskTriggers,
  ExclusionAssessmentResult,
  EmpiricalRegimenResult,
  Step5TargetedRequest,
  TargetedRegimenResult,
  OralStepDownRequest,
  OralStepDownResult,
  Response72hRequest,
  TreatmentResponse72hResult,
  CareSetting,
  PatientCase
} from './types/cdss';

import {
  checkHealth,
  evaluateStep1Severity,
  evaluateStep2Pathogen,
  evaluateStep3Exclusion,
  evaluateStep4Empirical,
  evaluateStep5Targeted,
  evaluateStep5OralStepDown,
  evaluateStep5Response72h
} from './services/api';

const defaultStep1: Step1Request = {
  age: 65,
  gender: 'MALE',
  vitals: {
    respiratoryRate: 22,
    systolicBp: 120,
    diastolicBp: 80,
    heartRate: 88,
    temperature: 38.5,
    spo2: 96,
    alteredMentalStatus: false,
    onAggressiveFluidResuscitation: false
  },
  comorbidities: {
    copdChronicLung: false,
    diabetes: false,
    congestiveHeartFailure: false,
    cerebrovascularDisease: false,
    renalDisease: false,
    liverDisease: false,
    neoplasm: false,
    nursingHomeResident: false
  },
  labs: {
    ureaMmolL: 5.5,
    wbcGL: 10.5,
    plateletsGL: 210,
    arterialPh: 7.4,
    sodiumMmolL: 138,
    glucoseMmolL: 6.0,
    hematocritPct: 42,
    pao2Fio2Ratio: 350,
    albuminGDl: 4.0
  },
  imaging: {
    multilobarInfiltrates: false,
    pleuralEffusion: false,
    mechanicalVentilation: false,
    septicShockVasopressors: false
  },
  symptoms: {
    fever: 38.5,
    coughWithSputum: true,
    dyspnea: false
  }
};

const defaultRisk: ClinicalRiskProfile = {};
const defaultTriggers: ExclusionRiskTriggers = { crclMlMin: 85 };
const defaultTargeted: Step5TargetedRequest = { pathogenId: 'streptococcus_pneumoniae', micPenicillin: 1.0 };
const defaultOral: OralStepDownRequest = { temp: 37.2, hr: 82, rr: 18, sbp: 120, spo2: 96, canEatAndSwallow: true, normalMentalStatus: true };
const default72h: Response72hRequest = { pctD0: 10.0, pctD3: 1.2, hrGt125OrRrGt33: false, bpLt9060: false, imagingWorsening: false };

export const App: React.FC = () => {
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Clinical State
  const [step1Req, setStep1Req] = useState<Step1Request>(defaultStep1);
  const [step1Res, setStep1Res] = useState<SeverityAssessmentResult | null>(null);

  const [step2Risk, setStep2Risk] = useState<ClinicalRiskProfile>(defaultRisk);
  const [step2Res, setStep2Res] = useState<PathogenEngineResult | null>(null);

  const [step3Triggers, setStep3Triggers] = useState<ExclusionRiskTriggers>(defaultTriggers);
  const [step3Res, setStep3Res] = useState<ExclusionAssessmentResult | null>(null);

  const [step4Res, setStep4Res] = useState<EmpiricalRegimenResult | null>(null);

  const [targetedReq, setTargetedReq] = useState<Step5TargetedRequest>(defaultTargeted);
  const [targetedRes, setTargetedRes] = useState<TargetedRegimenResult | null>(null);

  const [oralReq, setOralReq] = useState<OralStepDownRequest>(defaultOral);
  const [oralRes, setOralRes] = useState<OralStepDownResult | null>(null);

  const [response72Req, setResponse72Req] = useState<Response72hRequest>(default72h);
  const [response72Res, setResponse72Res] = useState<TreatmentResponse72hResult | null>(null);

  // Derive CareSetting code
  const getCareSettingCode = useCallback((): CareSetting => {
    const setting = step1Res?.recommendedCareSetting || '';
    if (setting.includes('ICU')) return 'ICU';
    if (setting.includes('Nội trú')) return 'INPATIENT_WARD';
    return 'OUTPATIENT';
  }, [step1Res]);

  // Initial Health Check
  useEffect(() => {
    checkHealth().then(setIsBackendConnected);
  }, []);

  // Step 1 Calculation
  useEffect(() => {
    evaluateStep1Severity(step1Req).then(setStep1Res);
  }, [step1Req]);

  // Step 2 Calculation
  useEffect(() => {
    const setting = getCareSettingCode();
    evaluateStep2Pathogen({
      careSetting: setting,
      riskProfile: step2Risk,
      pleuralEffusion: step1Req.imaging?.pleuralEffusion
    }).then(setStep2Res);
  }, [step1Req.imaging?.pleuralEffusion, step2Risk, getCareSettingCode]);

  // Step 3 Calculation
  useEffect(() => {
    evaluateStep3Exclusion(step3Triggers).then(setStep3Res);
  }, [step3Triggers]);

  // Step 4 Calculation
  useEffect(() => {
    const setting = getCareSettingCode();
    evaluateStep4Empirical({
      careSetting: setting,
      hasPseudomonasRisk: step2Res?.pseudomonasRisk,
      hasMrsaRisk: step2Res?.mrsaRisk,
      hasAtypicalRisk: step2Res?.atypicalRisk,
      hasEsblRisk: step2Res?.esblRisk,
      hasAnaerobeRisk: step2Res?.anaerobeRisk,
      hasMelioidosisRisk: step2Res?.melioidosisRisk
    }).then(setStep4Res);
  }, [getCareSettingCode, step2Res]);

  // Step 5 Calculations
  useEffect(() => {
    evaluateStep5Targeted(targetedReq).then(setTargetedRes);
  }, [targetedReq]);

  useEffect(() => {
    evaluateStep5OralStepDown(oralReq).then(setOralRes);
  }, [oralReq]);

  useEffect(() => {
    evaluateStep5Response72h(response72Req).then(setResponse72Res);
  }, [response72Req]);

  // Reset handler
  const handleReset = () => {
    setStep1Req(defaultStep1);
    setStep2Risk(defaultRisk);
    setStep3Triggers(defaultTriggers);
    setTargetedReq(defaultTargeted);
    setOralReq(defaultOral);
    setResponse72Req(default72h);
    setCurrentStep(1);
  };

  // Load Preset Case
  const handleLoadCase = (preset: PatientCase) => {
    setStep1Req({
      age: preset.age,
      gender: preset.gender,
      vitals: preset.vitals || defaultStep1.vitals,
      labs: preset.labs || defaultStep1.labs,
      comorbidities: preset.comorbidities || defaultStep1.comorbidities,
      imaging: preset.imaging || defaultStep1.imaging,
      symptoms: preset.symptoms || defaultStep1.symptoms
    });
    setStep2Risk(preset.riskProfile || {});
    setStep3Triggers(preset.exclusionTriggers || { crclMlMin: 85 });
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header Bar */}
      <Header
        isBackendConnected={isBackendConnected}
        onReset={handleReset}
        onLoadCase={handleLoadCase}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Stepper Navigation */}
      <StepNavigation
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        settingBadge={step1Res?.recommendedCareSetting}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <Step1Severity
            requestData={step1Req}
            result={step1Res}
            onChange={setStep1Req}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2Pathogen
            careSetting={getCareSettingCode()}
            riskProfile={step2Risk}
            result={step2Res}
            onUpdateRisk={setStep2Risk}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3Exclusion
            triggers={step3Triggers}
            result={step3Res}
            onUpdateTriggers={setStep3Triggers}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4Empirical
            careSetting={getCareSettingCode()}
            result={step4Res}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <Step5Targeted
            targetedReq={targetedReq}
            targetedRes={targetedRes}
            oralReq={oralReq}
            oralRes={oralRes}
            response72Req={response72Req}
            response72Res={response72Res}
            onUpdateTargeted={setTargetedReq}
            onUpdateOral={setOralReq}
            onUpdate72h={setResponse72Req}
            onBack={() => setCurrentStep(4)}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}
      </main>

      {/* Printable Clinical Report Modal */}
      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        step1Req={step1Req}
        step1Res={step1Res}
        step2Res={step2Res}
        step3Res={step3Res}
        step4Res={step4Res}
        step5Targeted={targetedRes}
        oralStepDown={oralRes}
        response72={response72Res}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>PECOMED Community-Acquired Pneumonia Clinical Decision Support System (CAP CDSS) • Phiên bản 1.0.0</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Dành cho bác sĩ và chuyên viên y tế tham khảo trong chẩn đoán và điều trị.</p>
      </footer>
    </div>
  );
};
