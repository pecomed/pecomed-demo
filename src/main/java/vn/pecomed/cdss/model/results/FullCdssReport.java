package vn.pecomed.cdss.model.results;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * Complete clinical decision support report aggregating Steps 1 through 5.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FullCdssReport {
    private PatientCase patientCase;
    private SeverityAssessmentResult step1;
    private PathogenEngineResult step2;
    private ExclusionAssessmentResult step3;
    private EmpiricalRegimenResult step4;
    private TargetedRegimenResult step5;
    private OralStepDownResult oralStepDown;
    private TreatmentResponse72hResult response72h;

    public FullCdssReport() {
    }

    public FullCdssReport(PatientCase patientCase, SeverityAssessmentResult step1,
                          PathogenEngineResult step2, ExclusionAssessmentResult step3,
                          EmpiricalRegimenResult step4, TargetedRegimenResult step5,
                          OralStepDownResult oralStepDown, TreatmentResponse72hResult response72h) {
        this.patientCase = patientCase;
        this.step1 = step1;
        this.step2 = step2;
        this.step3 = step3;
        this.step4 = step4;
        this.step5 = step5;
        this.oralStepDown = oralStepDown;
        this.response72h = response72h;
    }

    public PatientCase getPatientCase() {
        return patientCase;
    }

    public void setPatientCase(PatientCase patientCase) {
        this.patientCase = patientCase;
    }

    public SeverityAssessmentResult getStep1() {
        return step1;
    }

    public void setStep1(SeverityAssessmentResult step1) {
        this.step1 = step1;
    }

    public PathogenEngineResult getStep2() {
        return step2;
    }

    public void setStep2(PathogenEngineResult step2) {
        this.step2 = step2;
    }

    public ExclusionAssessmentResult getStep3() {
        return step3;
    }

    public void setStep3(ExclusionAssessmentResult step3) {
        this.step3 = step3;
    }

    public EmpiricalRegimenResult getStep4() {
        return step4;
    }

    public void setStep4(EmpiricalRegimenResult step4) {
        this.step4 = step4;
    }

    public TargetedRegimenResult getStep5() {
        return step5;
    }

    public void setStep5(TargetedRegimenResult step5) {
        this.step5 = step5;
    }

    public OralStepDownResult getOralStepDown() {
        return oralStepDown;
    }

    public void setOralStepDown(OralStepDownResult oralStepDown) {
        this.oralStepDown = oralStepDown;
    }

    public TreatmentResponse72hResult getResponse72h() {
        return response72h;
    }

    public void setResponse72h(TreatmentResponse72hResult response72h) {
        this.response72h = response72h;
    }

    /**
     * Export complete report to pretty-printed JSON.
     */
    public String jsonExport() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            return mapper.writeValueAsString(this);
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }

    /**
     * Export complete report to Markdown format.
     */
    public String toMarkdownReport() {
        StringBuilder sb = new StringBuilder();
        sb.append("# BÁO CÁO HỖ TRỢ RA QUYẾT ĐỊNH LÂM SÀNG PECOMED CAP CDSS\n\n");

        if (patientCase != null) {
            sb.append("**Bệnh nhân:** ").append(patientCase.getFullName())
              .append(" | **Mã BN:** ").append(patientCase.getPatientId())
              .append(" | **Tuổi:** ").append(patientCase.getAge())
              .append(" | **Giới tính:** ").append(patientCase.getGender() != null ? patientCase.getGender().getDescription() : "N/A")
              .append("\n\n---\n\n");
        }

        // Step 1
        if (step1 != null) {
            sb.append("## BƯỚC 1: PHÂN LOẠI MỨC ĐỘ NẶNG & CHỈ ĐỊNH THƯỜNG QUY\n");
            sb.append("- **Nơi điều trị khuyến cáo:** `").append(step1.getRecommendedCareSetting() != null ? step1.getRecommendedCareSetting().getDescription() : "N/A").append("`\n");
            sb.append("- **Mức độ nặng:** `").append(step1.getSeverityLevel() != null ? step1.getSeverityLevel().getDescription() : "N/A").append("`\n");
            sb.append("- **Thang điểm CRB-65:** ").append(step1.getCrb65Score()).append(" điểm");
            if (step1.getCurb65Score() != null) {
                sb.append(" | **CURB-65:** ").append(step1.getCurb65Score()).append(" điểm");
            }
            sb.append("\n");
            sb.append("- **Thang điểm Fine / PSI:** ").append(step1.getPsiScore()).append(" điểm (").append(step1.getPsiClass()).append(")\n");
            sb.append("- **SMART-COP:** ").append(step1.getSmartCopScore()).append(" điểm (").append(step1.getSmartCopRisk()).append(")\n");
            sb.append("- **Tiêu chuẩn nặng ATS/IDSA:** Major = ").append(step1.getAtsMajorCount())
              .append(" | Minor = ").append(step1.getAtsMinorCount()).append("/9 (Viêm phổi nặng: ").append(step1.isAtsSevereCap()).append(")\n\n");

            if (!step1.getRoutineLabOrders().isEmpty()) {
                sb.append("### Chỉ định Cận lâm sàng Thường quy:\n");
                for (String order : step1.getRoutineLabOrders()) {
                    sb.append("- ").append(order).append("\n");
                }
                sb.append("\n");
            }
        }

        // Step 2
        if (step2 != null) {
            sb.append("## BƯỚC 2: DỰ ĐOÁN TÁC NHÂN VI SINH & XÉT NGHIỆM ĐẶC HIỆU\n");
            sb.append("- **Top tác nhân nghi ngờ:**\n");
            int count = 0;
            for (Pathogen p : step2.getTopPathogens()) {
                if (count++ >= 5) break;
                sb.append("  ").append(count).append(". **").append(p.getName()).append("** [").append(p.getVietnameseName()).append("] - Điểm: ").append(p.getScore());
                if (!p.getMatchedFactors().isEmpty()) {
                    sb.append(" (Yếu tố: ").append(String.join(", ", p.getMatchedFactors())).append(")");
                }
                sb.append("\n");
            }
            sb.append("- **Chỉ định CT ngực:** ").append(step2.isChestCtIndicated() ? "Có" : "Không").append("\n");
            if (!step2.getChestCtReasons().isEmpty()) {
                for (String reason : step2.getChestCtReasons()) {
                    sb.append("  * Lý do: ").append(reason).append("\n");
                }
            }
            sb.append("\n");
        }

        // Step 4
        if (step4 != null) {
            sb.append("## BƯỚC 4: ĐIỀU TRỊ KHÁNG SINH THEO KINH NGHIỆM (TUYẾN TỈNH)\n");
            sb.append("- **Phác đồ khuyến cáo:** `").append(step4.getRegimenName()).append("`\n");
            sb.append("- **Thuốc ưu tiên hàng đầu:**\n");
            for (AntibioticInfo d : step4.getPrimaryRegimen()) {
                sb.append("  * **").append(d.getName()).append("**: ").append(d.getDosage())
                  .append(" [").append(d.getRoute() != null ? d.getRoute().getDescription() : "").append("] - *")
                  .append(d.getRole()).append("*\n");
            }
            if (!step4.getAddOnRegimen().isEmpty()) {
                sb.append("- **Thuốc phối hợp bổ sung:**\n");
                for (AntibioticInfo d : step4.getAddOnRegimen()) {
                    sb.append("  * **").append(d.getName()).append("**: ").append(d.getDosage())
                      .append(" [").append(d.getRoute() != null ? d.getRoute().getDescription() : "").append("]\n");
                }
            }
            if (step4.getEarlyCorticosteroidRecommendation() != null) {
                sb.append("- **Corticoid sớm:** ").append(step4.getEarlyCorticosteroidRecommendation()).append("\n");
            }
            if (step4.getRespiratorySupportRecommendation() != null) {
                sb.append("- **Hỗ trợ hô hấp:** ").append(step4.getRespiratorySupportRecommendation()).append("\n");
            }
            sb.append("\n");
        }

        // Step 3
        if (step3 != null && !step3.getSuspectedConditions().isEmpty()) {
            sb.append("## BƯỚC 3: CHẨN ĐOÁN PHÂN BIỆT / LOẠI TRỪ\n");
            for (ExclusionCondition diff : step3.getSuspectedConditions()) {
                sb.append("- **").append(diff.getVietnameseName()).append("** (Mức độ nghi ngờ: `").append(diff.getConfidenceLevel()).append("`):\n");
                for (String c : diff.getMatchedTriggers()) {
                    sb.append("  * Dấu hiệu: ").append(c).append("\n");
                }
                for (String t : diff.getKeyDiagnosticTests()) {
                    sb.append("  * ").append(t).append("\n");
                }
            }
            sb.append("\n");
        }

        // Step 5
        if (step5 != null) {
            sb.append("## BƯỚC 5: ĐIỀU TRỊ ĐÍCH THEO KHÁNG SINH ĐỒ\n");
            sb.append("- **Tác nhân xác định:** `").append(step5.getPathogenName()).append("` (").append(step5.getConditionTitle()).append(")\n");
            sb.append("- **Kháng sinh tĩnh mạch đích:**\n");
            for (AntibioticInfo iv : step5.getIntravenousRegimen()) {
                sb.append("  * ").append(iv.getName()).append(": ").append(iv.getDosage()).append("\n");
            }
            if (!step5.getOralStepDownRegimen().isEmpty()) {
                sb.append("- **Kháng sinh đường uống chuyển tiếp:**\n");
                for (AntibioticInfo po : step5.getOralStepDownRegimen()) {
                    sb.append("  * ").append(po.getName()).append(": ").append(po.getDosage()).append("\n");
                }
            }
            sb.append("- **Thời gian điều trị khuyến cáo:** `").append(step5.getTreatmentDurationText()).append("`\n\n");
        }

        if (oralStepDown != null) {
            sb.append("### Đánh giá Chuyển Kháng sinh Đường uống:\n");
            sb.append("- **Kết luận:** `").append(oralStepDown.isEligible() ? "ĐỦ ĐIỀU KIỆN" : "CHƯA ĐỦ ĐIỀU KIỆN").append("` (Đạt ")
              .append(oralStepDown.getMetCriteriaCount()).append("/").append(oralStepDown.getTotalCriteriaCount()).append(" tiêu chuẩn)\n");
            for (String item : oralStepDown.getPassedCriteria()) {
                sb.append("  * [x] ").append(item).append("\n");
            }
            for (String item : oralStepDown.getFailedCriteria()) {
                sb.append("  * [ ] ").append(item).append("\n");
            }
            sb.append("\n");
        }

        if (response72h != null) {
            sb.append("### Theo dõi Đáp ứng Điều trị sau 72 giờ:\n");
            sb.append("- **Trạng thái:** `").append(response72h.getStatus()).append("`\n");
            if (!response72h.getFailureSignsDetected().isEmpty()) {
                sb.append("- **Cảnh báo:**\n");
                for (String warn : response72h.getFailureSignsDetected()) {
                    sb.append("  * ").append(warn).append("\n");
                }
            }
            if (response72h.getPctInterpretation() != null && !response72h.getPctInterpretation().isEmpty()) {
                sb.append("- **Động học PCT:** ").append(response72h.getPctInterpretation()).append("\n");
            }
            sb.append("\n");
        }

        return sb.toString();
    }
}
