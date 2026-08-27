package vn.pecomed.cdss.engine;

import vn.pecomed.cdss.model.enums.CareSetting;
import vn.pecomed.cdss.model.enums.Gender;
import vn.pecomed.cdss.model.enums.SeverityLevel;
import vn.pecomed.cdss.model.results.SeverityAssessmentResult;
import vn.pecomed.cdss.model.vitals.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Step 1: Severity Assessment & Preliminary Diagnosis Engine.
 * Implements CRB-65, CURB-65, PSI (Fine), SMART-COP, ATS/IDSA criteria, routine orders, and triage.
 */
public class Step1SeverityEngine {

    public static class ScoreDetail<T> {
        public final T score;
        public final List<String> details;

        public ScoreDetail(T score, List<String> details) {
            this.score = score;
            this.details = details;
        }
    }

    public static class PsiResult {
        public final int score;
        public final String psiClass;
        public final List<String> details;

        public PsiResult(int score, String psiClass, List<String> details) {
            this.score = score;
            this.psiClass = psiClass;
            this.details = details;
        }
    }

    public static class SmartCopResult {
        public final int score;
        public final String riskLevel;
        public final List<String> details;

        public SmartCopResult(int score, String riskLevel, List<String> details) {
            this.score = score;
            this.riskLevel = riskLevel;
            this.details = details;
        }
    }

    public static class AtsIdsaResult {
        public final int majorCount;
        public final List<String> majorCriteria;
        public final int minorCount;
        public final List<String> minorCriteria;
        public final boolean isSevereCap;

        public AtsIdsaResult(int majorCount, List<String> majorCriteria,
                             int minorCount, List<String> minorCriteria, boolean isSevereCap) {
            this.majorCount = majorCount;
            this.majorCriteria = majorCriteria;
            this.minorCount = minorCount;
            this.minorCriteria = minorCriteria;
            this.isSevereCap = isSevereCap;
        }
    }

    public ScoreDetail<Integer> calculateCrb65(int age, PatientVitals vitals) {
        if (vitals == null) vitals = new PatientVitals();
        int score = 0;
        List<String> details = new ArrayList<>();

        if (vitals.isAlteredMentalStatus()) {
            score += 1;
            details.add("C: Lú lẫn / Thay đổi tri giác (+1)");
        }
        if (vitals.getRespiratoryRate() >= 30) {
            score += 1;
            details.add("R: Nhịp thở >= 30 l/p (" + vitals.getRespiratoryRate() + " l/p) (+1)");
        }
        if (vitals.getSystolicBp() < 90 || vitals.getDiastolicBp() <= 60) {
            score += 1;
            details.add("B: Huyết áp tụt (HA: " + vitals.getSystolicBp() + "/" + vitals.getDiastolicBp() + " mmHg) (+1)");
        }
        if (age >= 65) {
            score += 1;
            details.add("65: Tuổi >= 65 (" + age + " tuổi) (+1)");
        }

        return new ScoreDetail<>(score, details);
    }

    public ScoreDetail<Integer> calculateCurb65(int age, PatientVitals vitals, PatientLabs labs) {
        if (vitals == null) vitals = new PatientVitals();
        boolean ureaElevated = false;
        String ureaStr = "";

        if (labs != null && labs.getUreaMmolL() != null) {
            if (labs.getUreaMmolL() > 7.0) {
                ureaElevated = true;
                ureaStr = "Ure máu > 7.0 mmol/L (" + labs.getUreaMmolL() + " mmol/L)";
            }
        } else if (labs != null && labs.getBunMgDl() != null) {
            if (labs.getBunMgDl() >= 20.0) {
                ureaElevated = true;
                ureaStr = "BUN >= 20 mg/dL (" + labs.getBunMgDl() + " mg/dL)";
            }
        } else {
            List<String> missing = new ArrayList<>();
            missing.add("Chưa có xét nghiệm Ure/BUN máu để tính CURB-65 đầy đủ (Sử dụng CRB-65 thay thế).");
            return new ScoreDetail<>(null, missing);
        }

        int score = 0;
        List<String> details = new ArrayList<>();

        if (vitals.isAlteredMentalStatus()) {
            score += 1;
            details.add("C: Lú lẫn / Thay đổi ý thức (+1)");
        }
        if (ureaElevated) {
            score += 1;
            details.add("U: " + ureaStr + " (+1)");
        }
        if (vitals.getRespiratoryRate() >= 30) {
            score += 1;
            details.add("R: Nhịp thở >= 30 l/p (" + vitals.getRespiratoryRate() + " l/p) (+1)");
        }
        if (vitals.getSystolicBp() < 90 || vitals.getDiastolicBp() <= 60) {
            score += 1;
            details.add("B: Huyết áp tụt (HA: " + vitals.getSystolicBp() + "/" + vitals.getDiastolicBp() + " mmHg) (+1)");
        }
        if (age >= 65) {
            score += 1;
            details.add("65: Tuổi >= 65 (" + age + " tuổi) (+1)");
        }

        return new ScoreDetail<>(score, details);
    }

    public PsiResult calculatePsi(int age, Gender gender, PatientComorbidities comorb,
                                  PatientVitals vitals, PatientLabs labs,
                                  PatientImagingAndIntervention imaging) {
        if (vitals == null) vitals = new PatientVitals();
        if (gender == null) gender = Gender.MALE;
        int score = 0;
        List<String> details = new ArrayList<>();

        // 1. Demographic factors
        if (gender == Gender.MALE) {
            score += age;
            details.add("Nam giới: +" + age + " điểm");
        } else {
            int fScore = Math.max(0, age - 10);
            score += fScore;
            details.add("Nữ giới (Tuổi - 10): +" + fScore + " điểm (" + age + "-10)");
        }

        if (comorb != null && comorb.isNursingHomeResident()) {
            score += 10;
            details.add("Nơi ở: Viện dưỡng lão / Nhà điều dưỡng (+10)");
        }

        // 2. Comorbid conditions
        if (comorb != null) {
            if (comorb.isNeoplasm()) {
                score += 30;
                details.add("Bệnh ác tính / Ung thư (+30)");
            }
            if (comorb.isLiverDisease()) {
                score += 20;
                details.add("Bệnh gan mạn tính (+20)");
            }
            if (comorb.isCongestiveHeartFailure()) {
                score += 10;
                details.add("Suy tim ứ huyết (+10)");
            }
            if (comorb.isCerebrovascularDisease()) {
                score += 10;
                details.add("Bệnh mạch máu não / Tai biến (+10)");
            }
            if (comorb.isRenalDisease()) {
                score += 10;
                details.add("Bệnh thận mạn tính (+10)");
            }
        }

        // 3. Physical examination findings
        if (vitals.isAlteredMentalStatus()) {
            score += 20;
            details.add("Thay đổi tri giác (+20)");
        }
        if (vitals.getRespiratoryRate() >= 30) {
            score += 20;
            details.add("Nhịp thở >= 30 l/p (" + vitals.getRespiratoryRate() + " l/p) (+20)");
        }
        if (vitals.getSystolicBp() < 90) {
            score += 20;
            details.add("Huyết áp tâm thu < 90 mmHg (" + vitals.getSystolicBp() + " mmHg) (+20)");
        }
        if (vitals.getTemperature() < 35.0 || vitals.getTemperature() >= 40.0) {
            score += 15;
            details.add("Thân nhiệt < 35°C hoặc >= 40°C (" + vitals.getTemperature() + "°C) (+15)");
        }
        if (vitals.getHeartRate() >= 125) {
            score += 10;
            details.add("Nhịp tim >= 125 l/p (" + vitals.getHeartRate() + " l/p) (+10)");
        }

        // 4. Lab and radiographic findings
        if (labs != null) {
            if (labs.getArterialPh() != null && labs.getArterialPh() < 7.35) {
                score += 30;
                details.add("pH máu động mạch < 7.35 (" + labs.getArterialPh() + ") (+30)");
            }
            boolean bunElevated = (labs.getBunMgDl() != null && labs.getBunMgDl() >= 30.0);
            boolean ureaElevated = (labs.getUreaMmolL() != null && labs.getUreaMmolL() >= 11.0);
            if (bunElevated) {
                score += 20;
                details.add("BUN >= 30 mg/dL (" + labs.getBunMgDl() + " mg/dL) (+20)");
            } else if (ureaElevated) {
                score += 20;
                details.add("Ure máu >= 11 mmol/L (" + labs.getUreaMmolL() + " mmol/L) (+20)");
            }
            if (labs.getSodiumMmolL() != null && labs.getSodiumMmolL() < 130.0) {
                score += 20;
                details.add("Natri máu < 130 mmol/L (" + labs.getSodiumMmolL() + " mmol/L) (+20)");
            }
            if (labs.getGlucoseMmolL() != null && labs.getGlucoseMmolL() >= 14.0) {
                score += 10;
                details.add("Đường máu >= 14 mmol/L (" + labs.getGlucoseMmolL() + " mmol/L) (+10)");
            }
            if (labs.getHematocritPct() != null && labs.getHematocritPct() < 30.0) {
                score += 10;
                details.add("Hematocrit < 30% (" + labs.getHematocritPct() + "%) (+10)");
            }
            if (labs.getPao2Mmhg() != null && labs.getPao2Mmhg() < 60.0) {
                score += 10;
                details.add("PaO2 < 60 mmHg (" + labs.getPao2Mmhg() + " mmHg) (+10)");
            } else if (vitals.getSpo2() < 90.0) {
                score += 10;
                details.add("SpO2 < 90% (" + vitals.getSpo2() + "%) (+10)");
            }
        } else if (vitals.getSpo2() < 90.0) {
            score += 10;
            details.add("SpO2 < 90% (" + vitals.getSpo2() + "%) (+10)");
        }

        if (imaging != null && imaging.isPleuralEffusion()) {
            score += 10;
            details.add("Tràn dịch màng phổi trên X-quang/Siêu âm (+10)");
        }

        // Stratification (Class I vs II boundary)
        String psiClass;
        boolean hasComorb = comorb != null && (comorb.isNeoplasm() || comorb.isLiverDisease() ||
                comorb.isCongestiveHeartFailure() || comorb.isCerebrovascularDisease() || comorb.isRenalDisease() || comorb.isNursingHomeResident());

        boolean hasAbnormalVitals = vitals.isAlteredMentalStatus() || vitals.getRespiratoryRate() >= 30
                || vitals.getSystolicBp() < 90 || vitals.getTemperature() < 35.0 || vitals.getTemperature() >= 40.0
                || vitals.getHeartRate() >= 125;

        boolean hasLabOrImaging = (imaging != null && imaging.isPleuralEffusion()) ||
                (labs != null && (
                        (labs.getArterialPh() != null && labs.getArterialPh() < 7.35) ||
                        (labs.getBunMgDl() != null && labs.getBunMgDl() >= 30.0) ||
                        (labs.getUreaMmolL() != null && labs.getUreaMmolL() >= 11.0) ||
                        (labs.getSodiumMmolL() != null && labs.getSodiumMmolL() < 130.0) ||
                        (labs.getGlucoseMmolL() != null && labs.getGlucoseMmolL() >= 14.0) ||
                        (labs.getHematocritPct() != null && labs.getHematocritPct() < 30.0) ||
                        (labs.getPao2Mmhg() != null && labs.getPao2Mmhg() < 60.0)
                )) || vitals.getSpo2() < 90.0;

        if (age <= 50 && !hasComorb && !hasAbnormalVitals && !hasLabOrImaging && score <= 50) {
            psiClass = "Tầng I (Class I - Rất nhẹ, tỉ lệ tử vong 0.1-0.4%)";
        } else if (score <= 70) {
            psiClass = "Tầng II (Class II - Nhẹ, <=70 điểm, tỉ lệ tử vong 0.6-0.7%)";
        } else if (score <= 90) {
            psiClass = "Tầng III (Class III - Trung bình nhẹ, 71-90 điểm, tỉ lệ tử vong 0.9-2.8%)";
        } else if (score <= 130) {
            psiClass = "Tầng IV (Class IV - Nặng, 91-130 điểm, tỉ lệ tử vong 8.2-9.3%)";
        } else {
            psiClass = "Tầng V (Class V - Rất nặng, >130 điểm, tỉ lệ tử vong 27-31%)";
        }

        return new PsiResult(score, psiClass, details);
    }

    public SmartCopResult calculateSmartCop(int age, PatientVitals vitals, PatientLabs labs,
                                            PatientImagingAndIntervention imaging) {
        if (vitals == null) vitals = new PatientVitals();
        int score = 0;
        List<String> details = new ArrayList<>();

        // S: SBP < 90 (2 pts)
        if (vitals.getSystolicBp() < 90) {
            score += 2;
            details.add("S: Huyết áp tâm thu < 90 mmHg (" + vitals.getSystolicBp() + " mmHg) (+2)");
        }

        // M: Multilobar (1 pt)
        if (imaging != null && imaging.isMultilobarInfiltrates()) {
            score += 1;
            details.add("M: Tổn thương nhiều thùy phổi trên X-quang (+1)");
        }

        // A: Albumin < 3.5 (1 pt)
        if (labs != null && labs.getAlbuminGDl() != null && labs.getAlbuminGDl() < 3.5) {
            score += 1;
            details.add("A: Albumin < 3.5 g/dL (" + labs.getAlbuminGDl() + " g/dL) (+1)");
        }

        // R: Respiratory Rate (1 pt)
        if ((age <= 50 && vitals.getRespiratoryRate() >= 25) || (age > 50 && vitals.getRespiratoryRate() >= 30)) {
            score += 1;
            details.add("R: Tăng nhịp thở (" + vitals.getRespiratoryRate() + " l/p cho BN " + age + " tuổi) (+1)");
        }

        // T: Tachycardia (Pulse >= 125) (1 pt)
        if (vitals.getHeartRate() >= 125) {
            score += 1;
            details.add("T: Nhịp tim nhanh >= 125 l/p (" + vitals.getHeartRate() + " l/p) (+1)");
        }

        // C: Confusion (1 pt)
        if (vitals.isAlteredMentalStatus()) {
            score += 1;
            details.add("C: Lú lẫn / Thay đổi ý thức (+1)");
        }

        // O: Oxygenation low (2 pts)
        boolean oxyLow = false;
        String oxyDesc = "";
        if (age <= 50) {
            if ((labs != null && labs.getPao2Mmhg() != null && labs.getPao2Mmhg() < 70) ||
                vitals.getSpo2() <= 93 ||
                (labs != null && labs.getPao2Fio2Ratio() != null && labs.getPao2Fio2Ratio() < 333)) {
                oxyLow = true;
                oxyDesc = "Giảm oxy máu ở BN <=50 tuổi (SpO2: " + vitals.getSpo2() + "%)";
            }
        } else {
            if ((labs != null && labs.getPao2Mmhg() != null && labs.getPao2Mmhg() < 60) ||
                vitals.getSpo2() <= 90 ||
                (labs != null && labs.getPao2Fio2Ratio() != null && labs.getPao2Fio2Ratio() < 250)) {
                oxyLow = true;
                oxyDesc = "Giảm oxy máu ở BN >50 tuổi (SpO2: " + vitals.getSpo2() + "%)";
            }
        }

        if (oxyLow) {
            score += 2;
            details.add("O: " + oxyDesc + " (+2)");
        }

        // P: Arterial pH < 7.35 (2 pts)
        if (labs != null && labs.getArterialPh() != null && labs.getArterialPh() < 7.35) {
            score += 2;
            details.add("P: Nhiễm toan máu động mạch pH < 7.35 (" + labs.getArterialPh() + ") (+2)");
        }

        String riskLevel;
        if (score <= 2) {
            riskLevel = "Nguy cơ thấp cần hỗ trợ hô hấp / vận mạch (Low risk of IRVS: ~4%)";
        } else if (score <= 4) {
            riskLevel = "Nguy cơ trung bình (Moderate risk of IRVS: ~12.5% - 1/8 BN cần can thiệp ICU)";
        } else if (score <= 6) {
            riskLevel = "Nguy cơ cao (High risk of IRVS: ~33% - 1/3 BN cần can thiệp ICU)";
        } else {
            riskLevel = "Nguy cơ rất cao (Very High risk of IRVS: ~67% - 2/3 BN cần thở máy / vận mạch)";
        }

        return new SmartCopResult(score, riskLevel, details);
    }

    public AtsIdsaResult evaluateAtsIdsa(PatientVitals vitals, PatientLabs labs,
                                         PatientImagingAndIntervention imaging) {
        if (vitals == null) vitals = new PatientVitals();
        List<String> majorMet = new ArrayList<>();
        if (imaging != null && imaging.isMechanicalVentilation()) {
            majorMet.add("Suy hô hấp cần thông khí cơ học xâm nhập (Đặt NKQ / thở máy)");
        }
        if (imaging != null && imaging.isSepticShockVasopressors()) {
            majorMet.add("Sốc nhiễm khuẩn đang phải dùng thuốc vận mạch (Noradrenaline, Dobutamin, Adrenaline...)");
        }

        List<String> minorMet = new ArrayList<>();
        if (vitals.getRespiratoryRate() >= 30) {
            minorMet.add("1. Tần số thở >= 30 l/p (" + vitals.getRespiratoryRate() + " l/p)");
        }
        if (labs != null && labs.getPao2Fio2Ratio() != null && labs.getPao2Fio2Ratio() <= 250) {
            minorMet.add("2. Tỉ lệ PaO2/FiO2 <= 250 (" + labs.getPao2Fio2Ratio() + ")");
        }
        if (imaging != null && imaging.isMultilobarInfiltrates()) {
            minorMet.add("3. Tổn thương thâm nhiễm nhiều thùy phổi trên X-quang");
        }
        if (vitals.isAlteredMentalStatus()) {
            minorMet.add("4. Lú lẫn / Thay đổi ý thức");
        }
        if (labs != null) {
            if (labs.getBunMgDl() != null && labs.getBunMgDl() >= 20.0) {
                minorMet.add("5. Tăng ure máu (BUN: " + labs.getBunMgDl() + " mg/dL)");
            } else if (labs.getUreaMmolL() != null && labs.getUreaMmolL() > 7.0) {
                minorMet.add("5. Tăng ure máu (Ure: " + labs.getUreaMmolL() + " mmol/L)");
            }
            if (labs.getWbcGL() != null && labs.getWbcGL() < 4.0) {
                minorMet.add("6. Giảm bạch cầu WBC < 4.0 G/L (" + labs.getWbcGL() + " G/L)");
            }
            if (labs.getPlateletsGL() != null && labs.getPlateletsGL() < 100.0) {
                minorMet.add("7. Giảm tiểu cầu PLT < 100 G/L (" + labs.getPlateletsGL() + " G/L)");
            }
        }
        if (vitals.getTemperature() < 36.0) {
            minorMet.add("8. Hạ thân nhiệt < 36.0°C (" + vitals.getTemperature() + "°C)");
        }
        if (vitals.getSystolicBp() < 90 || vitals.isOnAggressiveFluidResuscitation()) {
            minorMet.add("9. Tụt huyết áp cần bù dịch tích cực");
        }

        boolean isSevere = (!majorMet.isEmpty()) || (minorMet.size() >= 3);
        return new AtsIdsaResult(majorMet.size(), majorMet, minorMet.size(), minorMet, isSevere);
    }

    public List<String> generateRoutineLabOrders(PatientVitals vitals, PatientLabs labs,
                                                 PatientImagingAndIntervention imaging) {
        if (vitals == null) vitals = new PatientVitals();
        List<String> orders = new ArrayList<>();
        orders.add("1. Tổng phân tích tế bào máu ngoại vi (Công thức máu - CTM): đánh giá bạch cầu (WBC), đa nhân trung tính (NEU), tiểu cầu (PLT), Hematocrit.");
        orders.add("2. Hóa sinh máu cơ bản: Định lượng Ure máu, Creatinine máu & tính eGFR (đánh giá chức năng thận).");
        orders.add("3. Điện giải đồ (Na+, K+, Cl-): phát hiện hạ natri máu hoặc rối loạn điện giải.");
        orders.add("4. Đường huyết tĩnh mạch (Glucose máu): tầm soát tăng đường huyết / đái tháo đường.");
        orders.add("5. Men gan (AST, ALT): đánh giá tổn thương gan và hỗ trợ chọn liều kháng sinh.");
        orders.add("6. X-quang tim phổi thẳng (Chest X-ray): đánh giá vị trí tổn thương (1 thùy vs nhiều thùy, phế quản phế viêm, tràn dịch màng phổi).");
        orders.add("7. Dấu ấn sinh học nhiễm trùng: Định lượng Procalcitonin (PCT) hoặc CRP (đánh giá mức độ nhiễm khuẩn và theo dõi động học D0, D3, D5-D7).");

        if (vitals.getSpo2() < 92.0 || vitals.getRespiratoryRate() >= 24 || vitals.isAlteredMentalStatus()) {
            orders.add("8. Khí máu động mạch (ABG): Đánh giá PaO2, PaCO2, pH máu, tỉ lệ PaO2/FiO2 và tình trạng suy hô hấp cấp.");
        }

        if (imaging != null && imaging.isPleuralEffusion()) {
            orders.add("9. Siêu âm màng phổi & Chọc dò dịch màng phổi xét nghiệm: sinh hóa (Protein, LDH, Glucose), tế bào học, nhuộm Gram và nuôi cấy.");
        }

        return orders;
    }

    public List<String> synthesizeSyndromes(ClinicalSymptoms symptoms, PatientVitals vitals) {
        if (vitals == null) vitals = new PatientVitals();
        List<String> syndromes = new ArrayList<>();
        if (symptoms == null) return syndromes;

        if (symptoms.isToxicSyndrome() || vitals.getTemperature() >= 38.0 || vitals.getTemperature() < 36.0) {
            syndromes.add("Hội chứng nhiễm trùng / nhiễm độc: Sốt/hạ thân nhiệt, môi khô, lưỡi bẩn, hơi thở hôi.");
        }

        if (symptoms.isBronchialConsolidation()) {
            if (symptoms.getConsolidationSites() == 1) {
                syndromes.add("Hội chứng đông đặc phổi khu trú 1 vị trí: Gợi ý Viêm phổi thùy điển hình.");
            } else {
                syndromes.add("Hội chứng đông đặc phổi nhiều vị trí: Gợi ý Phế quản phế viêm (Bronchopneumonia).");
            }
        }

        if (symptoms.isPleuriticChestPain()) {
            syndromes.add("Đau ngực kiểu màng phổi: Gợi ý tổn thương sát màng phổi hoặc phản ứng màng phổi cận kề.");
        }

        if (symptoms.isCoughDry()) {
            syndromes.add("Ho khan kéo dài: Gợi ý tác nhân vi khuẩn không điển hình (Mycoplasma, Chlamydia) hoặc virus.");
        } else if (symptoms.isCoughProductive()) {
            syndromes.add("Ho khạc đờm: Gợi ý viêm phổi vi khuẩn điển hình (S. pneumoniae, H. influenzae, Klebsiella...).");
        }

        return syndromes;
    }

    public SeverityAssessmentResult evaluateStep1(int age, Gender gender, PatientVitals vitals,
                                                  PatientComorbidities comorbidities, PatientLabs labs,
                                                  PatientImagingAndIntervention imaging,
                                                  ClinicalSymptoms symptoms) {
        if (labs == null) labs = new PatientLabs();
        if (imaging == null) imaging = new PatientImagingAndIntervention();
        if (symptoms == null) symptoms = new ClinicalSymptoms();

        ScoreDetail<Integer> crb = calculateCrb65(age, vitals);
        ScoreDetail<Integer> curb = calculateCurb65(age, vitals, labs);
        PsiResult psi = calculatePsi(age, gender, comorbidities, vitals, labs, imaging);
        SmartCopResult smartCop = calculateSmartCop(age, vitals, labs, imaging);
        AtsIdsaResult ats = evaluateAtsIdsa(vitals, labs, imaging);

        CareSetting careSetting;
        SeverityLevel severity;
        List<String> clinicalNotes = new ArrayList<>();

        if (ats.isSevereCap || (curb.score != null && curb.score >= 4) || psi.score > 130 || smartCop.score >= 7) {
            careSetting = CareSetting.ICU;
            severity = SeverityLevel.VERY_SEVERE;
            clinicalNotes.add("Chỉ định nhập viện Khoa Hồi sức tích cực (ICU) ngay lập tức do thỏa tiêu chuẩn viêm phổi nặng/nguy kịch.");
        } else if ((curb.score != null && curb.score == 3) || (psi.score >= 91 && psi.score <= 130) || crb.score >= 3 || smartCop.score >= 5) {
            careSetting = CareSetting.INPATIENT;
            severity = SeverityLevel.SEVERE;
            clinicalNotes.add("Chỉ định nhập viện điều trị nội trú tại Khoa Hô hấp / Nội tổng hợp.");
        } else if ((curb.score != null && curb.score == 2) || (psi.score >= 71 && psi.score <= 90) || (crb.score == 1 || crb.score == 2) || (smartCop.score >= 3 && smartCop.score <= 4)) {
            careSetting = CareSetting.SHORT_TERM_INPATIENT;
            severity = SeverityLevel.MODERATE;
            clinicalNotes.add("Chỉ định điều trị nội trú ngắn hạn hoặc theo dõi sát tại phòng lưu / khoa cấp cứu 24-48h.");
        } else {
            careSetting = CareSetting.OUTPATIENT;
            severity = SeverityLevel.MILD;
            clinicalNotes.add("Đủ điều kiện điều trị ngoại trú an toàn, hướng dẫn bệnh nhân tự theo dõi và tái khám sau 48-72 giờ.");
        }

        if (comorbidities != null && comorbidities.isImmunocompromised() && careSetting == CareSetting.OUTPATIENT) {
            careSetting = CareSetting.SHORT_TERM_INPATIENT;
            clinicalNotes.add("Lưu ý: Bệnh nhân suy giảm miễn dịch có nguy cơ diễn tiến nặng nhanh, cân nhắc nâng bậc điều trị nội trú ngắn hạn.");
        }

        List<String> routineOrders = generateRoutineLabOrders(vitals, labs, imaging);
        List<String> syndromeSummary = synthesizeSyndromes(symptoms, vitals);

        SeverityAssessmentResult res = new SeverityAssessmentResult();
        res.setCrb65Score(crb.score);
        res.setCrb65Details(crb.details);
        res.setCurb65Score(curb.score);
        res.setCurb65Details(curb.details);
        res.setPsiScore(psi.score);
        res.setPsiClass(psi.psiClass);
        res.setPsiDetails(psi.details);
        res.setSmartCopScore(smartCop.score);
        res.setSmartCopRisk(smartCop.riskLevel);
        res.setSmartCopDetails(smartCop.details);
        res.setAtsMajorCount(ats.majorCount);
        res.setAtsMajorCriteriaMet(ats.majorCriteria);
        res.setAtsMinorCount(ats.minorCount);
        res.setAtsMinorCriteriaMet(ats.minorCriteria);
        res.setAtsSevereCap(ats.isSevereCap);
        res.setRecommendedCareSetting(careSetting);
        res.setSeverityLevel(severity);
        res.setSyndromeSummary(syndromeSummary);
        res.setRoutineLabOrders(routineOrders);
        res.setClinicalNotes(clinicalNotes);

        return res;
    }

    public SeverityAssessmentResult evaluateStep1(int age, Gender gender, PatientVitals vitals, PatientComorbidities comorbidities) {
        return evaluateStep1(age, gender, vitals, comorbidities, null, null, null);
    }
}
