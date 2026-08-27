import { CareSetting, ClinicalRiskProfile, PathogenEngineResult, PatientComorbidities, PatientImagingAndIntervention } from '../models/types.js';

export class Step2PathogenEngine {

  public evaluate(
    careSetting: CareSetting = 'OUTPATIENT',
    riskProfile?: ClinicalRiskProfile,
    pleuralEffusion: boolean = false,
    comorbidities?: PatientComorbidities,
    imaging?: PatientImagingAndIntervention,
    severityLevel?: string,
    age?: number
  ): PathogenEngineResult {
    const r = riskProfile || {};
    const c = comorbidities || {};
    const img = imaging || {};
    const settingStr = String(careSetting);

    // 1. Core Risk Determinations
    const pseudomonasRisk = !!(
      r.priorPseudomonasIsolation ||
      r.recentHospitalization90d ||
      r.recentIvAntibiotics90d ||
      r.structuralLungDiseaseBronchiectasis ||
      r.frequentCopdExacerbationsSteroids ||
      c.copdChronicLung ||
      c.neutropenia
    );

    const mrsaRisk = !!(
      r.priorMrsaIsolation ||
      r.recentMrsaContact ||
      r.skinInfectionsWounds ||
      r.postInfluenzaSuperinfection ||
      c.recentInfluenzaOrMeasles
    );

    const esblRisk = !!(
      r.esblRiskColonization ||
      r.immunosuppressiveTherapy ||
      c.diabetes ||
      c.cerebrovascularDisease ||
      c.alcoholism ||
      c.psychiatricIllness
    );

    const atypicalRisk = !!(
      r.atypicalEpidemicContext ||
      r.birdBatExposurePsittacosis
    );

    const anaerobeRisk = !!(
      r.poorDentalHygieneAspiration ||
      r.lossOfConsciousnessAlcoholism ||
      r.severeDysphagia ||
      c.alcoholism ||
      c.cerebrovascularDisease
    );

    const melioidosisRisk = !!(
      (c.diabetes || c.renalDisease || c.liverDisease || r.diabetesMellitusChronicLiverRenal) &&
      (r.exposureSoilWaterFlooding || r.recentTravelEndemicMelioidosis)
    );

    const pjpRisk = !!(
      c.hivCd4Under200 ||
      (c.immunocompromised && r.immunosuppressiveTherapy)
    );

    // 2. Setting-based typical pathogens
    const likelyPathogens: string[] = [];

    if (settingStr.includes('ICU')) {
      likelyPathogens.push('Streptococcus pneumoniae (Phế cầu khuẩn)');
      likelyPathogens.push('Staphylococcus aureus (Tụ cầu vàng MSSA/MRSA)');
      likelyPathogens.push('Legionella pneumophila');
      likelyPathogens.push('Trực khuẩn Gram âm đường ruột (Klebsiella pneumoniae, E. coli)');
      likelyPathogens.push('Haemophilus influenzae');
      if (pseudomonasRisk || true) likelyPathogens.push('Pseudomonas aeruginosa (Trực khuẩn mủ xanh)');
      if (c.alcoholism) likelyPathogens.push('Acinetobacter baumannii');
      if (melioidosisRisk) likelyPathogens.push('Burkholderia pseudomallei (Bệnh Whitmore)');
      if (pjpRisk) likelyPathogens.push('Pneumocystis jirovecii (PJP)');
    } else if (settingStr.includes('INPATIENT') || settingStr.includes('Nội trú')) {
      likelyPathogens.push('Streptococcus pneumoniae (Phế cầu khuẩn)');
      likelyPathogens.push('Haemophilus influenzae');
      likelyPathogens.push('Mycoplasma pneumoniae / Chlamydia pneumoniae');
      likelyPathogens.push('Legionella pneumophila');
      likelyPathogens.push('Trực khuẩn Gram âm đường ruột (Klebsiella pneumoniae)');
      likelyPathogens.push('Virus đường hô hấp (Cúm A/B, RSV, SARS-CoV-2, HMPV)');
      likelyPathogens.push('Bordetella pertussis (Ho gà ở người lớn)');
      if (anaerobeRisk) likelyPathogens.push('Vi khuẩn kỵ khí vùng hầu họng / Nhiễm trùng phối hợp (Polymicrobial)');
      if (pseudomonasRisk) likelyPathogens.push('Pseudomonas aeruginosa');
      if (mrsaRisk) likelyPathogens.push('Staphylococcus aureus (MRSA/MSSA)');
      if (melioidosisRisk) likelyPathogens.push('Burkholderia pseudomallei (Bệnh Whitmore)');
      if (pjpRisk) likelyPathogens.push('Pneumocystis jirovecii (PJP)');
    } else {
      // Outpatient
      likelyPathogens.push('Streptococcus pneumoniae (Phế cầu khuẩn)');
      likelyPathogens.push('Mycoplasma pneumoniae');
      likelyPathogens.push('Haemophilus influenzae');
      likelyPathogens.push('Chlamydia pneumoniae');
      likelyPathogens.push('Moraxella catarrhalis');
      likelyPathogens.push('Virus đường hô hấp (Cúm A/B, Adenovirus, Rhinovirus)');
      if (c.smoking) likelyPathogens.push('H. influenzae / M. catarrhalis (Cơ địa hút thuốc)');
      if (c.alcoholism) likelyPathogens.push('Klebsiella pneumoniae (Cơ địa nghiện rượu)');
    }

    // Cross-setting comorbidity mappings (from spec)
    if (c.psychiatricIllness) {
      if (!likelyPathogens.some(p => p.includes('Klebsiella'))) {
        likelyPathogens.push('Klebsiella pneumoniae (Cơ địa bệnh tâm thần / TB mạn não)');
      }
    }
    if (c.gammaGlobulinDeficiency) {
      likelyPathogens.push('S. pneumoniae + H. influenzae (Giảm Gamma globulin huyết thanh)');
    }

    // 3. Indicated Diagnostic Tests
    const indicatedDiagnosticTests: string[] = [];

    if (settingStr.includes('ICU') || settingStr.includes('INPATIENT') || settingStr.includes('Nội trú')) {
      indicatedDiagnosticTests.push('Nhuộm soi Gram và cấy đờm đàm tìm vi khuẩn gây bệnh + Kháng sinh đồ (KSĐ) trước khi dùng kháng sinh.');
      indicatedDiagnosticTests.push('Cấy máu 2 vị trí (2 chai kỵ khí + 2 chai ái khí) trước khi bắt đầu liều kháng sinh đầu tiên.');
    }

    if (settingStr.includes('ICU') || settingStr.includes('INPATIENT') || settingStr.includes('Nội trú')) {
      indicatedDiagnosticTests.push('Xét nghiệm PCR đa mồi tìm virus hô hấp (Influenza A/B, RSV, SARS-CoV-2) và vi khuẩn nội bào.');
      indicatedDiagnosticTests.push('Tìm kháng nguyên Legionella pneumophila serogroup 1 trong nước tiểu.');
      indicatedDiagnosticTests.push('Tìm kháng nguyên Phế cầu (S. pneumoniae) trong nước tiểu.');
      if (mrsaRisk) indicatedDiagnosticTests.push('Test nhanh PCR dịch tỵ hầu tìm gen mecA (MRSA) hoặc cấy sàng lọc MRSA.');
    }

    if (pseudomonasRisk) {
      indicatedDiagnosticTests.push('Cấy đờm định lượng và làm kháng sinh đồ chuyên biệt cho Pseudomonas aeruginosa (kèm đo MIC).');
    }

    if (melioidosisRisk) {
      indicatedDiagnosticTests.push('Xét nghiệm khẳng định Burkholderia pseudomallei: Cấy máu, cấy đờm, cấy nước tiểu, cấy mủ ổ áp xe (nếu có) trên môi trường Ashdown.');
    }

    if (pjpRisk) {
      indicatedDiagnosticTests.push('Soi tươi nhuộm Giemsa/Grocott hoặc Real-time PCR tìm Pneumocystis jirovecii trong đờm cảm ứng / dịch rửa phế quản (BAL).');
    }

    if (pleuralEffusion) {
      indicatedDiagnosticTests.push('Chọc dò dịch màng phổi chẩn đoán (nếu lớp dịch > 10mm trên phim nằm nghiêng hoặc siêu âm): Sinh hóa (pH, Protein, LDH, Glucose), tế bào học, nhuộm Gram, cấy tìm vi khuẩn và cấy tìm vi khuẩn lao (AFB/GeneXpert).');
    }

    if (settingStr.includes('OUTPATIENT') || settingStr.includes('Ngoại trú')) {
      indicatedDiagnosticTests.push('Bệnh nhân ngoại trú thông thường không bắt buộc làm xét nghiệm vi sinh thường quy, trừ khi nghi ngờ dịch tễ Cúm/COVID-19.');
    }

    // 4. Chest CT Scan Indications (5 criteria from XMind)
    const chestCtScanIndications: string[] = [];
    const isSevere = settingStr.includes('ICU') || (severityLevel && severityLevel.includes('Nặng'));
    const isImmunocompromised = !!(c.immunocompromised || c.hivCd4Under200 || r.immunosuppressiveTherapy);

    if (isSevere) {
      chestCtScanIndications.push('1. Viêm phổi mức độ nặng (theo tiêu chuẩn ATS/IDSA hoặc SMART-COP): Khảo sát chi tiết mức độ đông đặc và biến chứng hoại tử.');
    }
    if (isImmunocompromised) {
      chestCtScanIndications.push('2. Viêm phổi trên người bệnh suy giảm miễn dịch: Tìm tổn thương kính mờ (GGO) của PJP, nốt đơn/đa ổ của nấm Aspergillus hoặc CMV.');
    }
    if (img.recurrentPneumonia) {
      chestCtScanIndications.push('3. Viêm phổi tái phát cùng một vị trí: Tầm soát dị vật phế quản, giãn phế quản cục bộ hoặc u phế quản chèn ép.');
    }
    if (img.unclearInfiltrateHighSuspicion) {
      chestCtScanIndications.push('4. Lâm sàng nghi ngờ cao nhưng hình ảnh X-quang thường quy không rõ ràng / âm tính giả.');
    }
    if (img.suspectUnderlyingMassOrTb || img.lungCavityOrNecrosis) {
      chestCtScanIndications.push('5. Nghi ngờ bệnh lý hô hấp kèm theo / Chẩn đoán phân biệt: U phổi, áp xe hóa, hang lao hoặc thuyên tắc phổi.');
    }

    // 5. Risk Warnings
    const riskWarnings: string[] = [];
    if (pseudomonasRisk) {
      riskWarnings.push('CẢNH BÁO: Bệnh nhân có yếu tố nguy cơ nhiễm Pseudomonas aeruginosa. Cần bao phủ kháng sinh có hoạt tính kháng trực khuẩn mủ xanh (Antipseudomonal Beta-lactam).');
    }
    if (mrsaRisk) {
      riskWarnings.push('CẢNH BÁO: Bệnh nhân có yếu tố nguy cơ nhiễm Tụ cầu vàng kháng Methicillin (MRSA). Cân nhắc bổ sung Vancomycin hoặc Linezolid.');
    }
    if (melioidosisRisk) {
      riskWarnings.push('CẢNH BÁO NGUY CƠ WHITMORE: Bệnh nhân có cơ địa đái tháo đường/bệnh gan/thận kèm tiếp xúc đất nước lũ. Bắt buộc xem xét điều trị tấn công Ceftazidime hoặc Meropenem.');
    }
    if (pjpRisk) {
      riskWarnings.push('CẢNH BÁO NGUY CƠ PJP: Bệnh nhân HIV/suy giảm miễn dịch nặng. Cần chỉ định Cotrimoxazole (TMP/SMX) liều cao điều trị PJP kèm Corticoid nếu PaO2 < 70 mmHg.');
    }
    if (anaerobeRisk) {
      riskWarnings.push('LƯU Ý: Nguy cơ viêm phổi hít / vi khuẩn kỵ khí. Ưu tiên Beta-lactam/chất ức chế Beta-lactamase (Ampicillin/Sulbactam, Amox/Clav) hoặc bổ sung Clindamycin / Metronidazole.');
    }
    // 6. Virus Subtype Prediction (from spec lines 80-93)
    const predictedVirusSubtypes: string[] = [];
    if (r.winterSeason) {
      predictedVirusSubtypes.push('Influenza A/B (Mùa đông - dịch tễ cao)');
    }
    if (isImmunocompromised) {
      predictedVirusSubtypes.push('Parainfluenza virus (Suy giảm miễn dịch)');
      predictedVirusSubtypes.push('RSV - Respiratory Syncytial Virus (Suy giảm miễn dịch)');
    }
    if (r.immunosuppressiveTherapy) {
      predictedVirusSubtypes.push('CMV - Cytomegalovirus (Đang dùng thuốc ức chế miễn dịch)');
    }
    if (r.boneMarrowTransplant) {
      predictedVirusSubtypes.push('RSV - Respiratory Syncytial Virus (Sau ghép tủy xương)');
    }
    if ((age !== undefined && (age > 65 || age < 10)) || c.nursingHomeResident) {
      predictedVirusSubtypes.push('HMPV - Human Metapneumovirus (Tuổi >65 hoặc <10 / Viện dưỡng lão)');
    }

    // 7. Fungal Fallback (spec: "không đáp ứng với các điều kiện → căn nguyên nấm")
    const fungalFallback = !pseudomonasRisk && !mrsaRisk && !esblRisk && !melioidosisRisk && !pjpRisk && !anaerobeRisk && !atypicalRisk;
    if (fungalFallback) {
      riskWarnings.push('LƯU Ý: Khi không tìm được yếu tố nguy cơ vi khuẩn đặc hiệu nào, cần xem xét CĂN NGUYÊN NẤM (Aspergillus, Cryptococcus, Histoplasma) đặc biệt ở bệnh nhân không đáp ứng kháng sinh kinh nghiệm sau 72h.');
    }

    return {
      likelyPathogens,
      pseudomonasRisk,
      mrsaRisk,
      esblRisk,
      atypicalRisk,
      anaerobeRisk,
      melioidosisRisk,
      pjpRisk,
      indicatedDiagnosticTests,
      chestCtScanIndications,
      riskWarnings,
      predictedVirusSubtypes: predictedVirusSubtypes.length > 0 ? predictedVirusSubtypes : undefined,
      fungalFallback
    };
  }
}
