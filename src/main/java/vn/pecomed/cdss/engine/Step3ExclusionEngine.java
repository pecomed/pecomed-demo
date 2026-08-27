package vn.pecomed.cdss.engine;

import vn.pecomed.cdss.model.results.ExclusionAssessmentResult;
import vn.pecomed.cdss.model.results.ExclusionCondition;
import vn.pecomed.cdss.model.vitals.ExclusionRiskTriggers;

import java.util.ArrayList;
import java.util.List;

/**
 * Step 3: Exclusion & Differential Diagnosis Engine.
 * Evaluates 8 exclusion conditions when etiology is unknown or treatment is refractory.
 */
public class Step3ExclusionEngine {

    public ExclusionCondition evaluateTuberculosis(ExclusionRiskTriggers inputs) {
        if (inputs == null) return null;
        List<String> clues = new ArrayList<>();

        if (inputs.isChronicCoughGt2w()) clues.add("Ho khạc đờm kéo dài > 2 tuần");
        if (inputs.isHemoptysis()) clues.add("Ho ra máu / đờm lẫn máu");
        if (inputs.isAfternoonLowFeverNightSweats()) clues.add("Sốt nhẹ về chiều, đổ mồ hôi đêm");
        if (inputs.isUnexplainedWeightLoss()) clues.add("Gầy sút cân không rõ nguyên nhân");
        if (inputs.isTbContactHistory()) clues.add("Tiền sử tiếp xúc nguồn lây lao");
        if (inputs.isSystemicCorticosteroids()) clues.add("Dùng corticoid kéo dài (suy giảm miễn dịch qua trung gian tế bào)");
        if (inputs.isApicalCavityOrDecreasedBreathSounds()) clues.add("RRPN giảm hoặc tiếng thổi hang tại vùng đỉnh phổi");

        if (clues.isEmpty()) return null;

        String conf = (clues.size() >= 3 || (inputs.isTbContactHistory() && inputs.isHemoptysis()))
                ? "Cao (High)" : "Trung bình (Moderate)";

        List<String> tests = List.of(
                "1. Xét nghiệm đờm tìm AFB trực tiếp (nhuộm Ziehl-Neelsen) 3 mẫu liên tiếp.",
                "2. Xét nghiệm sinh học phân tử GeneXpert MTB/RIF (định danh vi khuẩn lao và kháng Rifampicin trong 2 giờ).",
                "3. Nuôi cấy tìm vi khuẩn lao trên môi trường lỏng tự động MGIT (Mycobacteria Growth Indicator Tube).",
                "4. Chụp X-quang phổi thẳng / Cắt lớp vi tính ngực (tìm tổn thương thâm nhiễm, nốt, xơ hang đặc biệt ở đỉnh phổi / phân thùy đỉnh thùy dưới)."
        );

        List<String> actions = List.of(
                "Cách ly hô hấp nếu nghi ngờ lao hoạt động.",
                "Chuyển khám chuyên khoa Lao & Bệnh phổi nếu GeneXpert hoặc AFB dương tính."
        );

        ExclusionCondition cond = new ExclusionCondition("TUBERCULOSIS", "Lao phổi (Pulmonary Tuberculosis)", "Pulmonary Tuberculosis");
        cond.setSuspected(true);
        cond.setConfidenceLevel(conf);
        cond.setMatchScore(clues.size());
        cond.setMatchedTriggers(clues);
        cond.setKeyDiagnosticTests(tests);
        cond.setRecommendedAction(actions);
        return cond;
    }

    public ExclusionCondition evaluatePulmonaryEmbolism(ExclusionRiskTriggers inputs) {
        if (inputs == null) return null;
        List<String> clues = new ArrayList<>();

        if (inputs.isSuddenSevereChestPain()) clues.add("Đau ngực dữ dội khởi phát đột ngột");
        if (inputs.isDyspneaWithShock()) clues.add("Khó thở cấp tính, tụt huyết áp hoặc dấu hiệu sốc không rõ nguyên nhân");
        if (inputs.isHemoptysis()) clues.add("Ho ra máu tươi");
        if (inputs.isLongTermImmobilizationOrDvt()) clues.add("Yếu tố nguy cơ thuyên tắc mạch: Hậu sản, phẫu thuật vùng chậu/gãy xương, nằm bất động lâu ngày, viêm tắc TM sâu chi dưới");
        if (inputs.isOralContraceptives()) clues.add("Dùng thuốc tránh thai chứa Estrogen kéo dài");
        if (inputs.isPleuriticFrictionRub()) clues.add("Tiếng cọ màng phổi (nhồi máu phổi ngoại vi)");

        if (clues.isEmpty()) return null;

        String conf = ((inputs.isSuddenSevereChestPain() || inputs.isDyspneaWithShock()) &&
                       (inputs.isLongTermImmobilizationOrDvt() || inputs.isOralContraceptives()))
                ? "Cao (High - Cấp cứu)" : "Cần loại trừ (Consideration)";

        List<String> tests = List.of(
                "1. Điện tâm đồ (ECG 12 chuyển đạo): Tìm dấu hiệu tâm phế cấp S1Q3T3 (S sâu ở D1, Q sâu ở D3, T âm ở D3), block nhánh phải mới xuất hiện, trục phải.",
                "2. Khí máu động mạch (ABG): Giảm oxy máu kèm giảm PaCO2 (PaO2 giảm và PaCO2 giảm do tăng thông khí bù trừ).",
                "3. Định lượng D-dimer huyết tương (có giá trị loại trừ cao nếu D-dimer âm tính ở nhóm nguy cơ thấp/vừa).",
                "4. Chụp cắt lớp vi tính mạch máu phổi có tiêm thuốc cản quang (CTPA): Tiêu chuẩn vàng phát hiện vị trí huyết khối làm tắc lòng động mạch phổi.",
                "5. Siêu âm Doppler mạch máu chi dưới: Phát hiện huyết khối tĩnh mạch sâu (DVT)."
        );

        List<String> actions = List.of(
                "Đánh giá thang điểm Wells / Geneva cải tiến.",
                "Nếu nguy cơ cao hoặc sốc: Hội chẩn Hồi sức tích cực / Tim mạch can thiệp khẩn cấp để xét chỉ định dùng thuốc tiêu sợi huyết (Thrombolysis) hoặc Anticoagulant (Heparin/LMWH)."
        );

        ExclusionCondition cond = new ExclusionCondition("PULMONARY_EMBOLISM", "Tắc động mạch phổi (Pulmonary Embolism - PE)", "Pulmonary Embolism (PE)");
        cond.setSuspected(true);
        cond.setConfidenceLevel(conf);
        cond.setMatchScore(clues.size());
        cond.setMatchedTriggers(clues);
        cond.setKeyDiagnosticTests(tests);
        cond.setRecommendedAction(actions);
        return cond;
    }

    public ExclusionCondition evaluateLungCancer(ExclusionRiskTriggers inputs) {
        if (inputs == null) return null;
        List<String> clues = new ArrayList<>();

        if (inputs.isSmokingHeavyHistory()) clues.add("Tiền sử hút thuốc lá nặng nhiều năm");
        if (inputs.isHemoptysis()) clues.add("Ho ra máu tái diễn");
        if (inputs.isUnexplainedWeightLoss()) clues.add("Gầy sút cân, suy kiệt");
        if (inputs.isChronicCoughGt2w()) clues.add("Ho khan hoặc ho đờm dai dẳng không đáp ứng kháng sinh");

        if (!inputs.isSmokingHeavyHistory() && !inputs.isUnexplainedWeightLoss() && !inputs.isHemoptysis()) {
            return null;
        }

        String conf = (inputs.isSmokingHeavyHistory() && inputs.isHemoptysis() && inputs.isUnexplainedWeightLoss())
                ? "Cao (High)" : "Trung bình (Moderate)";

        List<String> tests = List.of(
                "1. Chụp cắt lớp vi tính lồng ngực (Chest CT) có tiêm thuốc cản quang: Đánh giá khối u, hạch trung thất, tính chất xâm lấn hoặc nốt thả bóng (cannonball metastases).",
                "2. Nội soi phế quản ống mềm (Flexible Bronchoscopy): Quan sát tổn thương nội lòng phế quản, sinh thiết khối u, rửa phế quản chải tế bào.",
                "3. Sinh thiết xuyên thành ngực dưới hướng dẫn CT (TTNB) nếu khối u ở ngoại vi.",
                "4. Xét nghiệm mô bệnh học / Tế bào học đờm tìm tế bào ác tính."
        );

        List<String> actions = List.of(
                "Hội chẩn chuyên khoa Ung bướu / Hô hấp sau khi có kết quả mô bệnh học."
        );

        ExclusionCondition cond = new ExclusionCondition("LUNG_CANCER", "Ung thư phổi (Lung Cancer)", "Lung Cancer");
        cond.setSuspected(true);
        cond.setConfidenceLevel(conf);
        cond.setMatchScore(clues.size());
        cond.setMatchedTriggers(clues);
        cond.setKeyDiagnosticTests(tests);
        cond.setRecommendedAction(actions);
        return cond;
    }

    public ExclusionCondition evaluateInfectedBronchiectasis(ExclusionRiskTriggers inputs) {
        if (inputs == null) return null;
        List<String> clues = new ArrayList<>();

        if (inputs.isChronicPurulentSputum()) clues.add("Ho khạc đờm mủ kéo dài lượng nhiều, lắng 3 lớp");
        if (inputs.isHemoptysis()) clues.add("Ho ra máu tái phát nhiều đợt");
        if (inputs.isFixedCoarseCrackles()) clues.add("Nghe phổi có ran ẩm, ran nổ cố định một vùng qua nhiều đợt khám");

        if (clues.isEmpty()) return null;

        String conf = (inputs.isChronicPurulentSputum() && inputs.isFixedCoarseCrackles())
                ? "Cao (High)" : "Trung bình (Moderate)";

        List<String> tests = List.of(
                "1. Chụp cắt lớp vi tính độ phân giải cao lồng ngực lớp mỏng 1mm (HRCT 1mm): Tiêu chuẩn vàng xác định hình ảnh giãn phế quản (dấu hiệu nhẫn kim cương, đường ray xe lửa, chùm nho).",
                "2. Cấy đờm tìm trực khuẩn mủ xanh (Pseudomonas aeruginosa) hoặc vi khuẩn không điển hình (NTM)."
        );

        List<String> actions = List.of(
                "Vật lý trị liệu lồng ngực, dẫn lưu tư thế kết hợp kháng sinh phổ diệt trực khuẩn mủ xanh nếu đợt cấp."
        );

        ExclusionCondition cond = new ExclusionCondition("INFECTED_BRONCHIECTASIS", "Giãn phế quản bội nhiễm (Infected Bronchiectasis)", "Infected Bronchiectasis");
        cond.setSuspected(true);
        cond.setConfidenceLevel(conf);
        cond.setMatchScore(clues.size());
        cond.setMatchedTriggers(clues);
        cond.setKeyDiagnosticTests(tests);
        cond.setRecommendedAction(actions);
        return cond;
    }

    public ExclusionCondition evaluateDrugInducedPneumonitis(ExclusionRiskTriggers inputs) {
        if (inputs == null) return null;
        List<String> clues = new ArrayList<>();

        if (inputs.isAmiodarone()) clues.add("Đang sử dụng thuốc chống loạn nhịp Amiodarone");
        if (inputs.isSystemicCorticosteroids()) clues.add("Tiền sử dùng thuốc ức chế miễn dịch");

        if (!inputs.isAmiodarone()) return null;

        String conf = inputs.isAmiodarone() ? "Cao (High)" : "Cần loại trừ (Consideration)";

        List<String> tests = List.of(
                "1. Chụp cắt lớp vi tính độ phân giải cao (HRCT): Tìm tổn thương thâm nhiễm kẽ, kính mờ hoặc hình ảnh tăng đậm độ do tích tụ iod của Amiodarone.",
                "2. Thăm dò chức năng hô hấp (PFTs) & Đo độ khuếch tán khí qua màng phế nang mao mạch (DLCO): DLCO giảm >15-20% so với trước điều trị.",
                "3. Nội soi phế quản rửa phế quản phế nang (BAL) loại trừ căn nguyên nhiễm trùng."
        );

        List<String> actions = List.of(
                "Ngừng ngay thuốc nghi ngờ gây độc phổi (Amiodarone).",
                "Hội chẩn chuyên khoa Tim mạch & Hô hấp để chuyển sang thuốc chống loạn nhịp thay thế và cân nhắc liệu pháp Corticosteroid toàn thân."
        );

        ExclusionCondition cond = new ExclusionCondition("DRUG_INDUCED_PNEUMONITIS", "Viêm phổi cơ chế tự miễn do thuốc (Drug-induced Pneumonitis)", "Drug-induced Pneumonitis");
        cond.setSuspected(true);
        cond.setConfidenceLevel(conf);
        cond.setMatchScore(clues.size());
        cond.setMatchedTriggers(clues);
        cond.setKeyDiagnosticTests(tests);
        cond.setRecommendedAction(actions);
        return cond;
    }

    public ExclusionCondition evaluateSubacutePulmonaryEdema(ExclusionRiskTriggers inputs) {
        if (inputs == null) return null;
        List<String> clues = new ArrayList<>();

        if (inputs.isOrthopneaPnd()) clues.add("Khó thở khi nằm đầu bằng, khó thở kịch phát về đêm");
        if (inputs.isCongestiveHeartFailure()) clues.add("Tiền sử suy tim sung huyết");
        if (inputs.isDiuretics()) clues.add("Đang dùng hoặc mới thay đổi liều lượng/bỏ thuốc lợi tiểu");

        if (!inputs.isOrthopneaPnd() && !inputs.isCongestiveHeartFailure()) {
            return null;
        }

        String conf = (inputs.isOrthopneaPnd() && inputs.isCongestiveHeartFailure())
                ? "Cao (High)" : "Trung bình (Moderate)";

        List<String> tests = List.of(
                "1. Chụp lại phim X-quang ngực thẳng: Tìm hình ảnh đường Kerley A, B; tái phân bố tuần hoàn đỉnh phổi; hình ảnh cánh bướm mờ lan tỏa từ rốn phổi sang 2 bên; bóng tim to.",
                "2. Định lượng peptid lợi niệu NT-proBNP hoặc BNP huyết tương (tăng cao trong suy tim mất bù).",
                "3. Siêu âm tim qua thành ngực (TTE): Đánh giá phân suất tống máu thất trái (EF), áp lực đổ đầy thất trái (E/e'), áp lực ĐMP."
        );

        List<String> actions = List.of(
                "Điều chỉnh phác đồ suy tim: Tăng cường lợi tiểu quai (Furosemide IV), kiểm soát huyết áp và hạn chế dịch/muối."
        );

        ExclusionCondition cond = new ExclusionCondition("SUBACUTE_PULMONARY_EDEMA", "Phù phổi bán cấp không điển hình (Subacute Atypical Pulmonary Edema)", "Subacute Atypical Pulmonary Edema");
        cond.setSuspected(true);
        cond.setConfidenceLevel(conf);
        cond.setMatchScore(clues.size());
        cond.setMatchedTriggers(clues);
        cond.setKeyDiagnosticTests(tests);
        cond.setRecommendedAction(actions);
        return cond;
    }

    public ExclusionCondition evaluateAspirationPneumonia(ExclusionRiskTriggers inputs) {
        if (inputs == null) return null;
        List<String> clues = new ArrayList<>();

        if (inputs.isHighFeverProlonged12w()) clues.add("Sốt rất cao 39-40°C kéo dài 1-2 tuần lễ");
        if (inputs.isParoxysmalCoughChoking()) clues.add("Ho sặc sụa, có biến cố hít sặc thức ăn/dịch vị");
        if (inputs.isFoulSmellingSputum()) clues.add("Ho khạc đờm mủ có mùi thối khắm (đặc trưng kỵ khí)");
        if (inputs.isOilNasalDrops()) clues.add("Tiền sử dùng thuốc nhỏ mũi có tinh dầu kéo dài (Nguy cơ viêm phổi dầu - Lipoid Pneumonia)");

        if (clues.isEmpty()) return null;

        String conf = (inputs.isParoxysmalCoughChoking() || inputs.isFoulSmellingSputum() || inputs.isOilNasalDrops())
                ? "Cao (High)" : "Trung bình (Moderate)";

        List<String> tests = List.of(
                "1. Chụp X-quang phổi / Cắt lớp vi tính ngực: Tìm tổn thương mờ đều thùy dưới hoặc phân thùy sau thùy trên bên phải (vùng phổi thấp theo trọng lực).",
                "2. Cấy đờm / dịch hút phế quản tìm vi khuẩn kỵ khí và vi khuẩn Gram âm.",
                "3. Nếu nghi ngờ viêm phổi dầu (Lipoid): Nhuộm Sudan đờm hoặc dịch rửa phế nang tìm đại thực bào ứ đọng lipid."
        );

        List<String> actions = List.of(
                "Bổ sung kháng sinh bao phủ vi khuẩn kỵ khí (Ampicillin/Sulbactam, Clindamycin hoặc Metronidazole).",
                "Ngừng ngay các loại thuốc nhỏ mũi có chứa tinh dầu/dầu khoáng.",
                "Đánh giá chức năng nuốt và can thiệp dự phòng hít sặc (nâng cao đầu giường 30-45 độ, đặt sonde dạ dày nếu cần)."
        );

        ExclusionCondition cond = new ExclusionCondition("ASPIRATION_PNEUMONIA", "Viêm phổi do hít / Viêm phổi dầu (Aspiration / Lipoid Pneumonia)", "Aspiration / Lipoid Pneumonia");
        cond.setSuspected(true);
        cond.setConfidenceLevel(conf);
        cond.setMatchScore(clues.size());
        cond.setMatchedTriggers(clues);
        cond.setKeyDiagnosticTests(tests);
        cond.setRecommendedAction(actions);
        return cond;
    }

    public ExclusionCondition evaluateLoefflerSyndrome(ExclusionRiskTriggers inputs) {
        if (inputs == null) return null;
        List<String> clues = new ArrayList<>();

        if (inputs.isTransientWheezingDyspnea()) clues.add("Khó thở, ho, khò khè, sốt nhẹ diễn tiến trong thời gian ngắn");
        if (inputs.isAscarisOrParasiteInfection()) clues.add("Tiền sử hoặc đang nhiễm giun đũa (Ascaris lumbricoides) / ký sinh trùng");

        if (!inputs.isTransientWheezingDyspnea() && !inputs.isAscarisOrParasiteInfection()) {
            return null;
        }

        String conf = (inputs.isTransientWheezingDyspnea() && inputs.isAscarisOrParasiteInfection())
                ? "Cao (High)" : "Cần loại trừ (Consideration)";

        List<String> tests = List.of(
                "1. Tổng phân tích tế bào máu ngoại vi: Đánh giá tỉ lệ và số lượng tuyệt đối bạch cầu ái toan (Eosinophil > 500-1000 tế bào/uL).",
                "2. Soi đờm tìm bạch cầu ái toan hoặc tinh thể Charcot-Leyden.",
                "3. Soi phân tìm trứng giun đũa / ấu trùng ký sinh trùng.",
                "4. Chụp lại X-quang ngực sau 1 tuần: Tổn thương dạng nhiều dải mờ đa dạng di chuyển và tự biến mất sau 1-2 tuần."
        );

        List<String> actions = List.of(
                "Điều trị thuốc tẩy giun sán đường ruột (Albendazole 400mg hoặc Mebendazole 500mg liều duy nhất).",
                "Cân nhắc Corticosteroid ngắn ngày nếu triệu chứng hô hấp rầm rộ."
        );

        ExclusionCondition cond = new ExclusionCondition("LOEFFLER_SYNDROME", "Hội chứng Loeffler phổi (Loeffler's Syndrome / Eosinophilic Pneumonia)", "Loeffler's Syndrome");
        cond.setSuspected(true);
        cond.setConfidenceLevel(conf);
        cond.setMatchScore(clues.size());
        cond.setMatchedTriggers(clues);
        cond.setKeyDiagnosticTests(tests);
        cond.setRecommendedAction(actions);
        return cond;
    }

    public ExclusionAssessmentResult evaluateStep3(ExclusionRiskTriggers inputs, boolean isPathogenNegativeOrRefractory) {
        List<ExclusionCondition> suspected = new ArrayList<>();

        ExclusionCondition tb = evaluateTuberculosis(inputs);
        if (tb != null) suspected.add(tb);

        ExclusionCondition pe = evaluatePulmonaryEmbolism(inputs);
        if (pe != null) suspected.add(pe);

        ExclusionCondition ca = evaluateLungCancer(inputs);
        if (ca != null) suspected.add(ca);

        ExclusionCondition br = evaluateInfectedBronchiectasis(inputs);
        if (br != null) suspected.add(br);

        ExclusionCondition dr = evaluateDrugInducedPneumonitis(inputs);
        if (dr != null) suspected.add(dr);

        ExclusionCondition ed = evaluateSubacutePulmonaryEdema(inputs);
        if (ed != null) suspected.add(ed);

        ExclusionCondition as = evaluateAspirationPneumonia(inputs);
        if (as != null) suspected.add(as);

        ExclusionCondition lf = evaluateLoefflerSyndrome(inputs);
        if (lf != null) suspected.add(lf);

        List<String> urgentReferrals = new ArrayList<>();
        for (ExclusionCondition c : suspected) {
            if ("PULMONARY_EMBOLISM".equals(c.getId()) && c.getConfidenceLevel().contains("Cao")) {
                urgentReferrals.add("KHẨN CẤP: Nghi ngờ Tắc động mạch phổi cấp tính - Cần chụp CTPA và hội chẩn Tim mạch / Cấp cứu ngay!");
            } else if ("TUBERCULOSIS".equals(c.getId()) && c.getConfidenceLevel().contains("Cao")) {
                urgentReferrals.add("Cảnh báo Lao phổi: Thực hiện cách ly hô hấp và làm GeneXpert MTB khẩn cấp.");
            } else if ("DRUG_INDUCED_PNEUMONITIS".equals(c.getId())) {
                urgentReferrals.add("Cảnh báo thuốc: Ngừng ngay thuốc Amiodarone/thuốc nghi ngờ gây độc phổi.");
            }
        }

        String summary = !suspected.isEmpty()
                ? "Đã phát hiện " + suspected.size() + " bệnh lý chẩn đoán phân biệt cần loại trừ khi không tìm thấy căn nguyên vi sinh hoặc bệnh nhân không đáp ứng với phác đồ ban đầu."
                : "Không phát hiện dấu hiệu gợi ý rõ rệt của 8 nhóm bệnh lý loại trừ. Tiếp tục theo dõi đáp ứng điều trị và kiểm tra lại vi sinh.";

        ExclusionAssessmentResult res = new ExclusionAssessmentResult();
        res.setUnknownEtiology(isPathogenNegativeOrRefractory);
        res.setSummaryMessage(summary);
        res.setSuspectedConditions(suspected);
        res.setAllConditions(suspected);
        res.setUrgentRedFlags(urgentReferrals);

        return res;
    }

    public ExclusionAssessmentResult evaluateStep3(ExclusionRiskTriggers inputs) {
        return evaluateStep3(inputs, true);
    }
}
