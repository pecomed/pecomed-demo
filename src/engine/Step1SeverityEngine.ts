import {
  Gender,
  PatientVitals,
  PatientLabs,
  PatientComorbidities,
  PatientImagingAndIntervention,
  ClinicalSymptoms,
  SeverityAssessmentResult
} from '../models/types.js';

export interface ScoreDetail<T> {
  score: T;
  details: string[];
}

export interface PsiResult {
  score: number;
  psiClass: string;
  details: string[];
}

export interface SmartCopResult {
  score: number;
  riskLevel: string;
  details: string[];
}

export interface AtsIdsaResult {
  majorCount: number;
  majorCriteria: string[];
  minorCount: number;
  minorCriteria: string[];
  isSevereCap: boolean;
}

export class Step1SeverityEngine {

  public calculateCrb65(age: number, vitals?: PatientVitals): ScoreDetail<number> {
    const v = vitals || {};
    let score = 0;
    const details: string[] = [];

    if (v.alteredMentalStatus) {
      score += 1;
      details.push('C: Lú lẫn / Thay đổi tri giác (+1)');
    }
    if ((v.respiratoryRate ?? 0) >= 30) {
      score += 1;
      details.push(`R: Nhịp thở >= 30 l/p (${v.respiratoryRate} l/p) (+1)`);
    }
    if (((v.systolicBp ?? 120) < 90) || ((v.diastolicBp ?? 80) <= 60)) {
      score += 1;
      details.push(`B: Huyết áp tụt (HA: ${v.systolicBp ?? 0}/${v.diastolicBp ?? 0} mmHg) (+1)`);
    }
    if (age >= 65) {
      score += 1;
      details.push(`65: Tuổi >= 65 (${age} tuổi) (+1)`);
    }

    return { score, details };
  }

  public calculateCurb65(age: number, vitals?: PatientVitals, labs?: PatientLabs): ScoreDetail<number | null> {
    const v = vitals || {};
    let ureaElevated = false;
    let ureaStr = '';

    if (labs?.ureaMmolL !== undefined && labs.ureaMmolL !== null) {
      if (labs.ureaMmolL > 7.0) {
        ureaElevated = true;
        ureaStr = `Ure máu > 7.0 mmol/L (${labs.ureaMmolL} mmol/L)`;
      }
    } else if (labs?.bunMgDl !== undefined && labs.bunMgDl !== null) {
      if (labs.bunMgDl >= 20.0) {
        ureaElevated = true;
        ureaStr = `BUN >= 20 mg/dL (${labs.bunMgDl} mg/dL)`;
      }
    } else {
      return {
        score: null,
        details: ['Chưa có xét nghiệm Ure/BUN máu để tính CURB-65 đầy đủ (Sử dụng CRB-65 thay thế).']
      };
    }

    let score = 0;
    const details: string[] = [];

    if (v.alteredMentalStatus) {
      score += 1;
      details.push('C: Lú lẫn / Thay đổi ý thức (+1)');
    }
    if (ureaElevated) {
      score += 1;
      details.push(`U: ${ureaStr} (+1)`);
    }
    if ((v.respiratoryRate ?? 0) >= 30) {
      score += 1;
      details.push(`R: Nhịp thở >= 30 l/p (${v.respiratoryRate} l/p) (+1)`);
    }
    if (((v.systolicBp ?? 120) < 90) || ((v.diastolicBp ?? 80) <= 60)) {
      score += 1;
      details.push(`B: Huyết áp tụt (HA: ${v.systolicBp ?? 0}/${v.diastolicBp ?? 0} mmHg) (+1)`);
    }
    if (age >= 65) {
      score += 1;
      details.push(`65: Tuổi >= 65 (${age} tuổi) (+1)`);
    }

    return { score, details };
  }

  public calculatePsi(
    age: number,
    gender: Gender = 'MALE',
    comorb?: PatientComorbidities,
    vitals?: PatientVitals,
    labs?: PatientLabs,
    imaging?: PatientImagingAndIntervention
  ): PsiResult {
    const v = vitals || {};
    const c = comorb || {};
    const l = labs || {};
    const img = imaging || {};
    const isMale = gender === 'MALE' || gender === 'Nam';

    let score = 0;
    const details: string[] = [];

    // 1. Demographic factors
    if (isMale) {
      score += age;
      details.push(`Nam giới: +${age} điểm`);
    } else {
      const fScore = Math.max(0, age - 10);
      score += fScore;
      details.push(`Nữ giới (Tuổi - 10): +${fScore} điểm (${age}-10)`);
    }

    if (c.nursingHomeResident) {
      score += 10;
      details.push('Nơi ở: Viện dưỡng lão / Nhà điều dưỡng (+10)');
    }

    // 2. Comorbid conditions
    if (c.neoplasm) { score += 30; details.push('Bệnh ác tính / Ung thư (+30)'); }
    if (c.liverDisease) { score += 20; details.push('Bệnh gan mạn tính (+20)'); }
    if (c.congestiveHeartFailure) { score += 10; details.push('Suy tim ứ huyết (+10)'); }
    if (c.cerebrovascularDisease) { score += 10; details.push('Bệnh mạch máu não / Tai biến (+10)'); }
    if (c.renalDisease) { score += 10; details.push('Bệnh thận mạn tính (+10)'); }

    // 3. Physical examination findings
    if (v.alteredMentalStatus) { score += 20; details.push('Thay đổi tri giác (+20)'); }
    if ((v.respiratoryRate ?? 0) >= 30) { score += 20; details.push(`Nhịp thở >= 30 l/p (${v.respiratoryRate} l/p) (+20)`); }
    if (v.systolicBp !== undefined && v.systolicBp < 90) { score += 20; details.push(`Huyết áp tâm thu < 90 mmHg (${v.systolicBp} mmHg) (+20)`); }
    if (v.temperature !== undefined && (v.temperature < 35.0 || v.temperature >= 40.0)) {
      score += 15; details.push(`Thân nhiệt < 35°C hoặc >= 40°C (${v.temperature}°C) (+15)`);
    }
    if ((v.heartRate ?? 0) >= 125) { score += 10; details.push(`Nhịp tim >= 125 l/p (${v.heartRate} l/p) (+10)`); }

    // 4. Lab & radiographic findings
    if (l.arterialPh !== undefined && l.arterialPh < 7.35) { score += 30; details.push(`pH máu động mạch < 7.35 (${l.arterialPh}) (+30)`); }
    const bunElevated = l.bunMgDl !== undefined && l.bunMgDl >= 30.0;
    const ureaElevated = l.ureaMmolL !== undefined && l.ureaMmolL >= 11.0;
    if (bunElevated) { score += 20; details.push(`BUN >= 30 mg/dL (${l.bunMgDl} mg/dL) (+20)`); }
    else if (ureaElevated) { score += 20; details.push(`Ure máu >= 11 mmol/L (${l.ureaMmolL} mmol/L) (+20)`); }

    if (l.sodiumMmolL !== undefined && l.sodiumMmolL < 130.0) { score += 20; details.push(`Natri máu < 130 mmol/L (${l.sodiumMmolL} mmol/L) (+20)`); }
    if (l.glucoseMmolL !== undefined && l.glucoseMmolL >= 14.0) { score += 10; details.push(`Đường máu >= 14 mmol/L (${l.glucoseMmolL} mmol/L) (+10)`); }
    if (l.hematocritPct !== undefined && l.hematocritPct < 30.0) { score += 10; details.push(`Hematocrit < 30% (${l.hematocritPct}%) (+10)`); }

    if (l.pao2Mmhg !== undefined && l.pao2Mmhg < 60.0) {
      score += 10; details.push(`PaO2 < 60 mmHg (${l.pao2Mmhg} mmHg) (+10)`);
    } else if ((v.spo2 ?? 100) < 90.0) {
      score += 10; details.push(`SpO2 < 90% (${v.spo2}%) (+10)`);
    }

    if (img.pleuralEffusion) { score += 10; details.push('Tràn dịch màng phổi (+10)'); }

    // PSI Class Determination
    const hasComorb = c.neoplasm || c.liverDisease || c.congestiveHeartFailure || c.cerebrovascularDisease || c.renalDisease || c.nursingHomeResident;
    const hasAbnormalVitals = v.alteredMentalStatus || (v.respiratoryRate ?? 0) >= 30 || ((v.systolicBp ?? 120) < 90) ||
      (v.temperature !== undefined && (v.temperature < 35.0 || v.temperature >= 40.0)) || ((v.heartRate ?? 0) >= 125);
    const hasLabOrImaging = (l.arterialPh !== undefined && l.arterialPh < 7.35) || bunElevated || ureaElevated ||
      (l.sodiumMmolL !== undefined && l.sodiumMmolL < 130.0) || (l.glucoseMmolL !== undefined && l.glucoseMmolL >= 14.0) ||
      (l.hematocritPct !== undefined && l.hematocritPct < 30.0) || (l.pao2Mmhg !== undefined && l.pao2Mmhg < 60.0) ||
      ((v.spo2 ?? 100) < 90.0) || img.pleuralEffusion;

    let psiClass: string;
    if (age <= 50 && !hasComorb && !hasAbnormalVitals && !hasLabOrImaging && score <= 50) {
      psiClass = 'Tầng I (Class I - Rất nhẹ, tỉ lệ tử vong 0.1-0.4%)';
    } else if (score <= 70) {
      psiClass = 'Tầng II (Class II - Nhẹ, <=70 điểm, tỉ lệ tử vong 0.6-0.7%)';
    } else if (score <= 90) {
      psiClass = 'Tầng III (Class III - Trung bình, 71-90 điểm, tỉ lệ tử vong 0.9-2.8%)';
    } else if (score <= 130) {
      psiClass = 'Tầng IV (Class IV - Nặng, 91-130 điểm, tỉ lệ tử vong 8.2-9.3%)';
    } else {
      psiClass = 'Tầng V (Class V - Rất nặng, >130 điểm, tỉ lệ tử vong 27-31%)';
    }

    return { score, psiClass, details };
  }

  public calculateSmartCop(
    age: number,
    vitals?: PatientVitals,
    labs?: PatientLabs,
    imaging?: PatientImagingAndIntervention
  ): SmartCopResult {
    const v = vitals || {};
    const l = labs || {};
    const img = imaging || {};

    let score = 0;
    const details: string[] = [];

    // S: Systolic BP < 90 mmHg (2 pts)
    if (v.systolicBp !== undefined && v.systolicBp < 90) {
      score += 2;
      details.push(`S (Systolic BP): Huyết áp tâm thu < 90 mmHg (${v.systolicBp} mmHg) (+2)`);
    }

    // M: Multilobar infiltrates (1 pt)
    if (img.multilobarInfiltrates) {
      score += 1;
      details.push('M (Multilobar): Tổn thương nhiều thùy trên X-quang phổi (+1)');
    }

    // A: Albumin < 3.5 g/dL (1 pt)
    if (l.albuminGDl !== undefined && l.albuminGDl < 3.5) {
      score += 1;
      details.push(`A (Albumin): Albumin máu < 3.5 g/dL (${l.albuminGDl} g/dL) (+1)`);
    }

    // R: Respiratory Rate age-stratified (1 pt)
    const rrElevated = (age <= 50 && (v.respiratoryRate ?? 0) >= 25) || (age > 50 && (v.respiratoryRate ?? 0) >= 30);
    if (rrElevated) {
      score += 1;
      const threshold = age <= 50 ? '>= 25' : '>= 30';
      details.push(`R (Respiratory rate): Nhịp thở ${threshold} l/p theo tuổi (${v.respiratoryRate} l/p) (+1)`);
    }

    // T: Tachycardia HR >= 125 bpm (1 pt)
    if ((v.heartRate ?? 0) >= 125) {
      score += 1;
      details.push(`T (Tachycardia): Nhịp tim >= 125 l/p (${v.heartRate} l/p) (+1)`);
    }

    // C: Confusion (1 pt)
    if (v.alteredMentalStatus) {
      score += 1;
      details.push('C (Confusion): Thay đổi tri giác / Lú lẫn cấp (+1)');
    }

    // O: Oxygenation age-stratified (2 pts)
    let oxyLow = false;
    let oxyStr = '';
    if (age <= 50) {
      if (l.pao2Mmhg !== undefined && l.pao2Mmhg < 70) {
        oxyLow = true; oxyStr = `PaO2 < 70 mmHg (${l.pao2Mmhg} mmHg)`;
      } else if (l.pao2Fio2Ratio !== undefined && l.pao2Fio2Ratio < 333) {
        oxyLow = true; oxyStr = `PaO2/FiO2 < 333 (${l.pao2Fio2Ratio})`;
      } else if ((v.spo2 ?? 100) <= 93.0) {
        oxyLow = true; oxyStr = `SpO2 <= 93% (${v.spo2}%)`;
      }
    } else {
      if (l.pao2Mmhg !== undefined && l.pao2Mmhg < 60) {
        oxyLow = true; oxyStr = `PaO2 < 60 mmHg (${l.pao2Mmhg} mmHg)`;
      } else if (l.pao2Fio2Ratio !== undefined && l.pao2Fio2Ratio < 250) {
        oxyLow = true; oxyStr = `PaO2/FiO2 < 250 (${l.pao2Fio2Ratio})`;
      } else if ((v.spo2 ?? 100) <= 90.0) {
        oxyLow = true; oxyStr = `SpO2 <= 90% (${v.spo2}%)`;
      }
    }

    if (oxyLow) {
      score += 2;
      details.push(`O (Oxygenation): Giảm oxy hóa máu theo tuổi [${oxyStr}] (+2)`);
    }

    // P: pH < 7.35 (2 pts)
    if (l.arterialPh !== undefined && l.arterialPh < 7.35) {
      score += 2;
      details.push(`P (pH): pH máu động mạch < 7.35 (${l.arterialPh}) (+2)`);
    }

    let riskLevel: string;
    if (score <= 2) {
      riskLevel = 'Nguy cơ thấp cần hỗ trợ hô hấp / vận mạch (Low risk of IRVS: ~4%)';
    } else if (score <= 4) {
      riskLevel = 'Nguy cơ trung bình (Moderate risk of IRVS: 12.7%)';
    } else if (score <= 6) {
      riskLevel = 'Nguy cơ cao cần IRVS (High risk of IRVS: 33.3%)';
    } else {
      riskLevel = 'Nguy cơ rất cao cần IRVS (Very high risk of IRVS: 67%)';
    }

    return { score, riskLevel, details };
  }

  public calculateAtsIdsa(
    vitals?: PatientVitals,
    labs?: PatientLabs,
    imaging?: PatientImagingAndIntervention
  ): AtsIdsaResult {
    const v = vitals || {};
    const l = labs || {};
    const img = imaging || {};

    const majorCriteria: string[] = [];
    const minorCriteria: string[] = [];

    // Major criteria
    if (img.septicShockVasopressors || v.onAggressiveFluidResuscitation) {
      majorCriteria.push('Sốc nhiễm khuẩn cần sử dụng thuốc vận mạch');
    }
    if (img.mechanicalVentilation) {
      majorCriteria.push('Suy hô hấp cấp tiến triển cần thở máy xâm nhập');
    }

    // Minor criteria
    if ((v.respiratoryRate ?? 0) >= 30) {
      minorCriteria.push(`Tần số thở >= 30 lần/phút (${v.respiratoryRate} l/p)`);
    }
    if (l.pao2Fio2Ratio !== undefined && l.pao2Fio2Ratio <= 250) {
      minorCriteria.push(`Tỉ lệ PaO2/FiO2 <= 250 (${l.pao2Fio2Ratio})`);
    }
    if (img.multilobarInfiltrates) {
      minorCriteria.push('Tổn thương thâm nhiễm nhiều thùy phổi trên X-quang/CT');
    }
    if (v.alteredMentalStatus) {
      minorCriteria.push('Lú lẫn / Rối loạn ý thức cấp tính');
    }
    const bunUreaElevated = (l.bunMgDl !== undefined && l.bunMgDl >= 20.0) || (l.ureaMmolL !== undefined && l.ureaMmolL >= 7.14);
    if (bunUreaElevated) {
      minorCriteria.push(`Tăng Ure/BUN máu (Ure >= 7.14 mmol/L hoặc BUN >= 20 mg/dL)`);
    }
    if (l.wbcGL !== undefined && l.wbcGL < 4.0) {
      minorCriteria.push(`Bạch cầu máu giảm < 4.0 G/L (${l.wbcGL} G/L)`);
    }
    if (l.plateletsGL !== undefined && l.plateletsGL < 100.0) {
      minorCriteria.push(`Giảm tiểu cầu < 100 G/L (${l.plateletsGL} G/L)`);
    }
    if (v.temperature !== undefined && v.temperature < 36.0) {
      minorCriteria.push(`Hạ thân nhiệt trung tâm < 36.0°C (${v.temperature}°C)`);
    }
    if (v.systolicBp !== undefined && v.systolicBp < 90) {
      minorCriteria.push(`Tụt huyết áp cần bù dịch tích cực (HA tâm thu < 90 mmHg)`);
    }

    const isSevereCap = majorCriteria.length >= 1 || minorCriteria.length >= 3;

    return {
      majorCount: majorCriteria.length,
      majorCriteria,
      minorCount: minorCriteria.length,
      minorCriteria,
      isSevereCap
    };
  }

  public evaluate(
    age: number,
    gender: Gender = 'MALE',
    vitals?: PatientVitals,
    comorbidities?: PatientComorbidities,
    labs?: PatientLabs,
    imaging?: PatientImagingAndIntervention,
    symptoms?: ClinicalSymptoms
  ): SeverityAssessmentResult {
    const crb65 = this.calculateCrb65(age, vitals);
    const curb65 = this.calculateCurb65(age, vitals, labs);
    const psi = this.calculatePsi(age, gender, comorbidities, vitals, labs, imaging);
    const smartCop = this.calculateSmartCop(age, vitals, labs, imaging);
    const ats = this.calculateAtsIdsa(vitals, labs, imaging);

    // Triage logic
    let recommendedCareSetting: string;
    let severityLevel: string;
    const clinicalNotes: string[] = [];

    if (ats.isSevereCap) {
      recommendedCareSetting = 'ICU (Rất nặng / Nguy kịch)';
      severityLevel = 'Nặng (Severe) / Nguy kịch';
      clinicalNotes.push('Bệnh nhân thỏa tiêu chuẩn Viêm phổi nặng theo ATS/IDSA 2007 (≥1 tiêu chuẩn chính hoặc ≥3 tiêu chuẩn phụ). CHỈ ĐỊNH NHẬP KHOA HỒI SỨC TÍCH CỰC (ICU).');
    } else if (smartCop.score >= 5) {
      recommendedCareSetting = 'ICU (Rất nặng / Nguy kịch)';
      severityLevel = 'Nặng (Severe) / Nguy kịch';
      clinicalNotes.push('Thang điểm SMART-COP ≥ 5 điểm (Nguy cơ rất cao cần hỗ trợ hô hấp chuyên sâu hoặc vận mạch: 67%). Khuyến nghị nhập ICU hoặc Đơn vị Hồi sức Cấp cứu (HDU).');
    } else if ((curb65.score !== null && curb65.score >= 3) || crb65.score >= 3 || psi.score > 130) {
      recommendedCareSetting = 'ICU (Rất nặng / Nguy kịch)';
      severityLevel = 'Nặng (Severe) / Nguy kịch';
      clinicalNotes.push('Phân tầng CURB-65 ≥ 3 điểm hoặc PSI Tầng V (>130 điểm): Tỉ lệ tử vong cao. Ưu tiên nhập ICU / HDU.');
    } else if ((curb65.score !== null && curb65.score === 2) || crb65.score === 2 || (psi.score >= 71 && psi.score <= 130) || smartCop.score >= 3) {
      recommendedCareSetting = 'Nội trú (Trung bình)';
      severityLevel = 'Trung bình (Moderate)';
      clinicalNotes.push('CURB-65 = 2 điểm hoặc PSI Tầng III-IV: Chỉ định điều trị Nội trú tại Khoa Nội Hô hấp / Nội Tổng hợp.');
    } else {
      recommendedCareSetting = 'Ngoại trú (Nhẹ)';
      severityLevel = 'Nhẹ (Mild)';
      clinicalNotes.push('Đủ điều kiện điều trị ngoại trú an toàn, hướng dẫn bệnh nhân tự theo dõi và tái khám sau 48-72 giờ.');
    }

    const syndromeSummary = [
      'Hội chứng nhiễm trùng / nhiễm độc: Sốt/hạ thân nhiệt, môi khô, lưỡi bẩn, hơi thở hôi.',
      'Hội chứng đông đặc nhu mô phổi: Rung thanh tăng, gõ đục, rì rào phế nang giảm, ran nổ/ran ẩm.'
    ];

    const routineLabOrders = [
      '1. Tổng phân tích tế bào máu ngoại vi (Công thức máu - CTM): đánh giá bạch cầu (WBC), đa nhân trung tính (NEU), tiểu cầu (PLT), Hematocrit.',
      '2. Hóa sinh máu cơ bản: Định lượng Ure máu, Creatinine máu & tính eGFR (đánh giá chức năng thận).',
      '3. Điện giải đồ (Na+, K+, Cl-): phát hiện hạ natri máu hoặc rối loạn điện giải.',
      '4. Đường huyết tĩnh mạch (Glucose máu): tầm soát tăng đường huyết / đái tháo đường.',
      '5. Men gan (AST, ALT): đánh giá tổn thương gan và hỗ trợ chọn liều kháng sinh.',
      '6. X-quang tim phổi thẳng (Chest X-ray): đánh giá vị trí tổn thương (1 thùy vs nhiều thùy, phế quản phế viêm, tràn dịch màng phổi).',
      '7. Dấu ấn sinh học nhiễm trùng: Định lượng Procalcitonin (PCT) hoặc CRP (đánh giá mức độ nhiễm khuẩn và theo dõi động học D0, D3, D5-D7).'
    ];

    return {
      curb65Score: curb65.score,
      curb65Details: curb65.details,
      crb65Score: crb65.score,
      crb65Details: crb65.details,
      psiScore: psi.score,
      psiClass: psi.psiClass,
      psiDetails: psi.details,
      smartCopScore: smartCop.score,
      smartCopRisk: smartCop.riskLevel,
      smartCopDetails: smartCop.details,
      atsSevereCap: ats.isSevereCap,
      atsMajorCount: ats.majorCount,
      atsMinorCount: ats.minorCount,
      atsMajorCriteriaMet: ats.majorCriteria,
      atsMinorCriteriaMet: ats.minorCriteria,
      severityLevel,
      recommendedCareSetting,
      syndromeSummary,
      routineLabOrders,
      clinicalNotes
    };
  }
}
