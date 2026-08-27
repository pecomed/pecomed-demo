import {
  Step1Request,
  SeverityAssessmentResult,
  Step2Request,
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
  FullCdssReport,
  PatientCase,
  AntibioticInfo
} from '../types/cdss';

const API_BASE_URL = '/api/cdss';

// -------------------------------------------------------------
// Health Check
// -------------------------------------------------------------
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// API Calls with Offline Fallback
// -------------------------------------------------------------

export async function evaluateStep1Severity(req: Step1Request): Promise<SeverityAssessmentResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/step1/severity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using local calculation for Step 1', e);
  }
  return fallbackCalculateStep1(req);
}

export async function evaluateStep2Pathogen(req: Step2Request): Promise<PathogenEngineResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/step2/pathogen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using local calculation for Step 2', e);
  }
  return fallbackCalculateStep2(req);
}

export async function evaluateStep3Exclusion(req: ExclusionRiskTriggers): Promise<ExclusionAssessmentResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/step3/exclusion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using local calculation for Step 3', e);
  }
  return fallbackCalculateStep3(req);
}

export async function evaluateStep4Empirical(data: any): Promise<EmpiricalRegimenResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/step4/empirical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using local calculation for Step 4', e);
  }
  return fallbackCalculateStep4(data);
}

export async function evaluateStep5Targeted(req: Step5TargetedRequest): Promise<TargetedRegimenResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/step5/targeted`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using local calculation for Step 5 targeted', e);
  }
  return fallbackCalculateStep5Targeted(req);
}

export async function evaluateStep5OralStepDown(req: OralStepDownRequest): Promise<OralStepDownResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/step5/oral-step-down`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using local calculation for Step 5 oral step-down', e);
  }
  return fallbackCalculateOralStepDown(req);
}

export async function evaluateStep5Response72h(req: Response72hRequest): Promise<TreatmentResponse72hResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/step5/72h-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using local calculation for Step 5 72h response', e);
  }
  return fallbackCalculate72hResponse(req);
}

export async function evaluateFullCase(patient: PatientCase): Promise<FullCdssReport> {
  const step1 = await evaluateStep1Severity({
    age: patient.age,
    gender: patient.gender,
    vitals: patient.vitals,
    comorbidities: patient.comorbidities,
    labs: patient.labs,
    imaging: patient.imaging,
    symptoms: patient.symptoms
  });

  const setting = step1.recommendedCareSetting.includes('ICU')
    ? 'ICU'
    : step1.recommendedCareSetting.includes('Nội trú')
    ? 'INPATIENT_WARD'
    : 'OUTPATIENT';

  const step2 = await evaluateStep2Pathogen({
    careSetting: setting,
    riskProfile: patient.riskProfile,
    pleuralEffusion: patient.imaging?.pleuralEffusion
  });

  const step3 = await evaluateStep3Exclusion(patient.exclusionTriggers || {});

  const step4 = await evaluateStep4Empirical({
    careSetting: setting,
    age: patient.age,
    hasComorbidities: !!(patient.comorbidities?.copdChronicLung || patient.comorbidities?.diabetes || patient.comorbidities?.renalDisease),
    hasPseudomonasRisk: step2.pseudomonasRisk,
    hasMrsaRisk: step2.mrsaRisk,
    hasAtypicalRisk: step2.atypicalRisk,
    hasEsblRisk: step2.esblRisk,
    hasAnaerobeRisk: step2.anaerobeRisk,
    hasMelioidosisRisk: step2.melioidosisRisk
  });

  return {
    timestamp: new Date().toISOString(),
    patientId: patient.patientId,
    severityAssessment: step1,
    pathogenRiskAssessment: step2,
    exclusionAssessment: step3,
    empiricalRegimen: step4
  };
}

// -------------------------------------------------------------
// Pure TypeScript Fallback Calculators (100% Offline Capability)
// -------------------------------------------------------------

function fallbackCalculateStep1(req: Step1Request): SeverityAssessmentResult {
  const age = req.age;
  const vitals = req.vitals || {};
  const labs = req.labs || {};
  const comorb = req.comorbidities || {};
  const img = req.imaging || {};

  // CURB-65
  let curb: number | null = 0;
  const curbDetails: string[] = [];
  if (labs.ureaMmolL !== undefined && labs.ureaMmolL !== null) {
    if (vitals.alteredMentalStatus) { curb++; curbDetails.push('Rối loạn tri giác (C)'); }
    if (labs.ureaMmolL > 7.0) { curb++; curbDetails.push('Ure máu > 7 mmol/L (U)'); }
    if (vitals.respiratoryRate && vitals.respiratoryRate >= 30) { curb++; curbDetails.push('Tần số thở ≥ 30 lần/phút (R)'); }
    if ((vitals.systolicBp && vitals.systolicBp < 90) || (vitals.diastolicBp && vitals.diastolicBp <= 60)) {
      curb++; curbDetails.push('Huyết áp tâm thu < 90 hoặc tâm trương ≤ 60 mmHg (B)');
    }
    if (age >= 65) { curb++; curbDetails.push('Tuổi ≥ 65 (65)'); }
  } else {
    curb = null;
    curbDetails.push('Chưa có xét nghiệm Ure máu (Dùng CRB-65 thay thế)');
  }

  // CRB-65
  let crb = 0;
  const crbDetails: string[] = [];
  if (vitals.alteredMentalStatus) { crb++; crbDetails.push('Rối loạn ý thức (C)'); }
  if (vitals.respiratoryRate && vitals.respiratoryRate >= 30) { crb++; crbDetails.push('Tần số thở ≥ 30 lần/phút (R)'); }
  if ((vitals.systolicBp && vitals.systolicBp < 90) || (vitals.diastolicBp && vitals.diastolicBp <= 60)) {
    crb++; crbDetails.push('Huyết áp thấp (B)');
  }
  if (age >= 65) { crb++; crbDetails.push('Tuổi ≥ 65 (65)'); }

  // PSI
  let psi = req.gender === 'FEMALE' || req.gender === 'Nữ' ? Math.max(0, age - 10) : age;
  const psiDetails: string[] = [req.gender === 'FEMALE' || req.gender === 'Nữ' ? `Nữ: ${age} - 10 = ${psi} điểm` : `Nam: ${age} điểm`];
  if (comorb.nursingHomeResident) { psi += 10; psiDetails.push('Viện dưỡng lão: +10'); }
  if (comorb.neoplasm) { psi += 30; psiDetails.push('Bệnh ác tính: +30'); }
  if (comorb.liverDisease) { psi += 20; psiDetails.push('Bệnh gan: +20'); }
  if (comorb.congestiveHeartFailure) { psi += 10; psiDetails.push('Suy tim xung huyết: +10'); }
  if (comorb.cerebrovascularDisease) { psi += 10; psiDetails.push('Bệnh mạch máu não: +10'); }
  if (comorb.renalDisease) { psi += 10; psiDetails.push('Bệnh thận mạn: +10'); }
  if (vitals.alteredMentalStatus) { psi += 20; psiDetails.push('Thay đổi ý thức: +20'); }
  if (vitals.respiratoryRate && vitals.respiratoryRate >= 30) { psi += 20; psiDetails.push('Thở ≥ 30/phút: +20'); }
  if (vitals.systolicBp && vitals.systolicBp < 90) { psi += 20; psiDetails.push('HA tâm thu < 90: +20'); }
  if (vitals.temperature && (vitals.temperature < 35 || vitals.temperature >= 40)) { psi += 15; psiDetails.push('Thân nhiệt <35 hoặc ≥40°C: +15'); }
  if (vitals.heartRate && vitals.heartRate >= 125) { psi += 10; psiDetails.push('Mạch ≥ 125 bpm: +10'); }
  if (labs.arterialPh && labs.arterialPh < 7.35) { psi += 30; psiDetails.push('pH máu < 7.35: +30'); }
  if (labs.ureaMmolL && labs.ureaMmolL >= 11) { psi += 20; psiDetails.push('BUN/Ure máu cao: +20'); }
  if (labs.sodiumMmolL && labs.sodiumMmolL < 130) { psi += 20; psiDetails.push('Natri < 130: +20'); }
  if (labs.glucoseMmolL && labs.glucoseMmolL >= 14) { psi += 10; psiDetails.push('Glucose ≥ 14: +10'); }
  if (labs.hematocritPct && labs.hematocritPct < 30) { psi += 10; psiDetails.push('Hct < 30%: +10'); }
  if (labs.pao2Fio2Ratio && labs.pao2Fio2Ratio < 250) { psi += 10; psiDetails.push('PaO2/FiO2 < 250: +10'); }
  if (img.pleuralEffusion) { psi += 10; psiDetails.push('Tràn dịch màng phổi: +10'); }

  let psiClass = 'Tầng I (Class I - Rất nhẹ, tỉ lệ tử vong 0.1-0.4%)';
  if (psi <= 70 && age > 50) psiClass = 'Tầng II (Class II - Nhẹ, <=70 điểm, tỉ lệ tử vong 0.6-0.7%)';
  else if (psi >= 71 && psi <= 90) psiClass = 'Tầng III (Class III - Trung bình, 71-90 điểm, tỉ lệ tử vong 0.9-2.8%)';
  else if (psi >= 91 && psi <= 130) psiClass = 'Tầng IV (Class IV - Nặng, 91-130 điểm, tỉ lệ tử vong 8.2-9.3%)';
  else if (psi > 130) psiClass = 'Tầng V (Class V - Rất nặng, >130 điểm, tỉ lệ tử vong 27-31%)';

  // SMART-COP
  let smart = 0;
  const smartDetails: string[] = [];
  if (vitals.systolicBp && vitals.systolicBp < 90) { smart += 2; smartDetails.push('Huyết áp tâm thu < 90 mmHg (S: +2)'); }
  if (img.multilobarInfiltrates) { smart += 1; smartDetails.push('Tổn thương nhiều thùy (M: +1)'); }
  if (labs.albuminGDl && labs.albuminGDl < 3.5) { smart += 1; smartDetails.push('Albumin < 3.5 g/dL (A: +1)'); }
  if ((age <= 50 && vitals.respiratoryRate && vitals.respiratoryRate >= 25) || (age > 50 && vitals.respiratoryRate && vitals.respiratoryRate >= 30)) {
    smart += 1; smartDetails.push('Nhịp thở tăng theo tuổi (R: +1)');
  }
  if (vitals.heartRate && vitals.heartRate >= 125) { smart += 1; smartDetails.push('Nhịp tim nhanh ≥ 125 bpm (T: +1)'); }
  if (vitals.alteredMentalStatus) { smart += 1; smartDetails.push('Lú lẫn cấp tính (C: +1)'); }
  if ((age <= 50 && ((labs.pao2Fio2Ratio && labs.pao2Fio2Ratio < 333) || (vitals.spo2 && vitals.spo2 <= 93))) ||
      (age > 50 && ((labs.pao2Fio2Ratio && labs.pao2Fio2Ratio < 250) || (vitals.spo2 && vitals.spo2 <= 90)))) {
    smart += 2; smartDetails.push('Giảm oxy máu theo tuổi (O: +2)');
  }
  if (labs.arterialPh && labs.arterialPh < 7.35) { smart += 2; smartDetails.push('pH < 7.35 (P: +2)'); }

  // ATS 2007
  const atsMajor: string[] = [];
  const atsMinor: string[] = [];
  if (img.septicShockVasopressors || vitals.onAggressiveFluidResuscitation) atsMajor.push('Sốc nhiễm khuẩn cần thuốc vận mạch');
  if (img.mechanicalVentilation) atsMajor.push('Suy hô hấp cần thở máy xâm nhập');
  if (vitals.respiratoryRate && vitals.respiratoryRate >= 30) atsMinor.push('Nhịp thở ≥ 30 lần/phút');
  if (labs.pao2Fio2Ratio && labs.pao2Fio2Ratio <= 250) atsMinor.push('PaO2/FiO2 ≤ 250');
  if (img.multilobarInfiltrates) atsMinor.push('Thâm nhiễm nhiều thùy');
  if (vitals.alteredMentalStatus) atsMinor.push('Rối loạn ý thức');
  if (labs.ureaMmolL && labs.ureaMmolL >= 7.14) atsMinor.push('Ure máu ≥ 7.14 mmol/L');
  if (labs.wbcGL && labs.wbcGL < 4.0) atsMinor.push('Bạch cầu máu < 4.0 G/L');
  if (labs.plateletsGL && labs.plateletsGL < 100) atsMinor.push('Tiểu cầu < 100 G/L');
  if (vitals.temperature && vitals.temperature < 36.0) atsMinor.push('Hạ thân nhiệt < 36.0°C');
  if (vitals.systolicBp && vitals.systolicBp < 90) atsMinor.push('Tụt huyết áp');

  const atsSevereCap = atsMajor.length >= 1 || atsMinor.length >= 3;

  // Care Setting
  let careSetting = 'Ngoại trú (Nhẹ)';
  let severityLevel = 'Nhẹ (Mild)';

  if (atsSevereCap || smart >= 5 || (curb !== null && curb >= 3) || crb >= 3 || psi > 130) {
    careSetting = 'ICU (Rất nặng / Nguy kịch)';
    severityLevel = 'Nặng (Severe) / Nguy kịch';
  } else if ((curb !== null && curb === 2) || crb === 2 || (psi >= 71 && psi <= 130) || smart >= 3) {
    careSetting = 'Nội trú (Trung bình)';
    severityLevel = 'Trung bình (Moderate)';
  }

  return {
    curb65Score: curb,
    curb65Details: curbDetails,
    crb65Score: crb,
    crb65Details: crbDetails,
    psiScore: psi,
    psiClass,
    psiDetails,
    smartCopScore: smart,
    smartCopRisk: smart >= 5 ? 'Nguy cơ rất cao cần IRVS (67%)' : smart >= 3 ? 'Nguy cơ cao (33%)' : 'Nguy cơ thấp (~4%)',
    smartCopDetails: smartDetails,
    atsSevereCap,
    atsMajorCount: atsMajor.length,
    atsMinorCount: atsMinor.length,
    atsMajorCriteriaMet: atsMajor,
    atsMinorCriteriaMet: atsMinor,
    severityLevel,
    recommendedCareSetting: careSetting,
    syndromeSummary: [
      'Hội chứng nhiễm trùng / nhiễm độc hô hấp dưới',
      'Hội chứng đông đặc nhu mô phổi'
    ],
    routineLabOrders: [
      '1. Tổng phân tích tế bào máu (CTM), Đếm bạch cầu, CRP/PCT.',
      '2. Sinh hóa máu: Ure, Creatinine (tính eGFR), Điện giải đồ, Đường máu, Men gan.',
      '3. X-quang phổi thẳng / Cắt lớp vi tính ngực.',
      '4. Cấy đờm + Kháng sinh đồ và Cấy máu 2 vị trí trước kháng sinh.'
    ],
    clinicalNotes: [
      careSetting.includes('ICU')
        ? 'Bệnh nhân thỏa tiêu chuẩn nhập ICU khẩn cấp (ATS/IDSA nặng hoặc SMART-COP cao).'
        : careSetting.includes('Nội trú')
        ? 'Chỉ định điều trị nội trú tại Khoa Nội Hô hấp / Nội Tổng hợp.'
        : 'Đủ điều kiện điều trị ngoại trú an toàn, hẹn tái khám sau 48-72 giờ.'
    ]
  };
}

function fallbackCalculateStep2(req: Step2Request): PathogenEngineResult {
  const p = req.riskProfile || {};
  const pseudo = !!(p.priorPseudomonasIsolation || p.recentHospitalization90d || p.recentIvAntibiotics90d || p.structuralLungDiseaseBronchiectasis || p.frequentCopdExacerbationsSteroids);
  const mrsa = !!(p.priorMrsaIsolation || p.recentMrsaContact || p.skinInfectionsWounds);
  const esbl = !!(p.esblRiskColonization || p.immunosuppressiveTherapy);
  const atyp = !!(p.atypicalEpidemicContext || p.birdBatExposurePsittacosis);
  const anaerobe = !!(p.poorDentalHygieneAspiration || p.lossOfConsciousnessAlcoholism || p.severeDysphagia);
  const melioid = !!(p.diabetesMellitusChronicLiverRenal && (p.exposureSoilWaterFlooding || p.recentTravelEndemicMelioidosis));

  const likely: string[] = ['Streptococcus pneumoniae (Phế cầu)', 'Haemophilus influenzae', 'Moraxella catarrhalis'];
  if (atyp) likely.push('Mycoplasma pneumoniae', 'Chlamydia pneumoniae', 'Legionella pneumophila');
  if (pseudo) likely.push('Pseudomonas aeruginosa (Trực khuẩn mủ xanh)');
  if (mrsa) likely.push('Staphylococcus aureus (Tụ cầu vàng - MRSA/MSSA)');
  if (esbl) likely.push('Klebsiella pneumoniae (ESBL+)', 'Enterobacteriaceae');
  if (anaerobe) likely.push('Vi khuẩn kỵ khí vùng hầu họng (Bacteroides, Peptostreptococcus)');
  if (melioid) likely.push('Burkholderia pseudomallei (Bệnh Whitmore)');

  return {
    likelyPathogens: likely,
    pseudomonasRisk: pseudo,
    mrsaRisk: mrsa,
    esblRisk: esbl,
    atypicalRisk: atyp,
    anaerobeRisk: anaerobe,
    melioidosisRisk: melioid,
    indicatedDiagnosticTests: [
      'Nhuộm Gram và cấy đờm tìm vi khuẩn gây bệnh + Kháng sinh đồ.',
      'Cấy máu 2 vị trí trước khi dùng liều kháng sinh đầu tiên.',
      ...(pseudo ? ['Cấy đờm định lượng và làm KSĐ chuyên biệt cho P. aeruginosa.'] : []),
      ...(mrsa ? ['Test nhanh PCR tìm gen mecA (MRSA) hoặc cấy sàng lọc MRSA dịch tỵ hầu.'] : []),
      ...(melioid ? ['Xét nghiệm khẳng định Burkholderia pseudomallei (cấy máu, đờm, mủ ổ áp xe).'] : []),
      ...(atyp ? ['Test kháng nguyên Legionella nước tiểu; PCR Mycoplasma pneumoniae.'] : [])
    ],
    riskWarnings: [
      ...(pseudo ? ['CẢNH BÁO: Bệnh nhân có nguy cơ cao nhiễm Pseudomonas aeruginosa. Cần phác đồ phủ P. aeruginosa phổ rộng.'] : []),
      ...(mrsa ? ['CẢNH BÁO: Nguy cơ tụ cầu vàng kháng Methicillin (MRSA). Cân nhắc Vancomycin hoặc Linezolid.'] : []),
      ...(melioid ? ['CẢNH BÁO WHITMORE: Nguy cơ nhiễm Burkholderia pseudomallei. Cần giai đoạn tấn công Ceftazidime/Meropenem.'] : [])
    ]
  };
}

function fallbackCalculateStep3(req: ExclusionRiskTriggers): ExclusionAssessmentResult {
  const contra: string[] = [];
  const caution: string[] = [];
  const warn: string[] = [];

  if (req.hasLongQtSyndrome) {
    contra.push('Fluoroquinolones (Moxifloxacin, Levofloxacin)', 'Macrolides (Azithromycin, Clarithromycin)');
    warn.push('Hội chứng QT kéo dài: Chống chỉ định Quinolone và Macrolide do nguy cơ xoắn đỉnh (Torsades de pointes).');
  }
  if (req.hasMyastheniaGravis) {
    contra.push('Fluoroquinolones', 'Aminoglycosides', 'Macrolides');
    warn.push('Nhược cơ (Myasthenia Gravis): Chống chỉ định Quinolone, Aminoglycoside vì làm nặng thêm ức chế thần kinh cơ.');
  }
  if (req.hasTendinitisOrFluoroquinoloneAllergy) {
    contra.push('Fluoroquinolones');
    warn.push('Tiền sử viêm gân / đứt gân gót Achilles hoặc dị ứng: Tuyệt đối không dùng nhóm Quinolone.');
  }
  if (req.isPregnantOrNursing) {
    contra.push('Fluoroquinolones', 'Doxycycline / Tetracyclines', 'Aminoglycosides');
    caution.push('Clarithromycin');
    warn.push('Phụ nữ mang thai / cho con bú: Ưu tiên Beta-lactam (Amoxicillin/Clavulanate, Cefuroxime, Ceftriaxone) +/- Azithromycin.');
  }
  if (req.hasKnownPenicillinAnaphylaxis) {
    contra.push('Penicillins (Amoxicillin, Ampicillin, Piperacillin/Tazobactam)');
    caution.push('Cephalosporins (nguy cơ phản ứng chéo)');
    warn.push('Tiền sử sốc phản vệ Penicillin: Chuyển sang Quinolone hô hấp hoặc Aztreonam / Carbapenem / Macrolide an toàn.');
  }

  const renalAdj = !!(req.hasSevereRenalFailure || (req.crclMlMin !== undefined && req.crclMlMin < 50));
  if (renalAdj) {
    caution.push('Aminoglycosides (Amikacin, Gentamicin)', 'Vancomycin', 'Levofloxacin', 'Cefepime');
    warn.push(`Suy giảm chức năng thận (CrCl = ${req.crclMlMin || '<50'} mL/phút): Bắt buộc hiệu chỉnh liều theo ClCr.`);
  }

  return {
    contraindicatedDrugs: contra,
    cautionDrugs: caution,
    renalDoseAdjustmentRequired: renalAdj,
    crclMlMin: req.crclMlMin,
    warnings: warn
  };
}

function fallbackCalculateStep4(data: any): EmpiricalRegimenResult {
  const setting = String(data.careSetting || 'OUTPATIENT');
  const pseudo = !!data.hasPseudomonasRisk || !!data.suspectPseudomonas;
  const mrsa = !!data.hasMrsaRisk || !!data.suspectMrsa;

  const primary: AntibioticInfo[] = [];
  const alternative: AntibioticInfo[] = [];
  const addOns: AntibioticInfo[] = [];
  const stepDown: AntibioticInfo[] = [];

  if (setting.includes('ICU') || setting.includes('Rất nặng')) {
    if (pseudo) {
      primary.push({
        name: 'Piperacillin / Tazobactam (hoặc Cefepime / Meropenem)',
        dose: 'Pip/Tazo 4.5g TTM mỗi 6h (truyền kéo dài 3-4h) HOẶC Cefepime 2g TTM mỗi 8h HOẶC Meropenem 1g TTM mỗi 8h',
        route: 'IV',
        role: 'Kháng sinh Beta-lactam kháng Trực khuẩn mủ xanh (Antipseudomonal)',
        drugClass: 'Antipseudomonal Beta-lactam'
      });
      primary.push({
        name: 'Levofloxacin (hoặc Ciprofloxacin / Amikacin)',
        dose: 'Levofloxacin 750mg TTM mỗi 24h (hoặc Ciprofloxacin 400mg TTM mỗi 8h / Amikacin 15-20mg/kg TTM mỗi 24h)',
        route: 'IV',
        role: 'Thuốc thứ 2 kháng Pseudomonas & bao phủ vi khuẩn không điển hình',
        drugClass: 'Fluoroquinolone / Aminoglycoside'
      });
    } else {
      primary.push({
        name: 'Ceftriaxone (hoặc Cefotaxime / Ampicillin-Sulbactam)',
        dose: 'Ceftriaxone 2g TTM mỗi 24h HOẶC Cefotaxime 2g TTM mỗi 8h HOẶC Ampicillin/Sulbactam 3g TTM mỗi 6h',
        route: 'IV',
        role: 'Beta-lactam phổ rộng diệt khuẩn đường tĩnh mạch',
        drugClass: 'Cephalosporin 3rd gen / Aminopenicillin+BLI'
      });
      primary.push({
        name: 'Levofloxacin (hoặc Moxifloxacin / Azithromycin)',
        dose: 'Levofloxacin 750mg TTM mỗi 24h HOẶC Moxifloxacin 400mg TTM mỗi 24h HOẶC Azithromycin 500mg TTM mỗi 24h',
        route: 'IV',
        role: 'Kháng sinh phối hợp bao phủ Legionella và hiệp đồng diệt khuẩn',
        drugClass: 'Respiratory Fluoroquinolone / Macrolide'
      });
    }

    if (mrsa) {
      addOns.push({
        name: 'Vancomycin (hoặc Linezolid)',
        dose: 'Vancomycin 15-20mg/kg TTM mỗi 8-12h (kèm liều nạp 25-30mg/kg ở BN nặng) HOẶC Linezolid 600mg TTM mỗi 12h',
        route: 'IV',
        role: 'Bao phủ Tụ cầu vàng kháng Methicillin (MRSA)',
        drugClass: 'Glycopeptide / Oxazolidinone',
        note: 'Bắt buộc đo nồng độ đáy Vancomycin mục tiêu 15-20 mcg/mL.'
      });
    }

    return {
      careSetting: 'Hồi sức Tích cực (ICU)',
      regimenTitle: pseudo ? 'Phác đồ ICU (Bao phủ Pseudomonas aeruginosa)' : 'Phác đồ Hồi sức Cấp cứu (ICU)',
      targetPatientGroup: 'Điều trị Hồi sức Tích cực (ICU / HDU) - Viêm phổi nặng / Sốc nhiễm khuẩn / Suy hô hấp cấp',
      primaryRegimen: primary,
      alternativeRegimen: alternative,
      addOns,
      stepDownRegimen: stepDown,
      corticosteroidRecommendation: 'Hydrocortisone 200mg/ngày (50mg tiêm TM mỗi 6h) trong 4-7 ngày cho bệnh nhân sốc nhiễm khuẩn hoặc PaO2/FiO2 < 200.',
      respiratorySupport: 'Thở oxy dòng cao HFNC hoặc Thở máy không xâm nhập NIV/BiPAP. Đặt nội khí quản thở máy xâm nhập nếu suy hô hấp tiến triển.',
      monitoringPlan: [
        'Bắt đầu kháng sinh tĩnh mạch trong vòng 1 GIỜ ĐẦU (Golden Hour).',
        'Đo nồng độ đáy Vancomycin trước liều thứ 4.',
        'Đánh giá động học Procalcitonin (D0, D3, D5-D7).'
      ]
    };
  } else if (setting.includes('INPATIENT') || setting.includes('Nội trú')) {
    primary.push({
      name: 'Ampicillin / Sulbactam (hoặc Ceftriaxone / Cefotaxime)',
      dose: 'Ampicillin/Sulbactam 1.5g - 3g tiêm TM mỗi 6h HOẶC Ceftriaxone 1g - 2g tiêm TM mỗi 24h',
      route: 'IV',
      role: 'Phối hợp thuốc (Thành phần Beta-lactam chính IV)',
      drugClass: 'Beta-lactam / Cephalosporin 3rd gen'
    });
    primary.push({
      name: 'Azithromycin (hoặc Clarithromycin / Doxycycline)',
      dose: 'Azithromycin 500mg tiêm TM hoặc uống mỗi 24h trong 3-5 ngày',
      route: 'IV / ORAL',
      role: 'Phối hợp thuốc (Thành phần Macrolide bao phủ vi khuẩn không điển hình)',
      drugClass: 'Macrolide'
    });

    alternative.push({
      name: 'Levofloxacin (hoặc Moxifloxacin)',
      dose: 'Levofloxacin 750mg tiêm TM/uống mỗi 24h HOẶC Moxifloxacin 400mg tiêm TM/uống mỗi 24h',
      route: 'IV / ORAL',
      role: 'Đơn trị liệu Quinolone hô hấp (Ưu tiên khi dị ứng Beta-lactam)',
      drugClass: 'Respiratory Fluoroquinolone'
    });

    stepDown.push({
      name: 'Amoxicillin / Acid Clavulanic 875/125mg',
      dose: '1 viên uống mỗi 12h HOẶC Levofloxacin 750mg 1 viên/ngày',
      route: 'ORAL',
      role: 'Kháng sinh chuyển tiếp đường uống khi xuất viện',
      drugClass: 'Oral Step-down'
    });

    return {
      careSetting: 'Nội trú Khoa Nội Tổng quát / Hô hấp',
      regimenTitle: 'Phác đồ Nội trú Khoa Nội (Beta-lactam IV + Macrolide HOẶC Quinolone hô hấp)',
      targetPatientGroup: 'Điều trị Nội trú Khoa Nội Hô hấp / Nội Tổng hợp (CAP mức độ trung bình)',
      primaryRegimen: primary,
      alternativeRegimen: alternative,
      addOns,
      stepDownRegimen: stepDown,
      respiratorySupport: 'Thở oxy qua gọng mũi 2-4 L/phút nếu SpO2 < 92%.',
      monitoringPlan: [
        'Đánh giá lại đáp ứng lâm sàng, SpO2, thân nhiệt và Procalcitonin sau 48-72 giờ.',
        'Đánh giá 7 tiêu chuẩn chuyển kháng sinh đường uống.'
      ]
    };
  } else {
    primary.push({
      name: 'Amoxicillin (hoặc Amox/Clav)',
      dose: 'Amoxicillin 1g uống mỗi 8h (3g/ngày) HOẶC Amox/Clav 875/125mg uống mỗi 12h',
      route: 'ORAL',
      role: 'Lựa chọn ưu tiên hàng đầu',
      drugClass: 'Aminopenicillin',
      note: 'Bao phủ tốt Phế cầu khuẩn (S. pneumoniae) nhạy cảm.'
    });
    primary.push({
      name: 'Doxycycline (hoặc Azithromycin)',
      dose: 'Doxycycline 100mg uống 2 lần/ngày (hoặc Azithromycin 500mg ngày 1, 250mg ngày 2-5)',
      route: 'ORAL',
      role: 'Bao phủ vi khuẩn không điển hình',
      drugClass: 'Tetracycline / Macrolide'
    });

    alternative.push({
      name: 'Levofloxacin (hoặc Moxifloxacin / Cefpodoxime)',
      dose: 'Levofloxacin 750mg uống 1 lần/ngày HOẶC Cefpodoxime 200mg uống mỗi 12h + Azithromycin',
      route: 'ORAL',
      role: 'Lựa chọn thay thế cho bệnh nhân có bệnh nền hoặc dị ứng',
      drugClass: 'Fluoroquinolone / Oral Cephalosporin'
    });

    return {
      careSetting: 'Ngoại trú (Ambulatory / Phòng khám)',
      regimenTitle: 'Phác đồ Ngoại trú (Amoxicillin/Clavulanate + Macrolide / Doxycycline)',
      targetPatientGroup: 'Bệnh nhân điều trị ngoại trú',
      primaryRegimen: primary,
      alternativeRegimen: alternative,
      addOns,
      stepDownRegimen: stepDown,
      monitoringPlan: [
        'Đánh giá lại lâm sàng sau 48-72 giờ.',
        'Hướng dẫn bệnh nhân tái khám ngay nếu có dấu hiệu trở nặng.'
      ]
    };
  }
}

function fallbackCalculateStep5Targeted(req: Step5TargetedRequest): TargetedRegimenResult {
  const pId = (req.pathogenId || '').toLowerCase();
  const mic = req.micPenicillin ?? 1.0;

  if (pId.includes('pneumoniae') && !pId.includes('klebsiella')) {
    if (mic <= 2.0) {
      return {
        pathogenName: `Streptococcus pneumoniae (Nhạy cảm, MIC = ${mic} <= 2 mcg/mL)`,
        targetedAntibiotics: [
          'Penicillin G 2-4 triệu UI tiêm TM mỗi 4-6 giờ',
          'Ceftriaxone 1-2g tiêm TM mỗi 24 giờ',
          'Amoxicillin 1g uống mỗi 8 giờ'
        ],
        dosageAndAdministration: 'Dùng đường tiêm tĩnh mạch giai đoạn cấp, chuyển uống Amoxicillin khi ổn định.',
        duration: '5 - 7 ngày'
      };
    } else if (mic < 8.0) {
      return {
        pathogenName: `Streptococcus pneumoniae (Trung gian, MIC = ${mic}: 2 < MIC < 8 mcg/mL)`,
        targetedAntibiotics: [
          'Ceftaroline 600mg truyền TM mỗi 12 giờ',
          'Levofloxacin 750mg TTM mỗi 24 giờ',
          'Ceftriaxone liều cao 2g truyền TM mỗi 12 giờ'
        ],
        dosageAndAdministration: 'Tăng liều Beta-lactam hoặc dùng Ceftaroline / Quinolone.',
        duration: '7 - 10 ngày'
      };
    } else {
      return {
        pathogenName: `Streptococcus pneumoniae (Kháng Penicillin liều cao, MIC = ${mic} >= 8 mcg/mL)`,
        targetedAntibiotics: [
          'Vancomycin 15-20 mg/kg truyền TM mỗi 8-12 giờ',
          'Linezolid 600mg truyền TM hoặc uống mỗi 12 giờ'
        ],
        dosageAndAdministration: 'Bắt buộc dùng Glycopeptide hoặc Oxazolidinone.',
        duration: '10 - 14 ngày'
      };
    }
  } else if (pId.includes('aureus')) {
    if (req.isMrsa) {
      return {
        pathogenName: 'Staphylococcus aureus kháng Methicillin (MRSA)',
        targetedAntibiotics: [
          'Vancomycin 15-20 mg/kg truyền TM mỗi 8-12h (nồng độ đáy 15-20 mcg/mL)',
          'Linezolid 600mg truyền TM hoặc uống mỗi 12 giờ'
        ],
        dosageAndAdministration: 'Truyền Vancomycin chậm ít nhất 60-120 phút.',
        duration: '7 - 14 ngày'
      };
    } else {
      return {
        pathogenName: 'Staphylococcus aureus nhạy cảm Methicillin (MSSA)',
        targetedAntibiotics: [
          'Oxacillin 2g tiêm TM mỗi 4 giờ',
          'Cefazolin 2g tiêm TM mỗi 8 giờ'
        ],
        dosageAndAdministration: 'Xuống thang ngay từ Vancomycin sang Oxacillin khi có kết quả MSSA.',
        duration: '7 - 14 ngày'
      };
    }
  } else if (pId.includes('klebsiella')) {
    if (req.isCarbapenemResistant) {
      return {
        pathogenName: 'Klebsiella pneumoniae kháng Carbapenem (CRE)',
        targetedAntibiotics: [
          'Ceftazidime / Avibactam 2.5g truyền TM mỗi 8 giờ',
          'Colistin liều nạp 9 triệu UI, duy trì 4.5 triệu UI mỗi 12h + Phối hợp'
        ],
        dosageAndAdministration: 'Hội chẩn Vi sinh và Dược lâm sàng.',
        duration: '14 - 21 ngày'
      };
    } else if (req.isEsbl) {
      return {
        pathogenName: 'Klebsiella pneumoniae sinh ESBL (ESBL+)',
        targetedAntibiotics: [
          'Meropenem 1g truyền TM mỗi 8 giờ (truyền kéo dài 3 giờ)',
          'Ertapenem 1g tiêm TM mỗi 24 giờ'
        ],
        dosageAndAdministration: 'Carbapenem là lựa chọn hàng đầu cho chủng sinh ESBL.',
        duration: '10 - 14 ngày'
      };
    } else {
      return {
        pathogenName: 'Klebsiella pneumoniae (Không sinh ESBL)',
        targetedAntibiotics: [
          'Ceftriaxone 1-2g tiêm TM mỗi 24 giờ',
          'Piperacillin / Tazobactam 4.5g TTM mỗi 6-8 giờ'
        ],
        dosageAndAdministration: 'Khi kháng Cephalosporin thế hệ 3: Cefepime 1-2g TTM mỗi 8h.',
        duration: '7 - 10 ngày'
      };
    }
  } else if (pId.includes('pseudomallei') || pId.includes('whitmore')) {
    return {
      pathogenName: 'Burkholderia pseudomallei (Bệnh Whitmore)',
      targetedAntibiotics: [
        'Tấn công: Ceftazidime 2g tiêm TM mỗi 6-8h HOẶC Meropenem 1g mỗi 8h (≥ 14 ngày)',
        'Duy trì: Cotrimoxazole 160/800mg 2 viên x 2 lần/ngày (3 - 6 tháng)'
      ],
      dosageAndAdministration: 'Điều trị 2 giai đoạn bắt buộc: Tấn công tĩnh mạch + Duy trì đường uống.',
      duration: 'Tấn công: ≥ 2 tuần -> Duy trì: 3 đến 6 tháng'
    };
  }

  return {
    pathogenName: 'Vi khuẩn không điển hình / Khác',
    targetedAntibiotics: [
      'Azithromycin 500mg uống/tiêm TM mỗi 24 giờ',
      'Levofloxacin 750mg uống/tiêm TM mỗi 24 giờ'
    ],
    dosageAndAdministration: 'Uống hoặc tiêm truyền tĩnh mạch.',
    duration: '5 - 7 ngày'
  };
}

function fallbackCalculateOralStepDown(req: OralStepDownRequest): OralStepDownResult {
  const details: string[] = [];
  let count = 0;

  if (req.temp <= 37.8) { count++; details.push(`Thân nhiệt ổn định ≤ 37.8°C (${req.temp}°C) [ĐẠT]`); }
  else details.push(`Thân nhiệt > 37.8°C (${req.temp}°C) [CHƯA ĐẠT]`);

  if (req.hr < 100) { count++; details.push(`Nhịp tim < 100 bpm (${req.hr} bpm) [ĐẠT]`); }
  else details.push(`Nhịp tim nhanh ≥ 100 bpm (${req.hr} bpm) [CHƯA ĐẠT]`);

  if (req.rr < 24) { count++; details.push(`Nhịp thở < 24 lần/phút (${req.rr} l/p) [ĐẠT]`); }
  else details.push(`Nhịp thở nhanh ≥ 24 lần/phút (${req.rr} l/p) [CHƯA ĐẠT]`);

  if (req.sbp >= 90) { count++; details.push(`Huyết áp tâm thu ≥ 90 mmHg (${req.sbp} mmHg) [ĐẠT]`); }
  else details.push(`Huyết áp tụt < 90 mmHg (${req.sbp} mmHg) [CHƯA ĐẠT]`);

  if (req.spo2 >= 90.0) { count++; details.push(`SpO2 ≥ 90% (${req.spo2}%) [ĐẠT]`); }
  else details.push(`SpO2 < 90% (${req.spo2}%) [CHƯA ĐẠT]`);

  if (req.canEatAndSwallow) { count++; details.push('Ăn uống và hấp thu tiêu hóa được [ĐẠT]'); }
  else details.push('Không ăn uống được hoặc nôn [CHƯA ĐẠT]');

  if (req.normalMentalStatus) { count++; details.push('Tri giác bình thường [ĐẠT]'); }
  else details.push('Còn rối loạn ý thức [CHƯA ĐẠT]');

  const eligible = (count === 7);

  return {
    eligible,
    metCriteriaCount: count,
    totalCriteriaCount: 7,
    criteriaDetails: details,
    suggestedOralRegimens: eligible ? [
      'Amoxicillin / Acid Clavulanic 875/125mg: 1 viên uống mỗi 12 giờ',
      'Levofloxacin 750mg: 1 viên uống mỗi 24 giờ',
      'Moxifloxacin 400mg: 1 viên uống mỗi 24 giờ'
    ] : [],
    clinicalGuidance: eligible
      ? 'ĐỦ ĐIỀU KIỆN (7/7 tiêu chí) chuyển sang kháng sinh đường uống (Oral Step-down).'
      : `CHƯA ĐỦ ĐIỀU KIỆN chuyển uống (đạt ${count}/7 tiêu chí). Tiếp tục tiêm truyền TM.`
  };
}

function fallbackCalculate72hResponse(req: Response72hRequest): TreatmentResponse72hResult {
  const isFailure = !!(req.hrGt125OrRrGt33 || req.bpLt9060 || req.imagingWorsening || req.atsScoreIncreased || req.respFailureWorsening);

  let interp = 'Chưa có đủ dữ liệu Procalcitonin.';
  if (req.pctD0 !== undefined && req.pctD3 !== undefined && req.pctD0 > 0) {
    const drop = ((req.pctD0 - req.pctD3) / req.pctD0) * 100.0;
    if (drop >= 80.0) interp = `PCT giảm ${drop.toFixed(1)}% (≥ 80%): ĐÁP ỨNG RẤT TỐT.`;
    else if (drop >= 50.0) interp = `PCT giảm ${drop.toFixed(1)}% (50-80%): ĐÁP ỨNG MỘT PHẦN.`;
    else interp = `PCT không giảm hoặc tăng (mức giảm ${drop.toFixed(1)}% < 50%): CẢNH BÁO THẤT BẠI ĐIỀU TRỊ!`;
  }

  return {
    responseStatus: isFailure ? 'THẤT BẠI ĐIỀU TRỊ / NẶNG LÊN SAU 72 GIỜ' : 'ĐÁP ỨNG ĐIỀU TRỊ TỐT SAU 72 GIỜ',
    pctKineticsInterpretation: interp,
    isTreatmentFailure: isFailure,
    recommendedActions: isFailure ? [
      '1. Khám lại lâm sàng, cấy lặp lại đờm và máu 2 vị trí.',
      '2. Chụp CT ngực cản quang tìm biến chứng ngoại khoa / mủ màng phổi / áp xe.',
      '3. Nâng bậc kháng sinh sang Meropenem + Vancomycin/Linezolid.'
    ] : [
      '1. Duy trì phác đồ kháng sinh hiện tại.',
      '2. Đánh giá tiêu chí chuyển uống (Oral Step-down).'
    ]
  };
}
