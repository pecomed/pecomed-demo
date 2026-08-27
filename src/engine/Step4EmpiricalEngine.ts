import { CareSetting, AntibioticInfo, EmpiricalRegimenResult } from '../models/types.js';

export interface Step4InputData {
  careSetting?: CareSetting;
  age?: number;
  hasComorbidities?: boolean;
  antibioticsInPast3m?: boolean;
  suspectPseudomonas?: boolean;
  suspectMrsa?: boolean;
  viralTestPositive?: boolean;
  viralTestNegative?: boolean;
  spo2?: number;
  within24hIcu?: boolean;
  hasPenicillinAllergy?: boolean;
}

export class Step4EmpiricalEngine {

  public generateOutpatientRegimen(inputs: Step4InputData): EmpiricalRegimenResult {
    const age = inputs.age ?? 50;
    const isGroup2 = (age >= 65 || !!inputs.hasComorbidities || !!inputs.antibioticsInPast3m);

    const primary: AntibioticInfo[] = [];
    const alternative: AntibioticInfo[] = [];
    const addOns: AntibioticInfo[] = [];
    const stepDown: AntibioticInfo[] = [];
    const monitoringPlan: string[] = [
      'Đánh giá lại lâm sàng sau 48-72 giờ (sốt, ho, khó thở, khả năng ăn uống).',
      'Hướng dẫn bệnh nhân tái khám ngay nếu có dấu hiệu cảnh báo: Sốt cao liên tục, khó thở tăng, lú lẫn, nôn không uống được.'
    ];

    let targetPatientGroup: string;
    let regimenTitle: string;

    if (!isGroup2) {
      targetPatientGroup = 'Ngoại trú Nhóm 1 (< 65 tuổi, không có bệnh đồng mắc, không dùng kháng sinh trong 3 tháng qua)';
      regimenTitle = 'Phác đồ Ngoại trú Nhóm 1 (Liệu pháp đơn trị ưu tiên)';

      primary.push({
        name: 'Amoxicillin',
        dose: '1g uống mỗi 8 giờ (3g/ngày)',
        route: 'ORAL',
        role: 'Lựa chọn ưu tiên hàng đầu',
        drugClass: 'Aminopenicillin',
        note: 'Bao phủ tốt Phế cầu khuẩn (S. pneumoniae) nhạy cảm.'
      });
      primary.push({
        name: 'Doxycycline',
        dose: '100mg uống 2 lần/ngày',
        route: 'ORAL',
        role: 'Lựa chọn thay thế hàng đầu',
        drugClass: 'Tetracycline',
        note: 'Bao phủ cả Phế cầu và vi khuẩn không điển hình (Mycoplasma, Chlamydia).'
      });

      alternative.push({
        name: 'Amoxicillin / Acid Clavulanic',
        dose: '875/125mg uống mỗi 8-12 giờ',
        route: 'ORAL',
        role: 'Lựa chọn khi nghi H. influenzae hoặc M. catarrhalis sinh Beta-lactamase',
        drugClass: 'Beta-lactam + Beta-lactamase inhibitor'
      });
      alternative.push({
        name: 'Azithromycin',
        dose: '500mg uống ngày 1, sau đó 250mg/ngày từ ngày 2-5 (hoặc 500mg/ngày x 3 ngày)',
        route: 'ORAL',
        role: 'Lựa chọn cho vi khuẩn không điển hình hoặc dị ứng Penicillin',
        drugClass: 'Macrolide'
      });
      alternative.push({
        name: 'Clarithromycin',
        dose: '500mg uống 2 lần/ngày (hoặc 1g phóng thích kéo dài ER 1 lần/ngày) trong 5-7 ngày',
        route: 'ORAL',
        role: 'Lựa chọn Macrolide thay thế',
        drugClass: 'Macrolide'
      });
    } else {
      targetPatientGroup = 'Ngoại trú Nhóm 2 (>= 65 tuổi HOẶC có bệnh đồng mắc tim/gan/thận/phổi/ĐTĐ/suy giảm miễn dịch HOẶC dùng KS trong 3 tháng)';
      regimenTitle = 'Phác đồ Ngoại trú Nhóm 2 (Phối hợp thuốc hoặc Quinolone hô hấp đơn trị)';

      primary.push({
        name: 'Amoxicillin / Acid Clavulanic',
        dose: '875/125mg uống mỗi 8-12 giờ (hoặc 1000/62.5mg 2 viên mỗi 12h)',
        route: 'ORAL',
        role: 'Phối hợp thuốc (Thành phần Beta-lactam chính)',
        drugClass: 'Beta-lactam / Beta-lactamase inhibitor'
      });
      primary.push({
        name: 'Azithromycin (hoặc Doxycycline)',
        dose: 'Azithromycin 500mg ngày đầu, sau đó 250mg/ngày x 4 ngày (hoặc Doxycycline 100mg x 2 lần/ngày)',
        route: 'ORAL',
        role: 'Phối hợp thuốc (Thành phần Macrolide/Doxycycline)',
        drugClass: 'Macrolide / Tetracycline',
        note: 'Bắt buộc phối hợp để bao phủ vi khuẩn không điển hình và cộng hưởng diệt khuẩn.'
      });

      alternative.push({
        name: 'Cefpodoxime (hoặc Cefditoren / Cefdinir)',
        dose: 'Cefpodoxime 200mg uống mỗi 12h (hoặc Cefditoren 400mg mỗi 12h / Cefdinir 300mg mỗi 12h) + Azithromycin',
        route: 'ORAL',
        role: 'Lựa chọn Beta-lactam thế hệ 3 uống thay thế',
        drugClass: 'Oral Cephalosporin 3rd gen'
      });
      alternative.push({
        name: 'Levofloxacin (hoặc Moxifloxacin)',
        dose: 'Levofloxacin 750mg uống mỗi 24h (hoặc 500mg mỗi 12h) HOẶC Moxifloxacin 400mg uống mỗi 24h',
        route: 'ORAL',
        role: 'Quinolone hô hấp đơn trị liệu (Dành cho BN dị ứng Beta-lactam hoặc thất bại phác đồ đầu)',
        drugClass: 'Respiratory Fluoroquinolone',
        note: 'Bao phủ phổ rộng Phế cầu kháng thuốc (DRSP), Gram âm và vi khuẩn không điển hình.'
      });
    }

    if (inputs.viralTestPositive) {
      addOns.push({
        name: 'Oseltamivir (Tamiflu)',
        dose: '75mg uống 2 lần/ngày trong 5 ngày',
        route: 'ORAL',
        role: 'Thuốc kháng virus bổ sung',
        drugClass: 'Neuraminidase Inhibitor',
        note: 'Chỉ định khi test nhanh Cúm A/B dương tính hoặc nghi ngờ dịch tễ cao trong 48h đầu.'
      });
    }

    return {
      careSetting: 'Ngoại trú (Ambulatory / Phòng khám)',
      regimenTitle,
      targetPatientGroup,
      primaryRegimen: primary,
      alternativeRegimen: alternative,
      addOns,
      stepDownRegimen: stepDown,
      monitoringPlan
    };
  }

  public generateInpatientRegimen(inputs: Step4InputData): EmpiricalRegimenResult {
    const primary: AntibioticInfo[] = [];
    const alternative: AntibioticInfo[] = [];
    const addOns: AntibioticInfo[] = [];
    const stepDown: AntibioticInfo[] = [];
    const monitoringPlan: string[] = [
      'Đánh giá lại đáp ứng lâm sàng, SpO2, thân nhiệt, công thức máu và Procalcitonin sau 48-72 giờ.',
      'Xem xét chuyển từ kháng sinh tiêm truyền sang kháng sinh đường uống (Oral Step-down) khi bệnh nhân ổn định lâm sàng.'
    ];

    const targetPatientGroup = 'Điều trị Nội trú Khoa Nội Hô hấp / Nội Tổng hợp (CAP mức độ trung bình, không có chỉ định ICU)';
    const regimenTitle = 'Phác đồ Nội trú Khoa Nội (Beta-lactam IV + Macrolide HOẶC Quinolone hô hấp)';

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
      name: 'Amoxicillin / Acid Clavulanic (hoặc Levofloxacin / Moxifloxacin)',
      dose: 'Amox/Clav 875/125mg uống 2 lần/ngày HOẶC Levo 750mg uống 1 lần/ngày',
      route: 'ORAL',
      role: 'Kháng sinh chuyển tiếp đường uống khi xuất viện',
      drugClass: 'Oral Step-down'
    });

    let respSupport: string | undefined;
    if ((inputs.spo2 ?? 98) < 92.0) {
      respSupport = 'Thở oxy qua gọng mũi (Nasal cannula) 2-4 L/phút, duy trì SpO2 mục tiêu 92-96% (hoặc 88-92% ở bệnh nhân COPD / tăng CO2 máu mạn tính).';
    }

    return {
      careSetting: 'Nội trú Khoa Nội Tổng quát / Hô hấp',
      regimenTitle,
      targetPatientGroup,
      primaryRegimen: primary,
      alternativeRegimen: alternative,
      addOns,
      stepDownRegimen: stepDown,
      respiratorySupport: respSupport,
      monitoringPlan
    };
  }

  public generateIcuRegimen(inputs: Step4InputData): EmpiricalRegimenResult {
    const primary: AntibioticInfo[] = [];
    const alternative: AntibioticInfo[] = [];
    const addOns: AntibioticInfo[] = [];
    const stepDown: AntibioticInfo[] = [];
    const monitoringPlan: string[] = [
      'Bắt đầu kháng sinh tĩnh mạch trong vòng 1 GIỜ ĐẦU (Golden Hour).',
      'Định lượng nồng độ đáy Vancomycin (trough level mục tiêu 15-20 mcg/mL) trước liều thứ 4.',
      'Đánh giá động học Procalcitonin (D0, D3, D5-D7) và chụp CT ngực nếu lâm sàng không cải thiện sau 72 giờ.'
    ];

    const targetPatientGroup = 'Điều trị Hồi sức Tích cực (ICU / HDU) - Viêm phổi nặng / Sốc nhiễm khuẩn / Suy hô hấp cấp';
    let regimenTitle = 'Phác đồ Hồi sức Cấp cứu (ICU)';

    if (inputs.suspectPseudomonas) {
      regimenTitle = 'Phác đồ ICU (Bao phủ Pseudomonas aeruginosa)';

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
      regimenTitle = 'Phác đồ ICU chuẩn (Beta-lactam IV liều cao + Quinolone hô hấp / Macrolide)';

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

    if (inputs.suspectMrsa) {
      addOns.push({
        name: 'Vancomycin (hoặc Linezolid)',
        dose: 'Vancomycin 15-20mg/kg TTM mỗi 8-12h (kèm liều nạp 25-30mg/kg ở BN nặng) HOẶC Linezolid 600mg TTM mỗi 12h',
        route: 'IV',
        role: 'Bao phủ Tụ cầu vàng kháng Methicillin (MRSA)',
        drugClass: 'Glycopeptide / Oxazolidinone',
        note: 'Bắt buộc đo nồng độ đáy Vancomycin mục tiêu 15-20 mcg/mL.'
      });
    }

    let cortico: string | undefined;
    if (inputs.within24hIcu) {
      cortico = 'Corticosteroid sớm (trong 24h đầu nhập ICU): Hydrocortisone 200mg/ngày (50mg tiêm TM mỗi 6h hoặc truyền liên tục) trong 4-7 ngày cho bệnh nhân sốc nhiễm khuẩn hoặc PaO2/FiO2 < 200.';
    }

    const respSupport = 'Hỗ trợ hô hấp: Liệu pháp Oxy dòng cao qua canun mũi (HFNC) hoặc Thở máy không xâm nhập (NIV/BiPAP). Đặt nội khí quản và thở máy xâm nhập chiến lược bảo vệ phổi (Vt 6mL/kg PBW, Pplat < 30 cmH2O) nếu suy hô hấp tiến triển.';

    return {
      careSetting: 'Hồi sức Tích cực (ICU)',
      regimenTitle,
      targetPatientGroup,
      primaryRegimen: primary,
      alternativeRegimen: alternative,
      addOns,
      stepDownRegimen: stepDown,
      corticosteroidRecommendation: cortico,
      respiratorySupport: respSupport,
      monitoringPlan
    };
  }

  public evaluate(inputs: Step4InputData): EmpiricalRegimenResult {
    const settingStr = String(inputs.careSetting || 'OUTPATIENT');

    if (settingStr.includes('ICU') || settingStr.includes('Rất nặng')) {
      return this.generateIcuRegimen(inputs);
    } else if (settingStr.includes('INPATIENT') || settingStr.includes('Nội trú')) {
      return this.generateInpatientRegimen(inputs);
    } else {
      return this.generateOutpatientRegimen(inputs);
    }
  }
}
