import { CareSetting, ClinicalRiskProfile, PathogenEngineResult } from '../models/types.js';

export class Step2PathogenEngine {

  public evaluate(
    careSetting: CareSetting = 'OUTPATIENT',
    riskProfile?: ClinicalRiskProfile,
    pleuralEffusion: boolean = false
  ): PathogenEngineResult {
    const r = riskProfile || {};
    const settingStr = String(careSetting);

    // 1. Core Risk Determinations
    const pseudomonasRisk = !!(
      r.priorPseudomonasIsolation ||
      r.recentHospitalization90d ||
      r.recentIvAntibiotics90d ||
      r.structuralLungDiseaseBronchiectasis ||
      r.frequentCopdExacerbationsSteroids
    );

    const mrsaRisk = !!(
      r.priorMrsaIsolation ||
      r.recentMrsaContact ||
      r.skinInfectionsWounds
    );

    const esblRisk = !!(
      r.esblRiskColonization ||
      r.immunosuppressiveTherapy
    );

    const atypicalRisk = !!(
      r.atypicalEpidemicContext ||
      r.birdBatExposurePsittacosis
    );

    const anaerobeRisk = !!(
      r.poorDentalHygieneAspiration ||
      r.lossOfConsciousnessAlcoholism ||
      r.severeDysphagia
    );

    const melioidosisRisk = !!(
      r.diabetesMellitusChronicLiverRenal &&
      (r.exposureSoilWaterFlooding || r.recentTravelEndemicMelioidosis)
    );

    // 2. Setting-based typical pathogens
    const likelyPathogens: string[] = [];

    if (settingStr.includes('ICU')) {
      likelyPathogens.push('Streptococcus pneumoniae (Phế cầu khuẩn)');
      likelyPathogens.push('Staphylococcus aureus (Tụ cầu vàng MSSA/MRSA)');
      likelyPathogens.push('Legionella pneumophila');
      likelyPathogens.push('Trực khuẩn Gram âm đường ruột (Enterobacteriaceae: Klebsiella pneumoniae, E. coli)');
      likelyPathogens.push('Haemophilus influenzae');
      if (pseudomonasRisk) likelyPathogens.push('Pseudomonas aeruginosa (Trực khuẩn mủ xanh)');
      if (melioidosisRisk) likelyPathogens.push('Burkholderia pseudomallei (Bệnh Whitmore)');
    } else if (settingStr.includes('INPATIENT') || settingStr.includes('Nội trú')) {
      likelyPathogens.push('Streptococcus pneumoniae (Phế cầu khuẩn)');
      likelyPathogens.push('Haemophilus influenzae');
      likelyPathogens.push('Mycoplasma pneumoniae / Chlamydia pneumoniae');
      likelyPathogens.push('Legionella pneumophila');
      likelyPathogens.push('Virus đường hô hấp (Cúm A/B, RSV, SARS-CoV-2)');
      if (anaerobeRisk) likelyPathogens.push('Vi khuẩn kỵ khí vùng hầu họng (do hít sặc)');
      if (pseudomonasRisk) likelyPathogens.push('Pseudomonas aeruginosa');
      if (mrsaRisk) likelyPathogens.push('Staphylococcus aureus (MRSA/MSSA)');
      if (melioidosisRisk) likelyPathogens.push('Burkholderia pseudomallei (Bệnh Whitmore)');
    } else {
      // Outpatient
      likelyPathogens.push('Streptococcus pneumoniae (Phế cầu khuẩn)');
      likelyPathogens.push('Mycoplasma pneumoniae');
      likelyPathogens.push('Haemophilus influenzae');
      likelyPathogens.push('Chlamydia pneumoniae');
      likelyPathogens.push('Moraxella catarrhalis');
      likelyPathogens.push('Virus đường hô hấp (Cúm A/B, Adenovirus, Rhinovirus)');
    }

    // 3. Indicated Diagnostic Tests
    const indicatedDiagnosticTests: string[] = [];

    if (settingStr.includes('ICU') || settingStr.includes('INPATIENT') || settingStr.includes('Nội trú')) {
      indicatedDiagnosticTests.push('Nhuộm soi Gram và cấy đờm đàm tìm vi khuẩn gây bệnh + Kháng sinh đồ (KSĐ) trước khi dùng kháng sinh.');
      indicatedDiagnosticTests.push('Cấy máu 2 vị trí (2 chai kỵ khí + 2 chai ái khí) trước khi bắt đầu liều kháng sinh đầu tiên.');
    }

    if (settingStr.includes('ICU')) {
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

    if (pleuralEffusion) {
      indicatedDiagnosticTests.push('Chọc dò dịch màng phổi chẩn đoán (nếu lớp dịch > 10mm trên phim nằm nghiêng hoặc siêu âm): Sinh hóa (pH, Protein, LDH, Glucose), tế bào học, nhuộm Gram, cấy tìm vi khuẩn và cấy tìm vi khuẩn lao (AFB/GeneXpert).');
    }

    if (settingStr.includes('OUTPATIENT') || settingStr.includes('Ngoại trú')) {
      indicatedDiagnosticTests.push('Bệnh nhân ngoại trú thông thường không bắt buộc làm xét nghiệm vi sinh thường quy, trừ khi nghi ngờ dịch tễ Cúm/COVID-19.');
    }

    // 4. Risk Warnings
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
    if (anaerobeRisk) {
      riskWarnings.push('LƯU Ý: Nguy cơ viêm phổi hít / vi khuẩn kỵ khí. Ưu tiên Beta-lactam/chất ức chế Beta-lactamase (Ampicillin/Sulbactam, Amox/Clav) hoặc bổ sung Clindamycin / Metronidazole.');
    }

    return {
      likelyPathogens,
      pseudomonasRisk,
      mrsaRisk,
      esblRisk,
      atypicalRisk,
      anaerobeRisk,
      melioidosisRisk,
      indicatedDiagnosticTests,
      riskWarnings
    };
  }
}
