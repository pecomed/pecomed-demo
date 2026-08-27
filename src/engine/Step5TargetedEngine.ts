import {
  TargetedRegimenResult,
  OralStepDownResult,
  TreatmentResponse72hResult
} from '../models/types.js';

export class Step5TargetedEngine {

  public getSpneumoniaeRegimen(micPenicillin: number = 1.0): TargetedRegimenResult {
    if (micPenicillin <= 2.0) {
      return {
        pathogenName: `Streptococcus pneumoniae (Phế cầu nhạy cảm Penicillin, MIC = ${micPenicillin} mcg/mL <= 2)`,
        targetedAntibiotics: [
          'Penicillin G 2-4 triệu UI tiêm TM mỗi 4-6 giờ (12-24 triệu UI/ngày)',
          'Ceftriaxone 1-2g tiêm TM mỗi 24 giờ',
          'Amoxicillin 1g uống mỗi 8 giờ (khi chuyển uống)'
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

  public getStaphAureusRegimen(isMrsa: boolean = false): TargetedRegimenResult {
    if (!isMrsa) {
      return {
        pathogenName: 'Staphylococcus aureus nhạy cảm Methicillin (MSSA)',
        targetedAntibiotics: [
          'Oxacillin (hoặc Cloxacillin) 2g tiêm TM mỗi 4 giờ',
          'Cefazolin 2g tiêm TM mỗi 8 giờ'
        ],
        dosageAndAdministration: 'Oxacillin/Cefazolin vượt trội hơn Vancomycin trong điều trị MSSA.',
        duration: '7 - 14 ngày (21-28 ngày nếu có nhiễm khuẩn huyết hoặc áp xe phổi)',
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
          'Linezolid 600mg truyền TM hoặc uống mỗi 12 giờ',
          'Ceftaroline 600mg truyền TM mỗi 12 giờ'
        ],
        dosageAndAdministration: 'Truyền Vancomycin chậm trong ít nhất 60-120 phút để tránh hội chứng Red Man.',
        duration: '7 - 14 ngày (kéo dài đến 21 ngày nếu viêm phổi hoại tử / tạo hang)',
        monitoringAndWarnings: [
          'Mục tiêu nồng độ đáy Vancomycin (Trough level): 15 - 20 mcg/mL.',
          'Linezolid: Theo dõi tiểu cầu và huyết đồ nếu dùng kéo dài > 14 ngày.'
        ]
      };
    }
  }

  public getKlebsiellaRegimen(isEsbl: boolean = false, isCarbapenemResistant: boolean = false): TargetedRegimenResult {
    if (!isEsbl) {
      return {
        pathogenName: 'Klebsiella pneumoniae (Không sinh ESBL - Nhạy cảm Cephalosporin thế hệ 3)',
        targetedAntibiotics: [
          'Ceftriaxone 1-2g tiêm TM mỗi 24 giờ',
          'Piperacillin / Tazobactam 4.5g TTM mỗi 6-8 giờ',
          'Levofloxacin 750mg TTM mỗi 24 giờ'
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

  public getPseudomonasRegimen(isResistant: boolean = false): TargetedRegimenResult {
    if (!isResistant) {
      return {
        pathogenName: 'Pseudomonas aeruginosa (Trực khuẩn mủ xanh - Nhạy cảm)',
        targetedAntibiotics: [
          'Piperacillin / Tazobactam 4.5g truyền TM mỗi 6 giờ (truyền kéo dài 3-4 giờ)',
          'Cefepime 2g truyền TM mỗi 8 giờ (hoặc Ceftazidime 2g mỗi 8h)',
          'Meropenem 1g truyền TM mỗi 8 giờ',
          'Phối hợp Levofloxacin 750mg mỗi 24h hoặc Ciprofloxacin 400mg mỗi 8h / Amikacin 15-20mg/kg/ngày'
        ],
        dosageAndAdministration: 'Nên phối hợp 2 kháng sinh khác nhóm trong 3-5 ngày đầu ở bệnh nhân nặng / thở máy.',
        duration: '10 - 14 ngày',
        monitoringAndWarnings: [
          'Áp dụng chiến lược truyền kéo dài (Extended infusion) để đạt mục tiêu %T > MIC.',
          'Xuống thang đơn trị liệu sau khi có kết quả KSĐ và bệnh nhân cải thiện lâm sàng.'
        ]
      };
    } else {
      return {
        pathogenName: 'Pseudomonas aeruginosa kháng thuốc (MDR / XDR)',
        targetedAntibiotics: [
          'Ceftolozane / Tazobactam 3g truyền TM mỗi 8 giờ',
          'Ceftazidime / Avibactam 2.5g truyền TM mỗi 8 giờ',
          'Colistin truyền tĩnh mạch phối hợp Meropenem liều cao truyền kéo dài'
        ],
        dosageAndAdministration: 'Ceftolozane/Tazobactam là vũ khí ưu tiên hàng đầu cho P. aeruginosa kháng Carbapenem do mất porin OprD.',
        duration: '14 ngày',
        monitoringAndWarnings: ['Hội chẩn Vi sinh và Dược lâm sàng.']
      };
    }
  }

  public getWhitmoreRegimen(
    isBacteremia: boolean = false,
    hasArthritisAbscess: boolean = false,
    hasOsteomyelitis: boolean = false,
    isCysticFibrosis: boolean = false
  ): TargetedRegimenResult {
    let attackDurationWeeks: string;
    let desc: string;

    if (hasOsteomyelitis) {
      attackDurationWeeks = 'Tối thiểu 6 tuần';
      desc = 'Thể viêm tủy xương / nhiễm trùng xương khớp sâu';
    } else if (hasArthritisAbscess) {
      attackDurationWeeks = 'Tối thiểu 4 tuần';
      desc = 'Thể áp xe đa cơ quan / viêm khớp nhiễm khuẩn';
    } else if (isBacteremia) {
      attackDurationWeeks = 'Tối thiểu 3 tuần';
      desc = 'Thể nhiễm khuẩn huyết tiên phát';
    } else {
      attackDurationWeeks = 'Tối thiểu 2 tuần (14 ngày)';
      desc = 'Thể viêm phổi Whitmore đơn thuần';
    }

    return {
      pathogenName: `Burkholderia pseudomallei (Bệnh Whitmore - ${desc})`,
      targetedAntibiotics: [
        'Giai đoạn tấn công: Ceftazidime 2g (hoặc 50mg/kg) tiêm TM mỗi 6-8 giờ HOẶC Meropenem 1g tiêm TM mỗi 8 giờ (ưu tiên Meropenem nếu sốc/nặng)',
        'Giai đoạn duy trì: Cotrimoxazole (TMP/SMX) 160/800mg: 2 viên x 2 lần/ngày (kèm Acid Folic 5mg/ngày)'
      ],
      dosageAndAdministration: `Giai đoạn tấn công: ${attackDurationWeeks} tiêm truyền TM. Sau đó chuyển sang giai đoạn duy trì bằng Cotrimoxazole đường uống trong 12 - 24 tuần (3 - 6 tháng).`,
      duration: `Tấn công: ${attackDurationWeeks} -> Duy trì: 3 đến 6 tháng`,
      monitoringAndWarnings: [
        'QUY TẮC BẮT BUỘC: Không được dừng thuốc duy trì sớm vì tỉ lệ tái phát và tử vong rất cao.',
        'Theo dõi công thức máu, men gan, chức năng thận và phát ban da định kỳ trong suốt thời gian dùng TMP/SMX.'
      ]
    };
  }

  public getAtypicalRegimen(agent: string = 'Mycoplasma / Legionella'): TargetedRegimenResult {
    const isLegionella = agent.toLowerCase().includes('legionella');

    return {
      pathogenName: `Vi khuẩn không điển hình: ${agent}`,
      targetedAntibiotics: [
        'Azithromycin 500mg tiêm TM hoặc uống 1 lần/ngày',
        'Levofloxacin 750mg tiêm TM hoặc uống 1 lần/ngày',
        'Moxifloxacin 400mg tiêm TM hoặc uống 1 lần/ngày',
        'Doxycycline 100mg uống 2 lần/ngày (cho Mycoplasma/Chlamydia)'
      ],
      dosageAndAdministration: isLegionella ? 'Legionella: Ưu tiên Levofloxacin hoặc Azithromycin đường truyền TM giai đoạn đầu.' : 'Uống hoặc tiêm truyền.',
      duration: isLegionella ? '10 - 14 ngày (21 ngày ở người suy giảm miễn dịch)' : '5 - 7 ngày',
      monitoringAndWarnings: [
        'Vi khuẩn nội bào không có vách tế bào Peptidoglycan nên KHÔNG ĐÁP ỨNG với tất cả các kháng sinh nhóm Beta-lactam (Penicillin, Cephalosporin, Carbapenem).'
      ]
    };
  }

  public getVirusRegimen(cannotSwallow: boolean = false, crclGt60: boolean = true): TargetedRegimenResult {
    const meds: string[] = [
      'Oseltamivir (Tamiflu) 75mg uống 2 lần/ngày trong 5 ngày (liều gấp đôi 150mg x 2 lần/ngày ở BN nặng/ICU)'
    ];

    if (cannotSwallow && crclGt60) {
      meds.push('Peramivir 600mg truyền TM 1 liều duy nhất trong 15-30 phút (cho bệnh nhân không uống được và CrCl > 60 mL/phút)');
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

    if (temp <= 37.8) {
      count++;
      criteriaDetails.push(`1. Thân nhiệt ổn định <= 37.8°C trong ít nhất 24 giờ (${temp}°C) [ĐẠT]`);
    } else {
      criteriaDetails.push(`1. Thân nhiệt > 37.8°C (${temp}°C) [CHƯA ĐẠT]`);
    }

    if (hr < 100) {
      count++;
      criteriaDetails.push(`2. Tần số tim < 100 lần/phút (${hr} bpm) [ĐẠT]`);
    } else {
      criteriaDetails.push(`2. Nhịp tim nhanh >= 100 lần/phút (${hr} bpm) [CHƯA ĐẠT]`);
    }

    if (rr < 24) {
      count++;
      criteriaDetails.push(`3. Tần số thở < 24 lần/phút (${rr} l/p) [ĐẠT]`);
    } else {
      criteriaDetails.push(`3. Nhịp thở nhanh >= 24 lần/phút (${rr} l/p) [CHƯA ĐẠT]`);
    }

    if (sbp >= 90) {
      count++;
      criteriaDetails.push(`4. Huyết áp tâm thu >= 90 mmHg (${sbp} mmHg) không cần vận mạch [ĐẠT]`);
    } else {
      criteriaDetails.push(`4. Huyết áp tụt < 90 mmHg (${sbp} mmHg) [CHƯA ĐẠT]`);
    }

    if (spo2 >= 90.0) {
      count++;
      criteriaDetails.push(`5. Độ bão hòa oxy SpO2 >= 90% khi thở khí trời (${spo2}%) [ĐẠT]`);
    } else {
      criteriaDetails.push(`5. SpO2 < 90% (${spo2}%) [CHƯA ĐẠT]`);
    }

    if (canEatAndSwallow) {
      count++;
      criteriaDetails.push('6. Có khả năng dung nạp và hấp thu thuốc đường tiêu hóa (không nôn, ăn uống được) [ĐẠT]');
    } else {
      criteriaDetails.push('6. Không có khả năng ăn uống hoặc nôn nhiều [CHƯA ĐẠT]');
    }

    if (normalMentalStatus) {
      count++;
      criteriaDetails.push('7. Tri giác / Tình trạng tâm thần hoàn toàn bình thường [ĐẠT]');
    } else {
      criteriaDetails.push('7. Còn rối loạn ý thức / lú lẫn [CHƯA ĐẠT]');
    }

    const eligible = (count === 7);

    const suggestedOralRegimens = eligible ? [
      'Amoxicillin / Acid Clavulanic 875/125mg: 1 viên uống mỗi 12 giờ',
      'Levofloxacin 750mg: 1 viên uống mỗi 24 giờ',
      'Moxifloxacin 400mg: 1 viên uống mỗi 24 giờ',
      'Cefuroxime axetil 500mg: 1 viên uống mỗi 12 giờ'
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
