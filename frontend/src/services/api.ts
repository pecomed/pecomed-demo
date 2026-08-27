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
  PatientCase,
  FullCdssReport
} from '../types/cdss';

const API_BASE = '/api/cdss';

async function postJson<T>(endpoint: string, data: any): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error [${res.status}]: ${errorText || res.statusText}`);
  }

  return res.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function evaluateStep1Severity(data: Step1Request): Promise<SeverityAssessmentResult> {
  try {
    return await postJson<SeverityAssessmentResult>('/step1/severity', data);
  } catch (err) {
    console.warn('API call failed, running client-side fallback:', err);
    return fallbackCalculateStep1(data);
  }
}

export async function evaluateStep2Pathogen(data: Step2Request): Promise<PathogenEngineResult> {
  try {
    return await postJson<PathogenEngineResult>('/step2/pathogen', data);
  } catch (err) {
    console.warn('API call failed, running client-side fallback:', err);
    return fallbackCalculateStep2(data);
  }
}

export async function evaluateStep3Exclusion(data: ExclusionRiskTriggers): Promise<ExclusionAssessmentResult> {
  try {
    return await postJson<ExclusionAssessmentResult>('/step3/exclusion', data);
  } catch (err) {
    console.warn('API call failed, running client-side fallback:', err);
    return fallbackCalculateStep3(data);
  }
}

export async function evaluateStep4Empirical(data: any): Promise<EmpiricalRegimenResult> {
  try {
    return await postJson<EmpiricalRegimenResult>('/step4/empirical', data);
  } catch (err) {
    console.warn('API call failed, running client-side fallback:', err);
    return fallbackCalculateStep4(data);
  }
}

export async function evaluateStep5Targeted(data: Step5TargetedRequest): Promise<TargetedRegimenResult> {
  try {
    return await postJson<TargetedRegimenResult>('/step5/targeted', data);
  } catch (err) {
    console.warn('API call failed, running client-side fallback:', err);
    return fallbackCalculateStep5Targeted(data);
  }
}

export async function evaluateStep5OralStepDown(data: OralStepDownRequest): Promise<OralStepDownResult> {
  try {
    return await postJson<OralStepDownResult>('/step5/oral-step-down', data);
  } catch (err) {
    console.warn('API call failed, running client-side fallback:', err);
    return fallbackCalculateOralStepDown(data);
  }
}

export async function evaluateStep5Response72h(data: Response72hRequest): Promise<TreatmentResponse72hResult> {
  try {
    return await postJson<TreatmentResponse72hResult>('/step5/72h-response', data);
  } catch (err) {
    console.warn('API call failed, running client-side fallback:', err);
    return fallbackCalculateResponse72h(data);
  }
}

export async function evaluateFullCase(data: PatientCase): Promise<FullCdssReport> {
  return await postJson<FullCdssReport>('/evaluate', data);
}

// -------------------------------------------------------------
// CLIENT-SIDE FALLBACK ENGINES (Guarantees 100% Offline Support)
// -------------------------------------------------------------

function fallbackCalculateStep1(req: Step1Request): SeverityAssessmentResult {
  const age = req.age || 0;
  const vitals = req.vitals || {};
  const labs = req.labs || {};
  const comorb = req.comorbidities || {};
  const img = req.imaging || {};

  // CURB-65
  let curb = 0;
  const curbDetails: string[] = [];
  if (vitals.alteredMentalStatus) { curb++; curbDetails.push('Rối loạn tri giác (C)'); }
  if (labs.ureaMmolL && labs.ureaMmolL > 7.0) { curb++; curbDetails.push('Ure máu > 7 mmol/L (U)'); }
  if (vitals.respiratoryRate && vitals.respiratoryRate >= 30) { curb++; curbDetails.push('Tần số thở ≥ 30 lần/phút (R)'); }
  if ((vitals.systolicBp && vitals.systolicBp < 90) || (vitals.diastolicBp && vitals.diastolicBp <= 60)) {
    curb++; curbDetails.push('Huyết áp tâm thu < 90 hoặc tâm trương ≤ 60 mmHg (B)');
  }
  if (age >= 65) { curb++; curbDetails.push('Tuổi ≥ 65 (65)'); }

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
  let psi = req.gender === 'FEMALE' ? age - 10 : age;
  const psiDetails: string[] = [req.gender === 'FEMALE' ? `Nữ: ${age} - 10 = ${psi} điểm` : `Nam: ${age} điểm`];
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
  if (vitals.heartRate && vitals.heartRate >= 125) { smart += 1; smartDetails.push('Mạch ≥ 125 bpm (T: +1)'); }
  if (vitals.alteredMentalStatus) { smart += 1; smartDetails.push('Rối loạn ý thức (C: +1)'); }
  if ((age <= 50 && vitals.spo2 && vitals.spo2 <= 93) || (age > 50 && vitals.spo2 && vitals.spo2 <= 90)) {
    smart += 2; smartDetails.push('Oxy hóa máu giảm nặng (O: +2)');
  }
  if (labs.arterialPh && labs.arterialPh < 7.35) { smart += 2; smartDetails.push('pH động mạch < 7.35 (P: +2)'); }

  const smartRisk = smart >= 5 ? 'Nguy cơ rất cao cần hỗ trợ hô hấp / vận mạch (IRVS: 67%)' :
                    smart >= 3 ? 'Nguy cơ trung bình (IRVS: 12.7%)' : 'Nguy cơ thấp (IRVS: ~4%)';

  // ATS 2007
  const atsMajorMet: string[] = [];
  if (img.septicShockVasopressors || vitals.onAggressiveFluidResuscitation) atsMajorMet.push('Sốc nhiễm khuẩn cần dùng vận mạch');
  if (img.mechanicalVentilation) atsMajorMet.push('Suy hô hấp cần thở máy xâm nhập');

  const atsMinorMet: string[] = [];
  if (vitals.respiratoryRate && vitals.respiratoryRate >= 30) atsMinorMet.push('Nhịp thở ≥ 30 lần/phút');
  if (labs.pao2Fio2Ratio && labs.pao2Fio2Ratio <= 250) atsMinorMet.push('PaO2/FiO2 ≤ 250');
  if (img.multilobarInfiltrates) atsMinorMet.push('Tổn thương nhiều thùy trên X-quang/CT');
  if (vitals.alteredMentalStatus) atsMinorMet.push('Lú lẫn / mất định hướng');
  if (labs.ureaMmolL && labs.ureaMmolL >= 7.14) atsMinorMet.push('Ure máu ≥ 7.14 mmol/L');
  if (labs.wbcGL && labs.wbcGL < 4.0) atsMinorMet.push('Bạch cầu máu < 4.0 G/L');
  if (labs.plateletsGL && labs.plateletsGL < 100) atsMinorMet.push('Tiểu cầu < 100 G/L');
  if (vitals.temperature && vitals.temperature < 36.0) atsMinorMet.push('Hạ thân nhiệt < 36.0°C');
  if (vitals.systolicBp && vitals.systolicBp < 90) atsMinorMet.push('Tụt huyết áp cần bù dịch tích cực');

  const atsSevere = atsMajorMet.length >= 1 || atsMinorMet.length >= 3;

  let severity = 'Nhẹ (Mild)';
  let careSetting = 'Ngoại trú (Nhẹ)';

  if (atsSevere || smart >= 5 || curb >= 3 || psi > 130) {
    severity = 'Nặng (Severe) / Nguy kịch';
    careSetting = 'ICU (Khoa Hồi sức tích cực)';
  } else if (curb === 2 || (psi >= 71 && psi <= 130) || smart >= 3) {
    severity = 'Trung bình (Moderate)';
    careSetting = 'Nội trú (Khoa Nội tổng quát / Hô hấp)';
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
    smartCopRisk: smartRisk,
    smartCopDetails: smartDetails,
    atsSevereCap: atsSevere,
    atsMajorCount: atsMajorMet.length,
    atsMinorCount: atsMinorMet.length,
    atsMajorCriteriaMet: atsMajorMet,
    atsMinorCriteriaMet: atsMinorMet,
    severityLevel: severity,
    recommendedCareSetting: careSetting,
    syndromeSummary: [
      'Hội chứng nhiễm trùng / nhiễm độc: Sốt/hạ thân nhiệt, môi khô, lưỡi bẩn, hơi thở hôi.',
      'Hội chứng đông đặc nhu mô phổi: Rung thanh tăng, gõ đục, rì rào phế nang giảm, ran nổ/ran ẩm.'
    ],
    routineLabOrders: [
      '1. Tổng phân tích tế bào máu ngoại vi (CTM): WBC, NEU, PLT, Hct.',
      '2. Sinh hóa máu: Ure, Creatinine, eGFR, Men gan (AST, ALT), Glucose, Điện giải đồ.',
      '3. Dấu ấn viêm: Định lượng Procalcitonin (PCT) hoặc CRP định lượng.',
      '4. Chẩn đoán hình ảnh: X-quang phổi thẳng / Nghiêng hoặc CT ngực liều thấp.',
      '5. Vi sinh: Nhuộm soi và cấy đờm + Kháng sinh đồ; Cấy máu x 2 mẫu trước khi dùng KS.'
    ],
    clinicalNotes: [
      careSetting.includes('ICU')
        ? 'Bệnh nhân có chỉ định nhập khoa ICU khẩn cấp do suy hô hấp / huyết động không ổn định.'
        : careSetting.includes('Nội trú')
        ? 'Chỉ định nhập viện điều trị nội trú theo dõi sát SpO2 và đáp ứng kháng sinh.'
        : 'Đủ điều kiện điều trị ngoại trú an toàn, hướng dẫn bệnh nhân tái khám sau 48-72 giờ.'
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
  const setting = data.careSetting || 'OUTPATIENT';
  const pseudo = !!data.hasPseudomonasRisk;
  const mrsa = !!data.hasMrsaRisk;

  if (setting === 'ICU' || pseudo || mrsa) {
    return {
      careSetting: 'Hồi sức tích cực (ICU) / Có yếu tố nguy cơ P. aeruginosa & MRSA',
      selectedRegimen: {
        primaryRegimen: pseudo
          ? 'Piperacillin/Tazobactam 4.5g TTM mỗi 6h (truyền kéo dài 3-4h) + Levofloxacin 750mg TTM mỗi 24h'
          : 'Ceftriaxone 2g TTM mỗi 24h + Levofloxacin 750mg TTM mỗi 24h (hoặc Azithromycin 500mg/ngày)',
        alternativeRegimen: 'Meropenem 1g TTM mỗi 8h + Moxifloxacin 400mg TTM mỗi 24h' + (mrsa ? ' + Vancomycin 15-20mg/kg mỗi 8-12h' : ''),
        dosageDetails: 'Khởi đầu kháng sinh tĩnh mạch trong vòng 1-2 giờ đầu sau khi nhập viện.',
        administrationRoute: 'Đường tĩnh mạch (IV)',
        recommendedDurationDays: '7 - 10 ngày (14 ngày nếu do P. aeruginosa hoặc vi khuẩn tạo hang)',
        clinicalNotes: [
          'Đo nồng độ đáy Vancomycin (trough level 15-20 mcg/mL) trước liều thứ 4.',
          'Theo dõi chức năng thận Creatinine/eGFR hàng ngày.'
        ]
      },
      hasPseudomonasCoverage: pseudo,
      hasMrsaCoverage: mrsa,
      hasAtypicalCoverage: true,
      hasEsblCoverage: false,
      hasAnaerobeCoverage: false,
      hasMelioidosisCoverage: false
    };
  } else if (setting === 'INPATIENT_WARD') {
    return {
      careSetting: 'Nội trú khoa Nội tổng quát / Hô hấp (Không có yếu tố nguy cơ vi khuẩn đa kháng)',
      selectedRegimen: {
        primaryRegimen: 'Ampicillin/Sulbactam 1.5g - 3g TTM mỗi 6h HOẶC Ceftriaxone 1-2g TTM mỗi 24h + Azithromycin 500mg TTM/Uống mỗi 24h',
        alternativeRegimen: 'Đơn trị liệu Quinolone hô hấp: Levofloxacin 750mg TTM/Uống mỗi 24h HOẶC Moxifloxacin 400mg TTM/Uống mỗi 24h',
        dosageDetails: 'Dùng đường tiêm tĩnh mạch giai đoạn đầu, chuyển uống sau khi bệnh nhân ổn định lâm sàng.',
        administrationRoute: 'Đường tĩnh mạch (IV) -> Chuyển uống (PO)',
        recommendedDurationDays: '5 - 7 ngày',
        clinicalNotes: ['Đánh giá chuyển sang kháng sinh đường uống sau 48-72 giờ nếu hết sốt và ăn uống được.']
      },
      hasPseudomonasCoverage: false,
      hasMrsaCoverage: false,
      hasAtypicalCoverage: true,
      hasEsblCoverage: false,
      hasAnaerobeCoverage: false,
      hasMelioidosisCoverage: false
    };
  } else {
    return {
      careSetting: 'Ngoại trú (Ambulatory / Phòng khám)',
      selectedRegimen: {
        primaryRegimen: 'Amoxicillin 1g uống mỗi 8h (3g/ngày) HOẶC Amoxicillin/Clavulanate 875/125mg uống mỗi 12h + Azithromycin 500mg ngày 1, sau đó 250mg ngày 2-5',
        alternativeRegimen: 'Cefuroxime axetil 500mg uống mỗi 12h HOẶC Doxycycline 100mg uống mỗi 12h',
        dosageDetails: 'Uống sau bữa ăn, uống đủ nước.',
        administrationRoute: 'Đường uống (PO)',
        recommendedDurationDays: '5 ngày',
        clinicalNotes: ['Hướng dẫn bệnh nhân tái khám ngay nếu sốt cao liên tục >48h, khó thở tăng hoặc đau ngực nhiều.']
      },
      hasPseudomonasCoverage: false,
      hasMrsaCoverage: false,
      hasAtypicalCoverage: true,
      hasEsblCoverage: false,
      hasAnaerobeCoverage: false,
      hasMelioidosisCoverage: false
    };
  }
}

function fallbackCalculateStep5Targeted(req: Step5TargetedRequest): TargetedRegimenResult {
  const pId = (req.pathogenId || '').toLowerCase();

  if (pId.includes('pneumoniae') && !pId.includes('klebsiella')) {
    const mic = req.micPenicillin || 1.0;
    if (mic <= 2.0) {
      return {
        pathogenName: 'Streptococcus pneumoniae (Phế cầu nhạy Penicillin, MIC ≤ 2 mcg/mL)',
        targetedAntibiotics: ['Penicillin G 2-4 triệu đơn vị TTM mỗi 4-6h', 'Ceftriaxone 1-2g TTM mỗi 24h', 'Amoxicillin 1g uống mỗi 8h'],
        duration: '5 - 7 ngày',
        monitoringAndWarnings: ['Đáp ứng tốt với Beta-lactam liều chuẩn.']
      };
    } else if (mic < 8.0) {
      return {
        pathogenName: `Streptococcus pneumoniae (Trung gian Penicillin, MIC = ${mic} mcg/mL)`,
        targetedAntibiotics: ['Ceftaroline 600mg TTM mỗi 12h', 'Levofloxacin 750mg TTM mỗi 24h', 'Ceftriaxone liều cao 2g TTM mỗi 12h'],
        duration: '7 - 10 ngày',
        monitoringAndWarnings: ['Kháng trung gian với Penicillin liều chuẩn, cần dùng kháng sinh thế hệ mới hoặc Quinolone hô hấp.']
      };
    } else {
      return {
        pathogenName: `Streptococcus pneumoniae (Kháng Penicillin, MIC = ${mic} mcg/mL ≥ 8)`,
        targetedAntibiotics: ['Vancomycin 15-20 mg/kg TTM mỗi 8-12h', 'Linezolid 600mg TTM/Uống mỗi 12h'],
        duration: '10 - 14 ngày',
        monitoringAndWarnings: ['Đo nồng độ đáy Vancomycin mục tiêu 15-20 mcg/mL.']
      };
    }
  } else if (pId.includes('pseudomallei') || pId.includes('whitmore')) {
    return {
      pathogenName: 'Burkholderia pseudomallei (Bệnh Whitmore)',
      targetedAntibiotics: [
        'Giai đoạn tấn công (≥ 14 ngày): Ceftazidime 2g TTM mỗi 6-8h HOẶC Meropenem 1g TTM mỗi 8h',
        'Giai đoạn duy trì (12 - 24 tuần): Cotrimoxazole (TMP/SMX) 160/800mg: 2 viên x 2 lần/ngày (kèm Acid Folic 5mg/ngày)'
      ],
      dosageAndAdministration: 'Cần tuân thủ đủ 2 giai đoạn: Tấn công tĩnh mạch + Duy trì đường uống kéo dài.',
      duration: 'Tấn công 2 - 4 tuần; Duy trì 3 - 6 tháng',
      monitoringAndWarnings: [
        'Nguy cơ tái phát cao nếu ngừng thuốc duy trì sớm.',
        'Theo dõi công thức máu và chức năng gan thận định kỳ trong giai đoạn duy trì TMP/SMX.'
      ]
    };
  }

  return {
    pathogenName: req.pathogenId || 'Vi khuẩn phân lập',
    targetedAntibiotics: ['Ceftriaxone 2g TTM mỗi 24h', 'Levofloxacin 750mg TTM mỗi 24h'],
    duration: '7 ngày',
    monitoringAndWarnings: ['Điều chỉnh kháng sinh theo kết quả kháng sinh đồ (MIC).']
  };
}

function fallbackCalculateOralStepDown(req: OralStepDownRequest): OralStepDownResult {
  const metDetails: string[] = [];
  let count = 0;

  if (req.temp < 37.8) { count++; metDetails.push('Nhiệt độ ≤ 37.8°C trong ít nhất 24 giờ'); }
  if (req.hr < 100) { count++; metDetails.push('Tần số tim < 100 chu kỳ/phút'); }
  if (req.rr < 24) { count++; metDetails.push('Tần số thở < 24 lần/phút'); }
  if (req.sbp >= 90) { count++; metDetails.push('Huyết áp tâm thu ≥ 90 mmHg'); }
  if (req.spo2 >= 90) { count++; metDetails.push('Độ bão hòa oxy SpO2 ≥ 90% (khí trời)'); }
  if (req.canEatAndSwallow) { count++; metDetails.push('Có khả năng ăn uống và hấp thu thuốc đường tiêu hóa'); }
  if (req.normalMentalStatus) { count++; metDetails.push('Tình trạng tri giác / ý thức bình thường'); }

  const eligible = count === 7;

  return {
    eligible,
    metCriteriaCount: count,
    totalCriteriaCount: 7,
    criteriaDetails: metDetails,
    suggestedOralRegimens: eligible ? [
      'Amoxicillin/Clavulanate 875/125mg: 1 viên x 2 lần/ngày',
      'Levofloxacin 750mg: 1 viên x 1 lần/ngày',
      'Moxifloxacin 400mg: 1 viên x 1 lần/ngày',
      'Cefuroxime axetil 500mg: 1 viên x 2 lần/ngày'
    ] : [],
    clinicalGuidance: eligible
      ? 'Bệnh nhân ĐỦ ĐIỀU KIỆN chuyển từ kháng sinh tiêm truyền sang kháng sinh đường uống an toàn (Oral Step-down).'
      : `Bệnh nhân CHƯA ĐỦ ĐIỀU KIỆN chuyển uống (đạt ${count}/7 tiêu chí). Tiếp tục duy trì phác đồ tiêm truyền tĩnh mạch.`
  };
}

function fallbackCalculateResponse72h(req: Response72hRequest): TreatmentResponse72hResult {
  const isFail = !!(req.hrGt125OrRrGt33 || req.bpLt9060 || req.imagingWorsening || req.atsScoreIncreased || req.respFailureWorsening);

  let pctText = 'Không có dữ liệu động học Procalcitonin.';
  if (req.pctD0 !== undefined && req.pctD3 !== undefined && req.pctD0 > 0) {
    const drop = ((req.pctD0 - req.pctD3) / req.pctD0) * 100;
    if (drop >= 80) {
      pctText = `PCT giảm ${drop.toFixed(1)}% (≥80%): Đáp ứng điều trị rất thuận lợi. Tiên lượng tốt.`;
    } else if (drop >= 50) {
      pctText = `PCT giảm ${drop.toFixed(1)}% (50-80%): Đáp ứng điều trị một phần. Cần theo dõi tiếp.`;
    } else {
      pctText = `PCT không giảm hoặc tăng (D0=${req.pctD0}, D3=${req.pctD3}): Nguy cơ cao thất bại điều trị hoặc vi khuẩn kháng thuốc!`;
    }
  }

  return {
    responseStatus: isFail ? 'Thất bại điều trị / Diễn tiến xấu sau 72h' : 'Đáp ứng điều trị tốt sau 72h',
    pctKineticsInterpretation: pctText,
    isTreatmentFailure: isFail,
    recommendedActions: isFail ? [
      '1. Đánh giá lại toàn diện lâm sàng, cấy lặp lại đờm và cấy máu.',
      '2. Chụp CT ngực tìm biến chứng: Tràn dịch/mủ màng phổi, áp xe hóa, thuyên tắc phổi.',
      '3. Nâng bậc phác đồ kháng sinh: Đổi sang nhóm kháng Pseudomonas (Meropenem, Pip/Tazo) + phủ MRSA (Vancomycin, Linezolid).',
      '4. Hội chẩn chuyên khoa Truyền nhiễm / Hồi sức tích cực.'
    ] : [
      '1. Tiếp tục duy trì phác đồ kháng sinh hiện tại.',
      '2. Đánh giá tiêu chí chuyển sang kháng sinh đường uống (Oral Step-down).',
      '3. Lên kế hoạch xuất viện khi người bệnh ổn định.'
    ]
  };
}
