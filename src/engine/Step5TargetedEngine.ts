import {
  TargetedRegimenResult,
  OralStepDownResult,
  TreatmentResponse72hResult
} from '../models/types.js';

export class Step5TargetedEngine {

  /**
   * 1. Haemophilus influenzae & Moraxella catarrhalis
   */
  public getHInfluenzaeMCatarrhalisRegimen(
    isBetaLactamasePositive: boolean = false,
    hasBetaLactamAllergy: boolean = false
  ): TargetedRegimenResult {
    if (hasBetaLactamAllergy) {
      return {
        pathogenName: 'Haemophilus influenzae / Moraxella catarrhalis (Bệnh nhân dị ứng Beta-lactam)',
        targetedAntibiotics: [
          'Cotrimoxazole (TMP-SMX) 5-10 mg/kg (theo liều TMP) truyền TM hoặc uống mỗi 12 giờ',
          'Doxycycline 100mg uống 2 lần/ngày',
          'Azithromycin 500mg ngày 1, sau đó 250mg/ngày từ ngày 2-5 (hoặc 500mg/ngày x 3 ngày)',
          'Ciprofloxacin 400mg TM mỗi 12h (chuyển uống 500mg x 2 lần/ngày)',
          'Levofloxacin 750mg uống hoặc TM mỗi 24 giờ'
        ],
        dosageAndAdministration: 'Uống hoặc tiêm truyền tĩnh mạch tùy mức độ nặng.',
        duration: '5 - 7 ngày',
        monitoringAndWarnings: [
          'H. influenzae và M. catarrhalis rất nhạy cảm với Fluoroquinolones và Macrolides.'
        ]
      };
    } else if (!isBetaLactamasePositive) {
      return {
        pathogenName: 'Haemophilus influenzae / Moraxella catarrhalis (Không sinh Beta-lactamase - Nhạy Aminopenicillin)',
        targetedAntibiotics: [
          'Ampicillin 2g truyền TM mỗi 6 giờ',
          'Amoxicillin 1000mg uống mỗi 8 giờ (khi chuyển uống)',
          'Amoxicillin / Acid Clavulanic 875/125mg uống mỗi 8-12 giờ'
        ],
        dosageAndAdministration: 'Dùng Ampicillin IV giai đoạn cấp, chuyển Amoxicillin PO khi ổn định.',
        duration: '5 - 7 ngày',
        monitoringAndWarnings: [
          'Xuống thang an toàn sang Aminopenicillin đơn thuần giúp tiết kiệm chi phí và hạn chế áp lực chọn lọc kháng thuốc.'
        ]
      };
    } else {
      return {
        pathogenName: 'Haemophilus influenzae / Moraxella catarrhalis (Sinh Beta-lactamase dương tính)',
        targetedAntibiotics: [
          'Ceftriaxone 1g truyền TM mỗi 12 giờ (hoặc 2g mỗi 24h)',
          'Amoxicillin / Acid Clavulanic 875/125mg uống mỗi 8-12 giờ',
          'Cefpodoxime 200mg uống mỗi 12h (hoặc Cefditoren 400mg mỗi 12h)'
        ],
        dosageAndAdministration: 'Tiêm Ceftriaxone IV, chuyển uống Augmentin hoặc Cephalosporin thế hệ 3 uống.',
        duration: '5 - 7 ngày',
        monitoringAndWarnings: [
          'Tránh dùng Ampicillin / Amoxicillin đơn thuần cho chủng sinh Beta-lactamase.'
        ]
      };
    }
  }

  /**
   * 2. Streptococcus pneumoniae (Phế cầu)
   */
  public getSpneumoniaeRegimen(micPenicillin: number = 1.0): TargetedRegimenResult {
    if (micPenicillin <= 2.0) {
      return {
        pathogenName: `Streptococcus pneumoniae (Phế cầu nhạy cảm Penicillin, MIC = ${micPenicillin} mcg/mL <= 2)`,
        targetedAntibiotics: [
          'Penicillin G 2-4 triệu UI tiêm TM mỗi 4-6 giờ (12-24 triệu UI/ngày)',
          'Ceftriaxone 1-2g tiêm TM mỗi 24 giờ (hoặc Cefotaxime 2g mỗi 8h)',
          'Amoxicillin 1g uống mỗi 8 giờ (3g/ngày) HOẶC Doxycycline 100mg uống 2 lần/ngày (khi chuyển uống)'
        ],
        dosageAndAdministration: 'Dùng đường tiêm tĩnh mạch giai đoạn cấp, chuyển uống Amoxicillin khi ổn định.',
        duration: '5 - 7 ngày (hoặc hết sốt 48 giờ)',
        monitoringAndWarnings: [
          'Phế cầu nhạy cảm đáp ứng rất tốt với Beta-lactam thông thường.',
          'Không cần phối hợp thêm Macrolide hoặc Quinolone nếu đã có kết quả cấy khẳng định nhạy cảm.'
        ]
      };
    } else if (micPenicillin < 8.0) {
      return {
        pathogenName: `Streptococcus pneumoniae (Trung gian Penicillin, MIC = ${micPenicillin} mcg/mL: 2 < MIC < 8)`,
        targetedAntibiotics: [
          'Ceftaroline 600mg truyền TM mỗi 12 giờ',
          'Levofloxacin 750mg TTM mỗi 24h HOẶC Moxifloxacin 400mg TTM mỗi 24h',
          'Ceftriaxone liều cao 2g truyền TM mỗi 12h (hoặc Amoxicillin liều cao 2g mỗi 8h nếu MIC 2-4)'
        ],
        dosageAndAdministration: 'Cần tăng liều Beta-lactam hoặc dùng Cephalosporin thế hệ 5 (Ceftaroline) / Quinolone hô hấp.',
        duration: '7 - 10 ngày',
        monitoringAndWarnings: [
          'Phế cầu giảm nhạy / trung gian với Penicillin liều chuẩn.',
          'Đánh giá lại X-quang và Procalcitonin sau 72h.'
        ]
      };
    } else {
      return {
        pathogenName: `Streptococcus pneumoniae (Kháng Penicillin liều cao, MIC = ${micPenicillin} mcg/mL >= 8)`,
        targetedAntibiotics: [
          'Vancomycin 15-20 mg/kg truyền TM mỗi 8-12 giờ (đo nồng độ đáy 15-20 mcg/mL)',
          'Linezolid 600mg truyền TM hoặc uống mỗi 12 giờ'
        ],
        dosageAndAdministration: 'Bắt buộc dùng Glycopeptide hoặc Oxazolidinone.',
        duration: '10 - 14 ngày',
        monitoringAndWarnings: [
          'Chủng phế cầu kháng đa thuốc (DRSP).',
          'Theo dõi chức năng thận và công thức máu định kỳ.'
        ]
      };
    }
  }

  /**
   * 3. Staphylococcus aureus (Tụ cầu vàng)
   */
  public getStaphAureusRegimen(isMrsa: boolean = false, isBacteremia: boolean = false): TargetedRegimenResult {
    if (!isMrsa) {
      return {
        pathogenName: 'Staphylococcus aureus nhạy cảm Methicillin (MSSA)',
        targetedAntibiotics: [
          'Oxacillin (hoặc Cloxacillin) 2g tiêm TM mỗi 4 giờ (12g/ngày)',
          'Cefazolin 2g tiêm TM mỗi 8 giờ',
          'Ceftaroline 600mg truyền TM mỗi 12 giờ (nếu có chỉ định phối hợp)'
        ],
        dosageAndAdministration: 'Oxacillin/Cefazolin vượt trội hơn Vancomycin trong điều trị MSSA.',
        duration: isBacteremia ? 'Tối thiểu 4 tuần (28 ngày) do có nhiễm khuẩn huyết' : '7 - 14 ngày (kéo dài 21 ngày nếu có áp xe/hoại tử)',
        monitoringAndWarnings: [
          'Xuống thang ngay từ Vancomycin sang Oxacillin khi có kết quả MSSA.',
          'Siêu âm tim loại trừ viêm nội tâm mạc nhiễm khuẩn nếu cấy máu dương tính.'
        ]
      };
    } else {
      return {
        pathogenName: 'Staphylococcus aureus kháng Methicillin (MRSA)',
        targetedAntibiotics: [
          'Vancomycin 15-20 mg/kg truyền TM mỗi 8-12h (kèm liều nạp 25-30 mg/kg)',
          'Teicoplanin 6mg/kg (hoặc 800mg) mỗi 12h x 3 liều nạp, sau đó 6mg/kg (800mg) mỗi 24h TTM',
          'Linezolid 600mg truyền TM hoặc uống mỗi 12 giờ',
          'Ceftaroline 600mg truyền TM mỗi 8 giờ (Lựa chọn cứu vãn khi hết thuốc / dị ứng / thất bại phác đồ đầu)'
        ],
        dosageAndAdministration: 'Truyền Vancomycin chậm trong ít nhất 60-120 phút để tránh hội chứng Red Man.',
        duration: isBacteremia ? 'Tối thiểu 4 tuần (28 ngày)' : '7 - 14 ngày (kéo dài 21 ngày nếu viêm phổi hoại tử / tạo hang)',
        monitoringAndWarnings: [
          'Mục tiêu nồng độ đáy Vancomycin (Trough level): 15 - 20 mcg/mL trước liều thứ 4.',
          'Linezolid: Theo dõi tiểu cầu và huyết đồ nếu dùng kéo dài > 14 ngày.'
        ]
      };
    }
  }

  /**
   * 4. Klebsiella pneumoniae
   */
  public getKlebsiellaRegimen(isEsbl: boolean = false, isCarbapenemResistant: boolean = false): TargetedRegimenResult {
    if (!isEsbl) {
      return {
        pathogenName: 'Klebsiella pneumoniae (Không sinh ESBL - Nhạy cảm Cephalosporin thế hệ 3)',
        targetedAntibiotics: [
          'Ceftriaxone 1g tiêm TM mỗi 12 giờ (hoặc 2g mỗi 24h)',
          'Piperacillin / Tazobactam 3.375g - 4.5g TTM liều nạp 30 phút, sau đó mỗi 6h',
          'Ciprofloxacin 400mg TM mỗi 12h HOẶC Levofloxacin 750mg TM mỗi 24h (hoặc 500mg mỗi 12h)'
        ],
        dosageAndAdministration: 'Khi kháng Cephalosporin thế hệ 3 và Quinolone nhưng ESBL(-): Cân nhắc Cefepime 1-2g TTM mỗi 8h (truyền kéo dài).',
        duration: '7 - 10 ngày',
        monitoringAndWarnings: ['Điều chỉnh theo kháng sinh đồ cụ thể.']
      };
    } else if (!isCarbapenemResistant) {
      return {
        pathogenName: 'Klebsiella pneumoniae sinh ESBL (ESBL dương tính, nhạy Carbapenem)',
        targetedAntibiotics: [
          'Ertapenem 1g tiêm TM mỗi 24 giờ (đối với thể trung bình - nặng không sốc)',
          'Meropenem 1g truyền TM mỗi 8 giờ (truyền kéo dài 3 giờ)',
          'Imipenem / Cilastatin 500mg truyền TM mỗi 6 giờ'
        ],
        dosageAndAdministration: 'Carbapenem là lựa chọn hàng đầu cho chủng sinh ESBL.',
        duration: '10 - 14 ngày',
        monitoringAndWarnings: [
          'Tránh dùng Cephalosporin thế hệ 3/4 ngay cả khi kết quả in vitro nhạy cảm (hiệu ứng inoculum).',
          'Tối ưu hóa PK/PD bằng cách truyền Meropenem kéo dài trong 3 giờ.'
        ]
      };
    } else {
      return {
        pathogenName: 'Klebsiella pneumoniae kháng Carbapenem (CRE / KPC / NDM)',
        targetedAntibiotics: [
          'Ceftazidime / Avibactam 2.5g truyền TM mỗi 8 giờ (nếu sinh KPC/OXA-48)',
          'Ceftazidime / Avibactam + Aztreonam 2g mỗi 8h (nếu sinh Metallo-beta-lactamase NDM)',
          'Colistin (Polymyxin E) liều nạp 9 triệu UI, sau đó 4.5 triệu UI mỗi 12h + Kháng sinh phối hợp'
        ],
        dosageAndAdministration: 'Hội chẩn chuyên gia Vi sinh & Dược lâm sàng để chọn phác đồ phối hợp diệt khuẩn.',
        duration: '14 - 21 ngày',
        monitoringAndWarnings: [
          'Chủng vi khuẩn siêu kháng thuốc nguy cơ tử vong cao.',
          'Theo dõi sát độc tính thận của Colistin và hiệu chỉnh liều hàng ngày.'
        ]
      };
    }
  }

  /**
   * 5. Pseudomonas aeruginosa (Trực khuẩn mủ xanh)
   */
  public getPseudomonasRegimen(isResistant: boolean = false, isCysticFibrosis: boolean = false): TargetedRegimenResult {
    const aerosolList = isCysticFibrosis ? [
      'Tobramycin 300mg, 2 lần/ngày (phun khí dung)',
      'Colistin 50-75mg (1.5-2.25 triệu UI), 2 lần/ngày (phun khí dung)',
      'Aztreonam 75mg, 3 lần/ngày (phun khí dung)'
    ] : undefined;

    if (!isResistant) {
      return {
        pathogenName: 'Pseudomonas aeruginosa (Trực khuẩn mủ xanh - Nhạy cảm)',
        targetedAntibiotics: [
          'Piperacillin / Tazobactam 4.5g truyền TM mỗi 6 giờ (truyền kéo dài 3-4 giờ)',
          'Cefepime 2g truyền TM mỗi 8-12 giờ (hoặc Ceftazidime 2g mỗi 8h)',
          'Meropenem 1-2g truyền TM mỗi 8 giờ (truyền kéo dài 3 giờ)',
          'Phối hợp Ciprofloxacin 400mg TM mỗi 8-12h HOẶC Levofloxacin 750mg mỗi 24h HOẶC Amikacin 15-20mg/kg/ngày'
        ],
        dosageAndAdministration: 'Nên phối hợp 2 kháng sinh khác nhóm trong 3-5 ngày đầu ở bệnh nhân nặng / thở máy.',
        duration: '10 - 14 ngày',
        monitoringAndWarnings: [
          'Áp dụng chiến lược truyền kéo dài (Extended infusion) để đạt mục tiêu %T > MIC.',
          'Xuống thang đơn trị liệu sau khi có kết quả KSĐ và bệnh nhân cải thiện lâm sàng.'
        ],
        aerosolProphylaxis: aerosolList
      };
    } else {
      return {
        pathogenName: 'Pseudomonas aeruginosa kháng thuốc (MDR / XDR / Kháng Ceftazidime & Cefepime)',
        targetedAntibiotics: [
          'Ceftolozane / Tazobactam 3g truyền TM mỗi 8 giờ',
          'Ceftazidime / Avibactam 2.5g truyền TM mỗi 8 giờ',
          'Colistin truyền tĩnh mạch phối hợp Meropenem liều cao (2g q8h) truyền kéo dài'
        ],
        dosageAndAdministration: 'Ceftolozane/Tazobactam là vũ khí ưu tiên hàng đầu cho P. aeruginosa kháng Carbapenem do mất porin OprD.',
        duration: '14 ngày',
        monitoringAndWarnings: ['Hội chẩn Vi sinh và Dược lâm sàng.'],
        aerosolProphylaxis: aerosolList
      };
    }
  }

  /**
   * 6. Burkholderia pseudomallei (Bệnh Whitmore / Melioidosis) - 6 Duration Pathways
   */
  public getWhitmoreRegimen(
    isBacteremia: boolean = false,
    multilobar: boolean = false,
    hasArthritisAbscess: boolean = false,
    hasOsteomyelitis: boolean = false,
    isPregnant: boolean = false
  ): TargetedRegimenResult {
    let attackDurationWeeks: string;
    let desc: string;

    if (hasOsteomyelitis) {
      attackDurationWeeks = 'Tối thiểu 6 tuần';
      desc = 'Thể viêm tủy xương / nhiễm trùng xương khớp sâu';
    } else if (hasArthritisAbscess) {
      attackDurationWeeks = 'Tối thiểu 4 tuần';
      desc = 'Thể áp xe đa cơ quan / viêm khớp nhiễm khuẩn';
    } else if (isBacteremia && multilobar) {
      attackDurationWeeks = 'Tối thiểu 4 tuần';
      desc = 'Thể nhiễm khuẩn huyết kèm tổn thương nhiều thùy phổi';
    } else if (isBacteremia || multilobar) {
      attackDurationWeeks = 'Tối thiểu 3 tuần';
      desc = isBacteremia ? 'Thể nhiễm khuẩn huyết (mờ 1 thùy)' : 'Thể viêm phổi nhiều thùy (không cấy máu +)';
    } else {
      attackDurationWeeks = 'Tối thiểu 2 tuần (14 ngày)';
      desc = 'Thể viêm phổi Whitmore đơn thuần (mờ 1 thùy)';
    }

    const attackMeds = [
      'Giai đoạn tấn công: Ceftazidime 2g (hoặc 50mg/kg) tiêm TM mỗi 6-8 giờ HOẶC Meropenem 1-2g tiêm TM mỗi 8 giờ (truyền kéo dài 3h, ưu tiên Meropenem nếu sốc/nặng)'
    ];

    const maintMeds = isPregnant ? [
      'Giai đoạn duy trì (Phụ nữ mang thai): Amoxicillin / Acid Clavulanic 20mg/5mg/kg uống 3 lần/ngày trong 12 - 24 tuần'
    ] : [
      'Giai đoạn duy trì: Cotrimoxazole (TMP/SMX) 160/800mg: 2 viên x 2 lần/ngày (6-8 mg/kg TMP/ngày) + Acid Folic 5mg/ngày'
    ];

    return {
      pathogenName: `Burkholderia pseudomallei (Bệnh Whitmore - ${desc})`,
      targetedAntibiotics: [...attackMeds, ...maintMeds],
      dosageAndAdministration: `Giai đoạn tấn công: ${attackDurationWeeks} tiêm truyền TM. Sau đó chuyển sang giai đoạn duy trì bằng ${isPregnant ? 'Augmentin' : 'Cotrimoxazole'} đường uống trong 12 - 24 tuần (3 - 6 tháng).`,
      duration: `Tấn công: ${attackDurationWeeks} -> Duy trì: 3 đến 6 tháng`,
      monitoringAndWarnings: [
        'QUY TẮC BẮT BUỘC: Không được dừng thuốc duy trì sớm vì tỉ lệ tái phát và tử vong rất cao.',
        'Theo dõi công thức máu, men gan, chức năng thận và phát ban da định kỳ trong suốt thời gian dùng TMP/SMX.'
      ]
    };
  }

  /**
   * 7. Vi khuẩn không điển hình (Atypicals)
   */
  public getAtypicalRegimen(agent: string = 'Mycoplasma / Legionella / Chlamydia'): TargetedRegimenResult {
    const isLegionella = agent.toLowerCase().includes('legionella');
    const isChlamydia = agent.toLowerCase().includes('chlamydia');

    const meds: string[] = [];
    if (isLegionella) {
      meds.push('Levofloxacin 750mg tiêm TM hoặc uống 1 lần/ngày');
      meds.push('Azithromycin 500mg tiêm TM hoặc uống 1 lần/ngày');
      meds.push('Moxifloxacin 400mg tiêm TM hoặc uống 1 lần/ngày');
    } else if (isChlamydia) {
      meds.push('Doxycycline 100mg uống 2 lần/ngày trong 14 ngày');
      meds.push('Azithromycin 500mg ngày 1, sau đó 250mg/ngày từ ngày 2-5');
      meds.push('Clarithromycin 500mg uống 2 lần/ngày trong 10 ngày');
    } else {
      // Mycoplasma / General
      meds.push('Azithromycin 500mg ngày 1, sau đó 250mg/ngày từ ngày 2-5 (hoặc 500mg/ngày x 3 ngày)');
      meds.push('Doxycycline 100mg uống 2 lần/ngày trong 7-10 ngày');
      meds.push('Levofloxacin 750mg uống 1 lần/ngày HOẶC Moxifloxacin 400mg uống 1 lần/ngày');
    }

    return {
      pathogenName: `Vi khuẩn không điển hình: ${agent}`,
      targetedAntibiotics: meds,
      dosageAndAdministration: isLegionella ? 'Legionella: Ưu tiên Levofloxacin hoặc Azithromycin đường truyền TM giai đoạn đầu.' : 'Uống hoặc tiêm truyền.',
      duration: isLegionella ? '10 - 14 ngày (21 ngày ở người suy giảm miễn dịch)' : isChlamydia ? '10 - 14 ngày' : '5 - 7 ngày',
      monitoringAndWarnings: [
        'Vi khuẩn nội bào không có vách tế bào Peptidoglycan nên KHÔNG ĐÁP ỨNG với tất cả các kháng sinh nhóm Beta-lactam (Penicillin, Cephalosporin, Carbapenem).'
      ]
    };
  }

  /**
   * 8. Virus đường hô hấp (Cúm / Influenza)
   */
  public getVirusRegimen(cannotSwallow: boolean = false, crclGt60: boolean = true, isOutpatient: boolean = false): TargetedRegimenResult {
    const meds: string[] = [
      'Oseltamivir (Tamiflu) 75mg uống 2 lần/ngày trong 5 ngày (liều gấp đôi 150mg x 2 lần/ngày ở BN nặng/ICU)'
    ];

    if (isOutpatient) {
      meds.push('Zanamivir 10mg (2 lần hít 5mg) x 2 lần/ngày trong 5 ngày (phun khí dung / hít qua miệng)');
    }

    if (cannotSwallow && crclGt60) {
      meds.push('Peramivir 600mg truyền TM 1 liều duy nhất trong 15-30 phút (cho bệnh nhân không nuốt được và CrCl > 60 mL/phút)');
    }

    return {
      pathogenName: 'Virus Cúm (Influenza A/B)',
      targetedAntibiotics: meds,
      dosageAndAdministration: 'Khởi đầu thuốc ức chế Neuraminidase càng sớm càng tốt (tốt nhất trong vòng 48 giờ đầu khởi phát triệu chứng).',
      duration: '5 ngày',
      monitoringAndWarnings: [
        'Cảnh báo bội nhiễm vi khuẩn thứ phát sau cúm (đặc biệt Tụ cầu vàng S. aureus và Phế cầu S. pneumoniae).'
      ]
    };
  }

  /**
   * 9. 7 Tiêu chí Chuyển kháng sinh đường uống (Oral Step-down) - Fixed inclusive cutoffs
   */
  public evaluateOralStepDown(
    temp: number,
    hr: number,
    rr: number,
    sbp: number,
    spo2: number,
    canEatAndSwallow: boolean,
    normalMentalStatus: boolean
  ): OralStepDownResult {
    const criteriaDetails: string[] = [];
    let count = 0;

    // 1. Temp <= 37.8
    if (temp <= 37.8) {
      count++;
      criteriaDetails.push(`1. Thân nhiệt ổn định <= 37.8°C trong ít nhất 24 giờ (${temp}°C) [ĐẠT]`);
    } else {
      criteriaDetails.push(`1. Thân nhiệt > 37.8°C (${temp}°C) [CHƯA ĐẠT]`);
    }

    // 2. HR <= 100
    if (hr <= 100) {
      count++;
      criteriaDetails.push(`2. Tần số tim <= 100 lần/phút (${hr} bpm) [ĐẠT]`);
    } else {
      criteriaDetails.push(`2. Nhịp tim nhanh > 100 lần/phút (${hr} bpm) [CHƯA ĐẠT]`);
    }

    // 3. RR <= 24
    if (rr <= 24) {
      count++;
      criteriaDetails.push(`3. Tần số thở <= 24 lần/phút (${rr} l/p) [ĐẠT]`);
    } else {
      criteriaDetails.push(`3. Nhịp thở nhanh > 24 lần/phút (${rr} l/p) [CHƯA ĐẠT]`);
    }

    // 4. SBP >= 90
    if (sbp >= 90) {
      count++;
      criteriaDetails.push(`4. Huyết áp tâm thu >= 90 mmHg (${sbp} mmHg) không cần vận mạch [ĐẠT]`);
    } else {
      criteriaDetails.push(`4. Huyết áp tụt < 90 mmHg (${sbp} mmHg) [CHƯA ĐẠT]`);
    }

    // 5. SpO2 >= 90
    if (spo2 >= 90.0) {
      count++;
      criteriaDetails.push(`5. Độ bão hòa oxy SpO2 >= 90% khi thở khí trời (${spo2}%) [ĐẠT]`);
    } else {
      criteriaDetails.push(`5. SpO2 < 90% (${spo2}%) [CHƯA ĐẠT]`);
    }

    // 6. Can eat/swallow
    if (canEatAndSwallow) {
      count++;
      criteriaDetails.push('6. Có khả năng dung nạp và hấp thu thuốc đường tiêu hóa (không nôn, ăn uống được) [ĐẠT]');
    } else {
      criteriaDetails.push('6. Không có khả năng ăn uống hoặc nôn nhiều [CHƯA ĐẠT]');
    }

    // 7. Normal mental status
    if (normalMentalStatus) {
      count++;
      criteriaDetails.push('7. Tri giác / Tình trạng tâm thần hoàn toàn bình thường [ĐẠT]');
    } else {
      criteriaDetails.push('7. Còn rối loạn ý thức / lú lẫn [CHƯA ĐẠT]');
    }

    const eligible = (count === 7);

    const suggestedOralRegimens = eligible ? [
      'Amoxicillin 1000mg mỗi 8 giờ (cho Phế cầu/H. influenzae nhạy cảm)',
      'Amoxicillin / Acid Clavulanic 875/125mg: 1 viên uống mỗi 8-12 giờ',
      'Levofloxacin 750mg: 1 viên uống mỗi 24 giờ',
      'Moxifloxacin 400mg: 1 viên uống mỗi 24 giờ',
      'Cefuroxime axetil 500mg: 1 viên uống mỗi 12 giờ',
      'Cefpodoxime 200mg uống mỗi 12 giờ'
    ] : [];

    const clinicalGuidance = eligible
      ? 'Bệnh nhân ĐỦ ĐIỀU KIỆN (7/7 tiêu chí) chuyển từ kháng sinh tĩnh mạch sang kháng sinh đường uống an toàn (Oral Step-down) và chuẩn bị kế hoạch xuất viện.'
      : `Bệnh nhân CHƯA ĐỦ ĐIỀU KIỆN chuyển uống (đạt ${count}/7 tiêu chuẩn). Tiếp tục duy trì phác đồ kháng sinh tiêm truyền tĩnh mạch và đánh giá lại sau 24 giờ.`;

    return {
      eligible,
      metCriteriaCount: count,
      totalCriteriaCount: 7,
      criteriaDetails,
      suggestedOralRegimens,
      clinicalGuidance
    };
  }

  /**
   * 10. Đánh giá Đáp ứng điều trị sau 72 giờ & Động học Procalcitonin (PCT)
   */
  public evaluate72hResponse(
    hrGt125OrRrGt33: boolean,
    bpLt9060: boolean,
    imagingWorsening: boolean,
    atsScoreIncreased: boolean,
    respFailureWorsening: boolean,
    pctD0?: number,
    pctD3?: number,
    pctD5D7?: number
  ): TreatmentResponse72hResult {
    const isTreatmentFailure = hrGt125OrRrGt33 || bpLt9060 || imagingWorsening || atsScoreIncreased || respFailureWorsening;

    let pctKineticsInterpretation = 'Không có đủ dữ liệu xét nghiệm Procalcitonin.';
    if (pctD0 !== undefined && pctD3 !== undefined && pctD0 > 0) {
      const dropPct = ((pctD0 - pctD3) / pctD0) * 100.0;
      if (dropPct >= 80.0) {
        pctKineticsInterpretation = `Procalcitonin giảm ${dropPct.toFixed(1)}% (>= 80% từ D0 sang D3): ĐÁP ỨNG ĐIỀU TRỊ RẤT TỐT. Tiên lượng thuận lợi.`;
      } else if (dropPct >= 50.0) {
        pctKineticsInterpretation = `Procalcitonin giảm ${dropPct.toFixed(1)}% (50-80%): ĐÁP ỨNG MỘT PHẦN. Cần tiếp tục theo dõi sát.`;
      } else {
        pctKineticsInterpretation = `Procalcitonin không giảm hoặc tăng (D0=${pctD0}, D3=${pctD3}, mức giảm ${dropPct.toFixed(1)}% < 50%): CẢNH BÁO NGUY CƠ THẤT BẠI ĐIỀU TRỊ HOẶC VI KHUẨN KHÁNG THUỐC!`;
      }
    }

    const responseStatus = isTreatmentFailure
      ? 'THẤT BẠI ĐIỀU TRỊ / DIỄN TIẾN NẶNG LÊN SAU 72 GIỜ'
      : 'ĐÁP ỨNG ĐIỀU TRỊ TỐT SAU 72 GIỜ';

    const recommendedActions: string[] = isTreatmentFailure ? [
      '1. Khám và đánh giá lại toàn diện lâm sàng, cấy lặp lại đờm và cấy máu 2 vị trí.',
      '2. Chụp CT ngực cản quang tìm biến chứng ngoại khoa: Tràn dịch/mủ màng phổi, áp xe phổi, thuyên tắc phổi (PE).',
      '3. Nâng bậc phác đồ kháng sinh: Chuyển sang Carbapenem (Meropenem) + Phối hợp Vancomycin/Linezolid và Quinolone kháng Pseudomonas.',
      '4. Tìm căn nguyên không điển hình, virus hoặc nấm, lao; Hội chẩn liên khoa Hồi sức cấp cứu và Truyền nhiễm.'
    ] : [
      '1. Tiếp tục duy trì phác đồ kháng sinh hiện tại.',
      '2. Đánh giá 7 tiêu chí chuyển sang kháng sinh đường uống (Oral Step-down) nếu bệnh nhân ăn uống được.',
      '3. Lên kế hoạch xuất viện khi hoàn thành liệu trình điều trị.'
    ];

    return {
      responseStatus,
      pctKineticsInterpretation,
      isTreatmentFailure,
      recommendedActions
    };
  }
}
