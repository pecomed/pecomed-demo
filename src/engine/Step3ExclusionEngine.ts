import {
  ExclusionRiskTriggers,
  ExclusionAssessmentResult,
  DifferentialDiagnosisItem,
  RenalDoseAdjustmentItem,
  ClinicalSymptoms,
  PatientComorbidities,
  PatientImagingAndIntervention,
  Gender
} from '../models/types.js';

export class Step3ExclusionEngine {

  /**
   * Calculates Cockcroft-Gault Creatinine Clearance in mL/min.
   */
  public calculateCrCl(
    age: number,
    gender: Gender = 'MALE',
    weightKg: number = 60,
    serumCreatinineMgDl?: number,
    serumCreatinineUmolL?: number
  ): number | undefined {
    let scrMgDl = serumCreatinineMgDl;
    if (scrMgDl === undefined && serumCreatinineUmolL !== undefined && serumCreatinineUmolL > 0) {
      scrMgDl = serumCreatinineUmolL / 88.4;
    }

    if (scrMgDl === undefined || scrMgDl <= 0 || age <= 0 || weightKg <= 0) {
      return undefined;
    }

    const isFemale = gender === 'FEMALE' || gender === 'Nữ';
    let crcl = ((140 - age) * weightKg) / (72 * scrMgDl);
    if (isFemale) {
      crcl *= 0.85;
    }

    return Math.round(crcl * 10) / 10;
  }

  /**
   * Evaluates Differential Diagnoses & Exclusions based on 8 non-infectious / specific diseases.
   */
  public evaluateDifferentialDiagnoses(
    symptoms?: ClinicalSymptoms,
    comorbidities?: PatientComorbidities,
    imaging?: PatientImagingAndIntervention,
    age?: number
  ): DifferentialDiagnosisItem[] {
    const s = symptoms || {};
    const c = comorbidities || {};
    const img = imaging || {};
    const diffs: DifferentialDiagnosisItem[] = [];

    // 1. Lao phổi (Tuberculosis)
    if (s.hemoptysis || s.weightLossNightSweats || img.lungCavityOrNecrosis) {
      diffs.push({
        condition: 'Lao phổi (Pulmonary Tuberculosis)',
        probability: (s.hemoptysis && s.weightLossNightSweats) ? 'Cao (High)' : 'Nghi ngờ (Moderate)',
        keyClues: [
          'Ho ra máu, sốt nhẹ về chiều, gầy sút cân, ra mồ hôi trộm.',
          'X-quang / CT có hang xơ vùng đỉnh phổi hoặc nốt thâm nhiễm thùy trên.'
        ],
        suggestedExclusionTests: [
          'Nhuộm soi đờm tìm AFB trực tiếp 3 mẫu.',
          'Xét nghiệm GeneXpert MTB/RIF phát hiện vi khuẩn lao và đột biến kháng Rifampicin trong 2 giờ.',
          'Nuôi cấy môi trường lỏng MGIT / phân lập vi khuẩn lao.'
        ],
        clinicalAction: 'Cách ly phòng áp lực âm nếu nghi ngờ lao hoạt tính, không dùng Quinolone kinh nghiệm kéo dài (làm che lấp triệu chứng lao).'
      });
    }

    // 2. Thuyên tắc động mạch phổi (Pulmonary Embolism - PE)
    if (s.suddenSharpChestPainDyspnea || s.immobilizationOrDvtOrOralContraceptives) {
      diffs.push({
        condition: 'Thuyên tắc động mạch phổi (Pulmonary Embolism - PE)',
        probability: (s.suddenSharpChestPainDyspnea && s.immobilizationOrDvtOrOralContraceptives) ? 'Cao (High)' : 'Nghi ngờ (Moderate)',
        keyClues: [
          'Đột ngột đau ngực dữ dội kiểu màng phổi, khó thở cấp, ho máu.',
          'Tiền sử nằm bất động lâu, huyết khối tĩnh mạch sâu (DVT), phẫu thuật chỉnh hình, dùng thuốc tránh thai.',
          'Điện tim có dấu hiệu tăng gánh thất phải cấp (S1Q3T3), nhịp nhanh xoang.'
        ],
        suggestedExclusionTests: [
          'Định lượng D-dimer huyết tương (loại trừ nếu D-dimer bình thường).',
          'Siêu âm Doppler mạch máu chi dưới tìm huyết khối.',
          'Chụp Cắt lớp vi tính mạch máu phổi có cản quang (CTPA) - Tiêu chuẩn vàng.'
        ],
        clinicalAction: 'Khởi động Heparin trọng lượng phân tử thấp (LMWH) ngay nếu nguy cơ cao và không có chống chỉ định xuất huyết.'
      });
    }

    // 3. Ung thư phổi (Lung Carcinoma)
    if (s.hemoptysis || s.weightLossNightSweats || c.smoking || (age && age >= 55 && s.coughWithSputum)) {
      diffs.push({
        condition: 'Ung thư phế quản phổi (Lung Cancer / Malignancy)',
        probability: (s.hemoptysis && c.smoking) ? 'Cao (High)' : 'Nghi ngờ (Moderate)',
        keyClues: [
          'Bệnh nhân lớn tuổi, tiền sử hút thuốc lá nhiều năm, ho dai dẳng, ho máu, sút cân.',
          'X-quang có hình ảnh khối mờ tròn bờ không đều, hình "thả bóng", xẹp phổi dạng tam giác đỉnh quay vào rốn phổi.'
        ],
        suggestedExclusionTests: [
          'Chụp CT lồng ngực cản quang 64-128 dãy lát mỏng.',
          'Nội soi phế quản ống mềm, sinh thiết u / chải rửa tế bào học.',
          'Sinh thiết xuyên thành ngực dưới hướng dẫn CT scan.'
        ],
        clinicalAction: 'Hội chẩn chuyên khoa Ung bướu sau khi kiểm soát ổn định đợt nhiễm trùng cấp.'
      });
    }

    // 4. Giãn phế quản bội nhiễm (Infected Bronchiectasis)
    if (s.chronicCopiousPurulentSputum || c.copdChronicLung) {
      diffs.push({
        condition: 'Giãn phế quản bội nhiễm (Bronchiectasis Flare)',
        probability: 'Nghi ngờ (Moderate)',
        keyClues: [
          'Tiền sử ho khạc đờm mủ lượng nhiều hàng ngày kéo dài nhiều tháng, ran ẩm cố định một vùng phổi.',
          'X-quang / CT có hình ảnh đường ray xe lửa, hình tổ ong, vòng nhẫn dấu ấn (Signet-ring).'
        ],
        suggestedExclusionTests: [
          'Chụp CT ngực độ phân giải cao (HRCT 1mm) lát mỏng không cản quang.',
          'Cấy đờm định lượng tìm Pseudomonas aeruginosa và NTM (vi khuẩn lao không điển hình).'
        ],
        clinicalAction: 'Vật lý trị liệu hô hấp, dẫn lưu tư thế kết hợp kháng sinh phủ P. aeruginosa phổ rộng.'
      });
    }

    // 5. Viêm phổi do thuốc / Tự miễn (Drug-induced / Autoimmune Pneumonitis)
    if (s.amiodaroneOrMethotrexateUse) {
      diffs.push({
        condition: 'Viêm phổi kẽ do thuốc (Amiodarone / Methotrexate Toxicity)',
        probability: 'Cao (High)',
        keyClues: [
          'Bệnh nhân đang điều trị Amiodarone (loạn nhịp), Methotrexate (viêm khớp), Bleomycin hoặc Nitrofurantoin.',
          'Khó thở tăng dần, ho khan, hình ảnh thâm nhiễm kẽ hai bên không đáp ứng kháng sinh.'
        ],
        suggestedExclusionTests: [
          'Đo chức năng thông khí phổi (DLCO giảm).',
          'Rửa phế quản phế nang (BAL) loại trừ nhiễm trùng cơ hội.'
        ],
        clinicalAction: 'Ngừng ngay thuốc nghi ngờ, xem xét liệu pháp Corticosteroid liều cao.'
      });
    }

    // 6. Phù phổi bán cấp không điển hình (Subacute Pulmonary Edema)
    if (c.congestiveHeartFailure) {
      diffs.push({
        condition: 'Phù phổi huyết động bán cấp (Subacute Cardiogenic Pulmonary Edema)',
        probability: 'Nghi ngờ (Moderate)',
        keyClues: [
          'Tiền sử suy tim, tăng huyết áp, khó thở khi nằm, khó thở kịch phát về đêm.',
          'X-quang có bóng tim to, đường Kerley A/B, thâm nhiễm dạng cánh bướm quanh rốn phổi.'
        ],
        suggestedExclusionTests: [
          'Định lượng NT-proBNP hoặc BNP huyết tương.',
          'Siêu âm tim Doppler màu đánh giá phân suất tống máu EF và áp lực buồng tim.'
        ],
        clinicalAction: 'Thử nghiệm điều trị Lợi tiểu quai (Furosemide IV) và kiểm soát huyết áp.'
      });
    }

    // 7. Viêm phổi hít (Aspiration Pneumonitis / Pneumonia)
    if (s.swallowingDifficultyOrSedation || c.cerebrovascularDisease || c.alcoholism) {
      diffs.push({
        condition: 'Viêm phổi hít / Viêm phổi do acid dịch vị (Aspiration Syndrome)',
        probability: 'Cao (High)',
        keyClues: [
          'Rối loạn nuốt sau tai biến mạch não, hôn mê, say rượu, nôn sặc, trào ngược dạ dày thực quản nặng.',
          'Tổn thương đông đặc ưu thế ở phân thùy 6 (đỉnh thùy dưới) hoặc phân thùy 2 (sau thùy trên) phổi phải.'
        ],
        suggestedExclusionTests: [
          'Đánh giá chức năng nuốt qua nội soi FEES hoặc chiếu màn huỳnh quang.',
          'Nhuộm Gram và cấy đờm tìm vi khuẩn kỵ khí phối hợp Gram âm.'
        ],
        clinicalAction: 'Đặt sonde dạ dày nuôi dưỡng, nâng đầu giường 30-45 độ, phối hợp kháng sinh diệt kỵ khí (Ampicillin/Sulbactam, Clindamycin).'
      });
    }

    // 8. Hội chứng Loeffler (Loeffler's Syndrome / Eosinophilic Pneumonia)
    if (s.asthmaHistoryOrParasiteExposure) {
      diffs.push({
        condition: 'Hội chứng Loeffler (Viêm phổi tăng bạch cầu ái toan do giun sán)',
        probability: 'Nghi ngờ (Moderate)',
        keyClues: [
          'Sốt nhẹ, ho khan, thở rít giống hen, tiền sử tiếp xúc đất cát / ăn rau sống / nhiễm giun đũa (Ascaris lumbricoides).',
          'Bạch cầu ái toan (Eosinophil) trong máu tăng cao > 10% (> 500/uL).',
          'X-quang phổi thâm nhiễm dạng đám mờ di chuyển và tự biến mất sau 1-2 tuần.'
        ],
        suggestedExclusionTests: [
          'Soi phân tìm trứng giun sán 3 lần.',
          'Huyết thanh chẩn đoán giun đũa chó mèo Toxocara, giun lươn Strongyloides.'
        ],
        clinicalAction: 'Điều trị thuốc tẩy giun sán đặc hiệu (Albendazole / Ivermectin) kết hợp Corticoid ngắn ngày nếu co thắt nặng.'
      });
    }

    return diffs;
  }

  /**
   * Generates specific renal dosage adjustments table based on CrCl level.
   */
  public generateRenalAdjustments(crcl?: number): RenalDoseAdjustmentItem[] {
    if (crcl === undefined || crcl >= 50) {
      return [];
    }

    const items: RenalDoseAdjustmentItem[] = [];

    // Levofloxacin
    if (crcl >= 20 && crcl < 50) {
      items.push({
        drugName: 'Levofloxacin',
        normalDose: '750mg mỗi 24 giờ (hoặc 500mg mỗi 12h)',
        adjustedDose: '500mg khởi đầu, sau đó 250mg mỗi 24 giờ (hoặc 750mg mỗi 48 giờ)',
        monitoringNote: 'Tránh tích lũy gây loạn thần, co giật và kéo dài khoảng QT.'
      });
    } else if (crcl < 20) {
      items.push({
        drugName: 'Levofloxacin',
        normalDose: '750mg mỗi 24 giờ',
        adjustedDose: '500mg khởi đầu, sau đó 250mg mỗi 48 giờ (hoặc 750mg khởi đầu rồi 500mg mỗi 48h)',
        monitoringNote: 'Bệnh nhân lọc máu chu kỳ: Dùng sau buổi lọc máu.'
      });
    }

    // Cefepime
    if (crcl >= 30 && crcl < 50) {
      items.push({
        drugName: 'Cefepime',
        normalDose: '2g mỗi 8 giờ',
        adjustedDose: '2g mỗi 12 giờ (hoặc 1g mỗi 8 giờ)',
        monitoringNote: 'Cảnh báo: Tích lũy Cefepime gây độc thần kinh (hôn mê, rung giật cơ, co giật).'
      });
    } else if (crcl < 30) {
      items.push({
        drugName: 'Cefepime',
        normalDose: '2g mỗi 8 giờ',
        adjustedDose: '1g mỗi 24 giờ (hoặc 2g mỗi 24h ở nhiễm trùng nặng)',
        monitoringNote: 'Bắt buộc theo dõi tri giác hàng ngày.'
      });
    }

    // Meropenem
    if (crcl >= 26 && crcl < 50) {
      items.push({
        drugName: 'Meropenem',
        normalDose: '1g mỗi 8 giờ',
        adjustedDose: '1g mỗi 12 giờ (truyền kéo dài 3 giờ)',
        monitoringNote: 'Đảm bảo thời gian T > MIC đạt trên 40-50% khoảng liều.'
      });
    } else if (crcl >= 10 && crcl < 26) {
      items.push({
        drugName: 'Meropenem',
        normalDose: '1g mỗi 8 giờ',
        adjustedDose: '500mg mỗi 12 giờ',
        monitoringNote: 'Hiệu chỉnh liều theo chức năng thận hàng ngày.'
      });
    } else if (crcl < 10) {
      items.push({
        drugName: 'Meropenem',
        normalDose: '1g mỗi 8 giờ',
        adjustedDose: '500mg mỗi 24 giờ (sau lọc máu nếu có HD)',
        monitoringNote: 'Bổ sung thêm 500mg sau mỗi lần chạy thận nhân tạo.'
      });
    }

    // Vancomycin
    items.push({
      drugName: 'Vancomycin',
      normalDose: '15-20 mg/kg mỗi 8-12 giờ',
      adjustedDose: crcl < 30 ? '15-20 mg/kg mỗi 24-48 giờ (hoặc theo TDM)' : '15 mg/kg mỗi 24 giờ',
      monitoringNote: 'BẮT BUỘC định lượng nồng độ đáy (TDM) trước liều kế tiếp, mục tiêu 15-20 mcg/mL.'
    });

    // Aminoglycosides
    items.push({
      drugName: 'Amikacin / Gentamicin',
      normalDose: 'Amikacin 15-20 mg/kg/ngày; Gentamicin 5-7 mg/kg/ngày',
      adjustedDose: 'Kéo dài khoảng cách dùng thuốc (mỗi 36 - 48 giờ) hoặc giảm liều theo nồng độ đỉnh/đáy.',
      monitoringNote: 'Nguy cơ suy thận cấp hoại tử ống thận và điếc không hồi phục. Tránh phối hợp với Vancomycin khi CrCl < 30.'
    });

    return items;
  }

  public evaluate(
    triggers?: ExclusionRiskTriggers,
    symptoms?: ClinicalSymptoms,
    comorbidities?: PatientComorbidities,
    imaging?: PatientImagingAndIntervention,
    age?: number,
    gender: Gender = 'MALE'
  ): ExclusionAssessmentResult {
    const t = triggers || {};
    const contraindicatedDrugs: string[] = [];
    const cautionDrugs: string[] = [];
    const warnings: string[] = [];

    // 1. Calculate CrCl via Cockcroft-Gault if raw data provided
    let calculatedCrCl = t.crclMlMin;
    if (calculatedCrCl === undefined && age && t.weightKg) {
      calculatedCrCl = this.calculateCrCl(age, gender, t.weightKg, t.serumCreatinineMgDl, t.serumCreatinineUmolL);
    }

    // 2. Long QT Syndrome
    if (t.hasLongQtSyndrome) {
      contraindicatedDrugs.push('Fluoroquinolones (Moxifloxacin, Levofloxacin, Ciprofloxacin)');
      contraindicatedDrugs.push('Macrolides (Azithromycin, Clarithromycin, Erythromycin)');
      warnings.push('HỘI CHỨNG QT KÉO DÀI / NGUY CƠ LOẠN NHỊP TIM: Chống chỉ định toàn bộ nhóm Fluoroquinolones và Macrolides do nguy cơ gây xoắn đỉnh (Torsades de pointes) và ngừng tim đột ngột. Ưu tiên Beta-lactam đơn thuần hoặc phối hợp Doxycycline.');
    }

    // 3. Myasthenia Gravis
    if (t.hasMyastheniaGravis) {
      contraindicatedDrugs.push('Fluoroquinolones');
      contraindicatedDrugs.push('Aminoglycosides (Amikacin, Gentamicin, Tobramycin)');
      cautionDrugs.push('Macrolides');
      warnings.push('BỆNH NHƯỢC CƠ (Myasthenia Gravis): Chống chỉ định Fluoroquinolones và Aminoglycosides vì làm suy yếu dẫn truyền thần kinh cơ, có thể khởi phát cơn nhược cơ cấp đe dọa tính mạng.');
    }

    // 4. Tendinitis / Tendon Rupture / Quinolone Allergy
    if (t.hasTendinitisOrFluoroquinoloneAllergy) {
      if (!contraindicatedDrugs.includes('Fluoroquinolones')) {
        contraindicatedDrugs.push('Fluoroquinolones (Levofloxacin, Moxifloxacin, Ciprofloxacin)');
      }
      warnings.push('TIỀN SỬ VIÊM GÂN / ĐỨT GÂN GÓT (ACHILLES) HOẶC DỊ ỨNG QUINOLONE: Chống chỉ định tuyệt đối nhóm Fluoroquinolones. Chuyển sang phác đồ phối hợp Beta-lactam + Macrolide / Doxycycline.');
    }

    // 5. Pregnancy & Lactation
    if (t.isPregnantOrNursing) {
      contraindicatedDrugs.push('Fluoroquinolones (nguy cơ tổn thương sụn khớp thai nhi)');
      contraindicatedDrugs.push('Doxycycline / Tetracyclines (nguy cơ hỏng men răng và đổi màu xương vĩnh viễn)');
      contraindicatedDrugs.push('Aminoglycosides (độc tính trên thận và tai thai nhi)');
      cautionDrugs.push('Clarithromycin');
      warnings.push('PHỤ NỮ CÓ THAI HOẶC CHO CON BÚ: Chỉ sử dụng các kháng sinh an toàn nhóm B (Amoxicillin, Ampicillin/Sulbactam, Cefuroxime, Ceftriaxone, Azithromycin). Tránh Quinolone, Doxycycline và Aminoglycoside.');
    }

    // 6. Penicillin Anaphylaxis
    if (t.hasKnownPenicillinAnaphylaxis) {
      contraindicatedDrugs.push('Penicillins (Amoxicillin, Ampicillin, Piperacillin/Tazobactam, Amox/Clav)');
      cautionDrugs.push('Cephalosporins (nguy cơ phản ứng chéo dị ứng ~1-3%)');
      warnings.push('TIỀN SỬ SỐC PHẢN VỆ PENICILLIN (Dị ứng Type I qua IgE): Chống chỉ định tất cả các Penicillin và phân tử chứa nhân Penam. Đối với nhiễm khuẩn nặng cần dùng Levofloxacin / Moxifloxacin hoặc Aztreonam / Carbapenem (thận trọng).');
    }

    // 7. Cephalosporin Anaphylaxis
    if (t.hasKnownCephalosporinAnaphylaxis) {
      contraindicatedDrugs.push('Cephalosporins (Ceftriaxone, Cefotaxime, Ceftazidime, Cefepime, Cefuroxime)');
      warnings.push('DỊ ỨNG NẶNG CEPHALOSPORIN: Tránh sử dụng Cephalosporin các thế hệ. Cân nhắc dùng Quinolone hô hấp hoặc Macrolide.');
    }

    // 8. G6PD Deficiency
    if (t.hasG6pdDeficiency) {
      contraindicatedDrugs.push('Cotrimoxazole (TMP/SMX)');
      contraindicatedDrugs.push('Nitrofurantoin');
      warnings.push('THIẾU HỤT MEN G6PD: Chống chỉ định Cotrimoxazole (Bactrim) do nguy cơ tán huyết cấp tính.');
    }

    // 9. Renal Function & Dose Adjustment
    const renalDoseAdjustmentRequired = !!(
      t.hasSevereRenalFailure ||
      (calculatedCrCl !== undefined && calculatedCrCl < 50.0)
    );

    if (renalDoseAdjustmentRequired) {
      cautionDrugs.push('Aminoglycosides (Amikacin, Gentamicin)');
      cautionDrugs.push('Vancomycin');
      cautionDrugs.push('Levofloxacin');
      cautionDrugs.push('Cefepime / Ceftazidime / Meropenem');
      warnings.push(`SUY GIẢM CHỨC NĂNG THẬN (CrCl = ${calculatedCrCl ?? '<50'} mL/phút): Bắt buộc hiệu chỉnh liều và khoảng cách dùng thuốc theo mức thanh thải Creatinine để tránh tích lũy độc tính (đặc biệt Cefepime gây độc thần kinh, Vancomycin/Aminoglycoside gây suy thận cấp).`);
    }

    const renalDoseAdjustments = this.generateRenalAdjustments(calculatedCrCl);
    const differentialDiagnoses = this.evaluateDifferentialDiagnoses(symptoms, comorbidities, imaging, age);

    return {
      contraindicatedDrugs,
      cautionDrugs,
      renalDoseAdjustmentRequired,
      calculatedCrCl,
      renalDoseAdjustments,
      differentialDiagnoses,
      warnings
    };
  }
}
