import { ExclusionRiskTriggers, ExclusionAssessmentResult } from '../models/types.js';

export class Step3ExclusionEngine {

  public evaluate(triggers?: ExclusionRiskTriggers): ExclusionAssessmentResult {
    const t = triggers || {};
    const contraindicatedDrugs: string[] = [];
    const cautionDrugs: string[] = [];
    const warnings: string[] = [];

    // 1. Long QT Syndrome
    if (t.hasLongQtSyndrome) {
      contraindicatedDrugs.push('Fluoroquinolones (Moxifloxacin, Levofloxacin, Ciprofloxacin)');
      contraindicatedDrugs.push('Macrolides (Azithromycin, Clarithromycin, Erythromycin)');
      warnings.push('HỘI CHỨNG QT KÉO DÀI / NGUY CƠ LOẠN NHỊP TIM: Chống chỉ định toàn bộ nhóm Fluoroquinolones và Macrolides do nguy cơ gây xoắn đỉnh (Torsades de pointes) và ngừng tim đột ngột. Ưu tiên Beta-lactam đơn thuần hoặc phối hợp Doxycycline.');
    }

    // 2. Myasthenia Gravis
    if (t.hasMyastheniaGravis) {
      contraindicatedDrugs.push('Fluoroquinolones');
      contraindicatedDrugs.push('Aminoglycosides (Amikacin, Gentamicin, Tobramycin)');
      cautionDrugs.push('Macrolides');
      warnings.push('BỆNH NHƯỢC CƠ (Myasthenia Gravis): Chống chỉ định Fluoroquinolones và Aminoglycosides vì làm suy yếu dẫn truyền thần kinh cơ, có thể khởi phát cơn nhược cơ cấp đe dọa tính mạng.');
    }

    // 3. Tendinitis / Tendon Rupture / Quinolone Allergy
    if (t.hasTendinitisOrFluoroquinoloneAllergy) {
      if (!contraindicatedDrugs.includes('Fluoroquinolones')) {
        contraindicatedDrugs.push('Fluoroquinolones (Levofloxacin, Moxifloxacin, Ciprofloxacin)');
      }
      warnings.push('TIỀN SỬ VIÊM GÂN / ĐỨT GÂN GÓT (ACHILLES) HOẶC DỊ ỨNG QUINOLONE: Chống chỉ định tuyệt đối nhóm Fluoroquinolones. Chuyển sang phác đồ phối hợp Beta-lactam + Macrolide / Doxycycline.');
    }

    // 4. Pregnancy & Lactation
    if (t.isPregnantOrNursing) {
      contraindicatedDrugs.push('Fluoroquinolones (nguy cơ tổn thương sụn khớp thai nhi)');
      contraindicatedDrugs.push('Doxycycline / Tetracyclines (nguy cơ hỏng men răng và đổi màu xương vĩnh viễn)');
      contraindicatedDrugs.push('Aminoglycosides (độc tính trên thận và tai thai nhi)');
      cautionDrugs.push('Clarithromycin');
      warnings.push('PHỤ NỮ CÓ THAI HOẶC CHO CON BÚ: Chỉ sử dụng các kháng sinh an toàn nhóm B (Amoxicillin, Ampicillin/Sulbactam, Cefuroxime, Ceftriaxone, Azithromycin). Tránh Quinolone, Doxycycline và Aminoglycoside.');
    }

    // 5. Penicillin Anaphylaxis
    if (t.hasKnownPenicillinAnaphylaxis) {
      contraindicatedDrugs.push('Penicillins (Amoxicillin, Ampicillin, Piperacillin/Tazobactam, Amox/Clav)');
      cautionDrugs.push('Cephalosporins (nguy cơ phản ứng chéo dị ứng ~1-3%)');
      warnings.push('TIỀN SỬ SỐC PHẢN VỆ PENICILLIN (Dị ứng Type I qua IgE): Chống chỉ định tất cả các Penicillin và phân tử chứa nhân Penam. Đối với nhiễm khuẩn nặng cần dùng Levofloxacin / Moxifloxacin hoặc Aztreonam / Carbapenem (thận trọng).');
    }

    // 6. Cephalosporin Anaphylaxis
    if (t.hasKnownCephalosporinAnaphylaxis) {
      contraindicatedDrugs.push('Cephalosporins (Ceftriaxone, Cefotaxime, Ceftazidime, Cefepime, Cefuroxime)');
      warnings.push('DỊ ỨNG NẶNG CEPHALOSPORIN: Tránh sử dụng Cephalosporin các thế hệ. Cân nhắc dùng Quinolone hô hấp hoặc Macrolide.');
    }

    // 7. G6PD Deficiency
    if (t.hasG6pdDeficiency) {
      contraindicatedDrugs.push('Cotrimoxazole (TMP/SMX)');
      contraindicatedDrugs.push('Nitrofurantoin');
      warnings.push('THIẾU HỤT MEN G6PD: Chống chỉ định Cotrimoxazole (Bactrim) do nguy cơ tán huyết cấp tính.');
    }

    // 8. Renal Function & Dose Adjustment
    const renalDoseAdjustmentRequired = !!(
      t.hasSevereRenalFailure ||
      (t.crclMlMin !== undefined && t.crclMlMin !== null && t.crclMlMin < 50.0)
    );

    if (renalDoseAdjustmentRequired) {
      cautionDrugs.push('Aminoglycosides (Amikacin, Gentamicin)');
      cautionDrugs.push('Vancomycin');
      cautionDrugs.push('Levofloxacin');
      cautionDrugs.push('Cefepime / Ceftazidime / Meropenem');
      warnings.push(`SUY GIẢM CHỨC NĂNG THẬN (CrCl = ${t.crclMlMin ?? '<50'} mL/phút): Bắt buộc hiệu chỉnh liều và khoảng cách dùng thuốc theo mức thanh thải Creatinine để tránh tích lũy độc tính (đặc biệt Cefepime gây độc thần kinh, Vancomycin/Aminoglycoside gây suy thận cấp).`);
    }

    return {
      contraindicatedDrugs,
      cautionDrugs,
      renalDoseAdjustmentRequired,
      crclMlMin: t.crclMlMin,
      warnings
    };
  }
}
