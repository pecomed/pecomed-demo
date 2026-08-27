package vn.pecomed.cdss.engine;

import vn.pecomed.cdss.model.enums.AdminRoute;
import vn.pecomed.cdss.model.results.AntibioticInfo;
import vn.pecomed.cdss.model.results.OralStepDownResult;
import vn.pecomed.cdss.model.results.TargetedRegimenResult;
import vn.pecomed.cdss.model.results.TreatmentResponse72hResult;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Step 5: Targeted Definitive Therapy & Monitoring Engine based on Antibiogram.
 */
public class Step5TargetedEngine {

    public TargetedRegimenResult getSpneumoniaeRegimen(double micPenicillin) {
        String micDesc;
        List<AntibioticInfo> primaryIv = new ArrayList<>();
        List<AntibioticInfo> oral = new ArrayList<>();
        List<AntibioticInfo> alt = new ArrayList<>();
        String duration;
        int minDays, maxDays;
        List<String> notes = new ArrayList<>();

        if (micPenicillin <= 2.0) {
            micDesc = "Nhạy cảm với Penicillin (MIC Penicillin = " + micPenicillin + " mcg/mL <= 2.0 mcg/mL)";
            primaryIv.add(new AntibioticInfo("Penicillin G", "2 triệu UI (MIU) truyền tĩnh mạch mỗi 4 giờ", AdminRoute.IV, "Đầu tay", "Penicillin G", ""));
            primaryIv.add(new AntibioticInfo("Ceftriaxone", "1 - 2g truyền tĩnh mạch mỗi 24 giờ", AdminRoute.IV, "Lựa chọn thay thế", "Cephalosporin 3rd gen", ""));
            primaryIv.add(new AntibioticInfo("Cefotaxime", "2g truyền tĩnh mạch mỗi 8 giờ", AdminRoute.IV, "Lựa chọn thay thế", "Cephalosporin 3rd gen", ""));

            oral.add(new AntibioticInfo("Amoxicillin", "1g uống 3 lần/ngày (mỗi 8 giờ)", AdminRoute.ORAL, "Chuyển tiếp PO", "Aminopenicillin", ""));
            oral.add(new AntibioticInfo("Doxycycline", "100mg uống 2 lần/ngày", AdminRoute.ORAL, "Chuyển tiếp PO", "Tetracycline", ""));

            alt.add(new AntibioticInfo("Linezolid", "600mg uống/truyền TM mỗi 12 giờ", AdminRoute.IV, "Dị ứng / Thay thế", "Oxazolidinone", ""));
            alt.add(new AntibioticInfo("Clindamycin", "600mg truyền TM mỗi 8 giờ", AdminRoute.IV, "Dị ứng / Thay thế", "Lincosamide", ""));
            alt.add(new AntibioticInfo("Moxifloxacin / Levofloxacin", "Moxifloxacin 400mg hoặc Levofloxacin 750mg mỗi 24h", AdminRoute.IV, "Dị ứng / Thay thế", "Fluoroquinolone", ""));

            duration = "5 - 7 ngày (khi hết sốt >48h và đạt ổn định lâm sàng).";
            minDays = 5;
            maxDays = 7;
            notes.add("Phế cầu nhạy cảm Penicillin: Ưu tiên dùng Penicillin G liều chuẩn hoặc Amoxicillin đường uống.");
        } else if (micPenicillin < 8.0) {
            micDesc = "Đề kháng trung gian với Penicillin (2 < MIC Penicillin = " + micPenicillin + " < 8 mcg/mL)";
            primaryIv.add(new AntibioticInfo("Ceftaroline fosamil", "600mg truyền tĩnh mạch mỗi 12 giờ", AdminRoute.IV, "Đầu tay", "Cephalosporin 5th gen", ""));
            primaryIv.add(new AntibioticInfo("Levofloxacin", "750mg truyền tĩnh mạch mỗi 24 giờ", AdminRoute.IV, "Lựa chọn Quinolone", "Fluoroquinolone", ""));
            primaryIv.add(new AntibioticInfo("Moxifloxacin", "400mg truyền tĩnh mạch mỗi 24 giờ", AdminRoute.IV, "Lựa chọn Quinolone", "Fluoroquinolone", ""));

            oral.add(new AntibioticInfo("Levofloxacin / Moxifloxacin", "Levofloxacin 750mg hoặc Moxifloxacin 400mg uống mỗi 24h", AdminRoute.ORAL, "Chuyển tiếp PO", "Fluoroquinolone", ""));

            alt.add(new AntibioticInfo("Vancomycin", "15-20mg/kg truyền TM mỗi 8-12 giờ", AdminRoute.IV, "Thay thế", "Glycopeptide", ""));
            alt.add(new AntibioticInfo("Linezolid", "600mg truyền TM/uống mỗi 12 giờ", AdminRoute.IV, "Thay thế", "Oxazolidinone", ""));

            duration = "7 - 10 ngày.";
            minDays = 7;
            maxDays = 10;
            notes.add("Ceftaroline là Cephalosporin thế hệ 5 có ái lực cao với PBP2x của Phế cầu kháng Penicillin.");
            notes.add("Lưu ý: MIC 2.01 - 4.0 là vùng xám, có thể điều trị như nhóm nhạy cảm nhưng dùng Amoxicillin liều cao (2g mỗi 8h) hoặc Ceftriaxone (2g mỗi 12h).");
        } else {
            micDesc = "Kháng cao với Penicillin (MIC Penicillin = " + micPenicillin + " >= 8 mcg/mL)";
            primaryIv.add(new AntibioticInfo("Vancomycin", "15-20mg/kg truyền tĩnh mạch mỗi 8-12 giờ (duy trì Trough 15-20 mcg/mL)", AdminRoute.IV, "Đầu tay", "Glycopeptide", ""));
            primaryIv.add(new AntibioticInfo("Ceftaroline", "600mg truyền tĩnh mạch mỗi 12 giờ", AdminRoute.IV, "Lựa chọn phối hợp/thay thế", "Cephalosporin 5th gen", ""));

            oral.add(new AntibioticInfo("Linezolid", "600mg uống mỗi 12h (khi đủ điều kiện chuyển đường uống)", AdminRoute.ORAL, "Chuyển tiếp PO", "Oxazolidinone", ""));

            alt.add(new AntibioticInfo("Linezolid", "600mg truyền TM mỗi 12 giờ", AdminRoute.IV, "Thay thế", "Oxazolidinone", ""));
            alt.add(new AntibioticInfo("Moxifloxacin", "400mg truyền TM mỗi 24 giờ (nếu AST còn nhạy cảm)", AdminRoute.IV, "Thay thế", "Fluoroquinolone", ""));

            duration = "10 - 14 ngày.";
            minDays = 10;
            maxDays = 14;
            notes.add("Bắt buộc theo dõi nồng độ đáy Vancomycin trong máu và chức năng thận định kỳ.");
        }

        TargetedRegimenResult res = new TargetedRegimenResult();
        res.setPathogenId("S_PNEUMONIAE");
        res.setPathogenName("Streptococcus pneumoniae (Phế cầu)");
        res.setConditionKey("S_PNEUMONIAE_MIC");
        res.setConditionTitle(micDesc);
        res.setIntravenousRegimen(primaryIv);
        res.setOralStepDownRegimen(oral);
        res.setAlternativeAllergyRegimen(alt);
        res.setTreatmentDurationText(duration);
        res.setDurationDaysMin(minDays);
        res.setDurationDaysMax(maxDays);
        res.setClinicalMonitoringAdvice(notes);
        return res;
    }

    public TargetedRegimenResult getHinfluenzaeRegimen(boolean betaLactamasePositive) {
        String desc;
        List<AntibioticInfo> primaryIv = new ArrayList<>();
        List<AntibioticInfo> oral = new ArrayList<>();
        List<AntibioticInfo> alt = new ArrayList<>();

        if (!betaLactamasePositive) {
            desc = "Nhạy cảm với Ampicillin / Amoxicillin (Beta-lactamase âm tính)";
            primaryIv.add(new AntibioticInfo("Ampicillin", "2g truyền tĩnh mạch mỗi 6 giờ", AdminRoute.IV, "Đầu tay", "Aminopenicillin", ""));
            oral.add(new AntibioticInfo("Amoxicillin", "1000mg uống mỗi 8 giờ", AdminRoute.ORAL, "Chuyển tiếp PO", "Aminopenicillin", ""));
            oral.add(new AntibioticInfo("Amoxicillin / Acid Clavulanic", "875/125mg uống mỗi 8-12 giờ", AdminRoute.ORAL, "Chuyển tiếp PO", "Beta-lactam/BLI", ""));
        } else {
            desc = "Tiết men Beta-lactamase (Beta-lactamase dương tính)";
            primaryIv.add(new AntibioticInfo("Ceftriaxone", "1g truyền tĩnh mạch mỗi 12 giờ (hoặc 2g mỗi 24h)", AdminRoute.IV, "Đầu tay", "Cephalosporin 3rd gen", ""));
            primaryIv.add(new AntibioticInfo("Ampicillin / Sulbactam", "1.5 - 3g truyền tĩnh mạch mỗi 6 giờ", AdminRoute.IV, "Lựa chọn phối hợp", "Aminopenicillin + BLI", ""));

            oral.add(new AntibioticInfo("Amoxicillin / Acid Clavulanic", "875/125mg uống mỗi 8-12 giờ", AdminRoute.ORAL, "Chuyển tiếp PO", "Beta-lactam/BLI", ""));
            oral.add(new AntibioticInfo("Cefpodoxime / Cefditoren", "Cefpodoxime 200mg mỗi 12h HOẶC Cefditoren 400mg mỗi 12h", AdminRoute.ORAL, "Chuyển tiếp PO", "Oral Cephalosporin 3rd gen", ""));
        }

        alt.add(new AntibioticInfo("Cotrimoxazol (TMP-SMX)", "5-10mg/kg (theo TMP) truyền TM/uống mỗi 12 giờ", AdminRoute.IV, "Dị ứng / Thay thế", "Sulfonamide", ""));
        alt.add(new AntibioticInfo("Doxycycline", "100mg uống 2 lần/ngày", AdminRoute.ORAL, "Dị ứng / Thay thế", "Tetracycline", ""));
        alt.add(new AntibioticInfo("Azithromycin", "500mg ngày 1, sau đó 250mg/ngày x 4 ngày", AdminRoute.ORAL, "Dị ứng / Thay thế", "Macrolide", ""));
        alt.add(new AntibioticInfo("Ciprofloxacin", "400mg TM mỗi 12h (chuyển uống 500mg 2 lần/ngày)", AdminRoute.IV, "Dị ứng / Thay thế", "Fluoroquinolone", ""));
        alt.add(new AntibioticInfo("Levofloxacin", "750mg uống/TM mỗi 24 giờ", AdminRoute.IV, "Dị ứng / Thay thế", "Fluoroquinolone", ""));

        TargetedRegimenResult res = new TargetedRegimenResult();
        res.setPathogenId("H_INFLUENZAE");
        res.setPathogenName("Haemophilus influenzae / Moraxella catarrhalis");
        res.setConditionKey("H_INFLUENZAE");
        res.setConditionTitle(desc);
        res.setIntravenousRegimen(primaryIv);
        res.setOralStepDownRegimen(oral);
        res.setAlternativeAllergyRegimen(alt);
        res.setTreatmentDurationText("5 - 7 ngày.");
        res.setDurationDaysMin(5);
        res.setDurationDaysMax(7);
        res.setClinicalMonitoringAdvice(List.of("Tỉ lệ H. influenzae tiết Beta-lactamase tại Việt Nam rất cao; nếu chưa có kết quả men, ưu tiên dùng Amox/Clav hoặc Ceftriaxone."));
        return res;
    }

    public TargetedRegimenResult getSaureusRegimen(boolean isMrsa, boolean hasBacteremiaOrEndocarditis) {
        String desc;
        List<AntibioticInfo> primaryIv = new ArrayList<>();
        List<AntibioticInfo> oral = new ArrayList<>();
        List<AntibioticInfo> alt = new ArrayList<>();
        List<String> notes = new ArrayList<>();

        if (!isMrsa) {
            desc = "MSSA: Tụ cầu vàng nhạy cảm Methicillin (Oxacillin / Cefazolin S)";
            primaryIv.add(new AntibioticInfo("Oxacillin (hoặc Cloxacillin)", "2g truyền tĩnh mạch mỗi 4 giờ", AdminRoute.IV, "Đầu tay", "Antistaphylococcal Penicillin", ""));
            primaryIv.add(new AntibioticInfo("Cefazolin", "2g truyền tĩnh mạch mỗi 8 giờ", AdminRoute.IV, "Lựa chọn thay thế", "Cephalosporin 1st gen", ""));
            primaryIv.add(new AntibioticInfo("Oxacillin + Ceftaroline (ICU)", "Oxacillin 2g IV q4h phối hợp Ceftaroline 600mg IV mỗi 12h", AdminRoute.IV, "Trường hợp nặng / ICU", "Combination", ""));

            oral.add(new AntibioticInfo("Cefalexin", "500mg - 1000mg uống mỗi 6 giờ", AdminRoute.ORAL, "Chuyển tiếp PO", "Cephalosporin 1st gen", ""));
            oral.add(new AntibioticInfo("Amoxicillin / Acid Clavulanic", "875/125mg uống mỗi 8-12 giờ", AdminRoute.ORAL, "Chuyển tiếp PO", "Beta-lactam/BLI", ""));

            alt.add(new AntibioticInfo("Vancomycin", "15-20mg/kg IV mỗi 8-12h (nếu dị ứng nặng Beta-lactam)", AdminRoute.IV, "Dị ứng nặng", "Glycopeptide", ""));
            alt.add(new AntibioticInfo("Linezolid", "600mg IV/uống mỗi 12h", AdminRoute.IV, "Thay thế", "Oxazolidinone", ""));
            notes.add("Không dùng Vancomycin cho MSSA nếu không có chống chỉ định Beta-lactam vì Oxacillin/Cefazolin diệt khuẩn MSSA nhanh hơn và giảm tử vong.");
        } else {
            desc = "MRSA: Tụ cầu vàng kháng Methicillin";
            primaryIv.add(new AntibioticInfo("Vancomycin", "15-20mg/kg truyền tĩnh mạch mỗi 8-12 giờ (TDM Trough 15-20 mcg/mL)", AdminRoute.IV, "Đầu tay", "Glycopeptide", ""));
            primaryIv.add(new AntibioticInfo("Teicoplanin", "Liều tải 6mg/kg (hoặc 800mg) mỗi 12h x 3 liều, sau đó duy trì 6mg/kg mỗi 24h", AdminRoute.IV, "Lựa chọn thay thế", "Lipoglycopeptide", ""));
            primaryIv.add(new AntibioticInfo("Linezolid", "600mg truyền tĩnh mạch/uống mỗi 12 giờ", AdminRoute.IV, "Lựa chọn thay thế", "Oxazolidinone", ""));

            oral.add(new AntibioticInfo("Linezolid", "600mg uống mỗi 12 giờ", AdminRoute.ORAL, "Chuyển tiếp PO", "Oxazolidinone", ""));
            oral.add(new AntibioticInfo("TMP-SMX + Doxycycline", "Cotrimoxazol phối hợp Doxycycline (nếu AST nhạy cảm)", AdminRoute.ORAL, "Chuyển tiếp PO thay thế", "Combination", ""));

            alt.add(new AntibioticInfo("Ceftaroline fosamil", "600mg truyền TM mỗi 8 giờ (đặc biệt khi dị ứng hoặc MIC Vancomycin > 1.5 mcg/mL)", AdminRoute.IV, "Thay thế", "Cephalosporin 5th gen", ""));
            notes.add("Nếu cấy máu sau 48-72h vẫn dương tính hoặc sốt kéo dài: Làm siêu âm tim qua thực quản (TEE) tìm sùi nội tâm mạc.");
        }

        String dur;
        int minD, maxD;
        if (hasBacteremiaOrEndocarditis) {
            dur = "4 tuần (28 ngày) do có nhiễm khuẩn huyết / viêm nội tâm mạc / ổ di bệnh.";
            minD = 28;
            maxD = 28;
        } else {
            dur = "7 - 14 ngày (khi cấy máu âm tính sau 2-4 ngày, hết sốt >72h, không có thiết bị cấy ghép).";
            minD = 7;
            maxD = 14;
        }

        TargetedRegimenResult res = new TargetedRegimenResult();
        res.setPathogenId("S_AUREUS");
        res.setPathogenName("Staphylococcus aureus (Tụ cầu vàng)");
        res.setConditionKey(isMrsa ? "MRSA" : "MSSA");
        res.setConditionTitle(desc);
        res.setIntravenousRegimen(primaryIv);
        res.setOralStepDownRegimen(oral);
        res.setAlternativeAllergyRegimen(alt);
        res.setTreatmentDurationText(dur);
        res.setDurationDaysMin(minD);
        res.setDurationDaysMax(maxD);
        res.setClinicalMonitoringAdvice(notes);
        return res;
    }

    public TargetedRegimenResult getSaureusRegimen(boolean isMrsa) {
        return getSaureusRegimen(isMrsa, false);
    }

    public TargetedRegimenResult getAtypicalRegimen(String specificAgent, boolean isImmunocompromised) {
        String agentUpper = specificAgent != null ? specificAgent.toUpperCase() : "MYCOPLASMA";
        String desc;
        List<AntibioticInfo> primaryIv = new ArrayList<>();
        List<AntibioticInfo> oral = new ArrayList<>();
        List<AntibioticInfo> alt = new ArrayList<>();
        String dur;
        int minD, maxD;
        List<String> notes = new ArrayList<>();

        if (agentUpper.contains("LEGION")) {
            desc = "Legionella pneumophila (Bệnh Legionnaires)";
            primaryIv.add(new AntibioticInfo("Levofloxacin", "750mg truyền TM / uống mỗi 24 giờ", AdminRoute.IV, "Đầu tay", "Fluoroquinolone", ""));
            primaryIv.add(new AntibioticInfo("Azithromycin", "500mg truyền TM / uống mỗi 24 giờ", AdminRoute.IV, "Đầu tay", "Macrolide", ""));
            primaryIv.add(new AntibioticInfo("Moxifloxacin", "400mg truyền TM / uống mỗi 24 giờ", AdminRoute.IV, "Lựa chọn thay thế", "Fluoroquinolone", ""));

            oral.add(new AntibioticInfo("Levofloxacin / Azithromycin", "Levofloxacin 750mg uống mỗi 24h hoặc Azithromycin 500mg uống mỗi 24h", AdminRoute.ORAL, "Chuyển tiếp PO", "Quinolone/Macrolide", ""));
            alt.add(new AntibioticInfo("Doxycycline", "100mg uống/TM 2 lần/ngày (dành cho BN dị ứng Quinolone và Macrolide)", AdminRoute.ORAL, "Dị ứng", "Tetracycline", ""));

            if (isImmunocompromised) {
                dur = "14 - 21 ngày (ở bệnh nhân suy giảm miễn dịch).";
                minD = 14;
                maxD = 21;
            } else {
                dur = "7 - 10 ngày (người bình thường).";
                minD = 7;
                maxD = 10;
            }
            notes.add("Legionella là vi khuẩn nội bào bắt buộc: Các kháng sinh Beta-lactam hoàn toàn không có hiệu lực.");

        } else if (agentUpper.contains("CHLAMYD")) {
            desc = "Chlamydia pneumoniae";
            primaryIv.add(new AntibioticInfo("Doxycycline", "100mg uống/truyền TM 2 lần/ngày trong 14 ngày", AdminRoute.ORAL, "Đầu tay", "Tetracycline", ""));
            primaryIv.add(new AntibioticInfo("Azithromycin", "500mg ngày 1, sau đó 250mg/ngày x 4 ngày", AdminRoute.ORAL, "Lựa chọn thay thế", "Macrolide", ""));
            primaryIv.add(new AntibioticInfo("Clarithromycin", "500mg uống 2 lần/ngày trong 10 ngày", AdminRoute.ORAL, "Lựa chọn thay thế", "Macrolide", ""));

            oral.add(new AntibioticInfo("Doxycycline", "100mg uống 2 lần/ngày x 14 ngày", AdminRoute.ORAL, "Chuyển tiếp PO", "Tetracycline", ""));
            alt.add(new AntibioticInfo("Levofloxacin", "750mg uống/TM mỗi 24h trong 5-7 ngày", AdminRoute.IV, "Thay thế", "Fluoroquinolone", ""));

            dur = "10 - 14 ngày.";
            minD = 10;
            maxD = 14;
            notes.add("Thời gian điều trị Chlamydia tối thiểu 10-14 ngày để tránh tái phát.");

        } else {
            desc = "Mycoplasma pneumoniae";
            primaryIv.add(new AntibioticInfo("Doxycycline", "100mg uống/truyền TM 2 lần/ngày trong 7-10 ngày", AdminRoute.ORAL, "Đầu tay", "Tetracycline", ""));
            primaryIv.add(new AntibioticInfo("Minocycline", "200mg liều nạp, sau đó 100mg uống/TM 2 lần/ngày", AdminRoute.ORAL, "Lựa chọn thay thế", "Tetracycline", ""));
            primaryIv.add(new AntibioticInfo("Azithromycin", "500mg ngày 1, sau đó 250mg/ngày x 4 ngày", AdminRoute.ORAL, "Lựa chọn thay thế", "Macrolide", ""));

            oral.add(new AntibioticInfo("Doxycycline", "100mg uống 2 lần/ngày x 7-10 ngày", AdminRoute.ORAL, "Chuyển tiếp PO", "Tetracycline", ""));
            alt.add(new AntibioticInfo("Levofloxacin", "750mg uống/TM mỗi 24h x 5 ngày", AdminRoute.IV, "Thay thế", "Fluoroquinolone", ""));
            alt.add(new AntibioticInfo("Clarithromycin", "500mg uống 2 lần/ngày x 10 ngày", AdminRoute.ORAL, "Thay thế", "Macrolide", ""));

            dur = "7 - 10 ngày.";
            minD = 7;
            maxD = 10;
            notes.add("Tại châu Á có tỉ lệ Mycoplasma kháng Macrolide gia tăng; Doxycycline là lựa chọn hàng đầu cho người lớn.");
        }

        TargetedRegimenResult res = new TargetedRegimenResult();
        res.setPathogenId("ATYPICAL");
        res.setPathogenName("Vi khuẩn không điển hình (Mycoplasma / Chlamydia / Legionella)");
        res.setConditionKey(agentUpper);
        res.setConditionTitle(desc);
        res.setIntravenousRegimen(primaryIv);
        res.setOralStepDownRegimen(oral);
        res.setAlternativeAllergyRegimen(alt);
        res.setTreatmentDurationText(dur);
        res.setDurationDaysMin(minD);
        res.setDurationDaysMax(maxD);
        res.setClinicalMonitoringAdvice(notes);
        return res;
    }

    public TargetedRegimenResult getAtypicalRegimen(String specificAgent) {
        return getAtypicalRegimen(specificAgent, false);
    }

    public TargetedRegimenResult getKlebsiellaRegimen(boolean isEsblPositive, boolean isCarbapenemResistant) {
        String desc;
        List<AntibioticInfo> primaryIv = new ArrayList<>();
        List<AntibioticInfo> oral = new ArrayList<>();
        List<AntibioticInfo> alt = new ArrayList<>();
        String dur;
        int minD, maxD;
        List<String> notes = new ArrayList<>();

        if (!isEsblPositive) {
            desc = "Klebsiella pneumoniae nhạy cảm Cephalosporin (ESBL âm tính)";
            primaryIv.add(new AntibioticInfo("Ceftriaxone", "1g truyền TM mỗi 12 giờ (hoặc 2g mỗi 24h)", AdminRoute.IV, "Đầu tay", "Cephalosporin 3rd gen", ""));
            primaryIv.add(new AntibioticInfo("Piperacillin / Tazobactam", "3.375g - 4.5g truyền TM mỗi 6 giờ", AdminRoute.IV, "Lựa chọn thay thế", "Antipseudomonal Penicillin + BLI", ""));
            primaryIv.add(new AntibioticInfo("Ciprofloxacin / Levofloxacin", "Ciprofloxacin 400mg TM mỗi 12h / Levofloxacin 750mg TM mỗi 24h", AdminRoute.IV, "Quinolone", "Fluoroquinolone", ""));

            oral.add(new AntibioticInfo("Ciprofloxacin", "500mg uống mỗi 12 giờ", AdminRoute.ORAL, "Chuyển tiếp PO", "Fluoroquinolone", ""));
            oral.add(new AntibioticInfo("Levofloxacin", "750mg uống mỗi 24 giờ (hoặc 500mg mỗi 12h)", AdminRoute.ORAL, "Chuyển tiếp PO", "Fluoroquinolone", ""));
            oral.add(new AntibioticInfo("Cefpodoxime", "200mg mỗi 12h", AdminRoute.ORAL, "Chuyển tiếp PO", "Oral Cephalosporin", ""));

            alt.add(new AntibioticInfo("Cotrimoxazol (TMP-SMX)", "10mg/kg/ngày (theo TMP) truyền TM chia 2-3 lần", AdminRoute.IV, "Thay thế", "Sulfonamide", ""));
            alt.add(new AntibioticInfo("Amikacin", "15-20mg/kg truyền TM mỗi 24h", AdminRoute.IV, "Thay thế", "Aminoglycoside", ""));
            alt.add(new AntibioticInfo("Cefepime", "1-2g truyền TM mỗi 8h (truyền kéo dài)", AdminRoute.IV, "Thay thế", "Cephalosporin 4th gen", "Khi kháng Cephalosporin thế hệ 3 và Quinolone nhưng ESBL(-): Cefepim 1-2g truyền TM mỗi 8h (truyền kéo dài)."));

            dur = "7 - 10 ngày.";
            minD = 7;
            maxD = 10;
            notes.add("Nếu bệnh nhân có áp xe phổi hoặc viêm phổi hoại tử do Klebsiella, thời gian điều trị kéo dài 14-21 ngày.");
        } else if (!isCarbapenemResistant) {
            desc = "Klebsiella pneumoniae sinh men ESBL (ESBL dương tính, nhạy cảm Carbapenem)";
            primaryIv.add(new AntibioticInfo("Ertapenem", "1g truyền tĩnh mạch mỗi 24 giờ (tiện lợi cho nội trú thường)", AdminRoute.IV, "Đầu tay (Nội trú thường)", "Carbapenem (Group 1)", ""));
            primaryIv.add(new AntibioticInfo("Meropenem", "1g truyền tĩnh mạch mỗi 8 giờ (ICU / nhiễm trùng nặng dùng 2g mỗi 8h)", AdminRoute.IV, "Đầu tay (ICU)", "Carbapenem (Group 2)", ""));
            primaryIv.add(new AntibioticInfo("Imipenem / Cilastatin", "0.5g truyền tĩnh mạch mỗi 6 giờ (hoặc 1g mỗi 8h)", AdminRoute.IV, "Lựa chọn thay thế", "Carbapenem (Group 2)", ""));

            oral.add(new AntibioticInfo("Ciprofloxacin / TMP-SMX (nếu nhạy)", "Ciprofloxacin 750mg uống 2 lần/ngày HOẶC TMP-SMX 2 viên uống 2 lần/ngày", AdminRoute.ORAL, "Chuyển tiếp PO", "Quinolone / Sulfonamide", ""));

            alt.add(new AntibioticInfo("Cefepime (nếu MIC <= 2)", "2g truyền TM mỗi 8h (truyền kéo dài)", AdminRoute.IV, "Thay thế", "Cephalosporin 4th gen", ""));
            alt.add(new AntibioticInfo("Amikacin", "15-20mg/kg/ngày phối hợp Carbapenem", AdminRoute.IV, "Phối hợp", "Aminoglycoside", ""));

            dur = "10 - 14 ngày.";
            minD = 10;
            maxD = 14;
            notes.add("Carbapenem là thuốc lựa chọn chuẩn vàng cho vi khuẩn sinh ESBL; Ertapenem ưu tiên cho bệnh nhân không ở ICU.");
        } else {
            desc = "Klebsiella pneumoniae kháng Carbapenem (CRE / CRKP)";
            primaryIv.add(new AntibioticInfo("Ceftazidime / Avibactam", "2.5g truyền tĩnh mạch mỗi 8 giờ (trong 2 giờ)", AdminRoute.IV, "Đầu tay", "Cephalosporin + Novel BLI", ""));
            primaryIv.add(new AntibioticInfo("Meropenem / Vaborbactam", "4g (2g/2g) truyền TM mỗi 8 giờ trong 3h", AdminRoute.IV, "Lựa chọn thay thế", "Carbapenem + BLI", ""));
            primaryIv.add(new AntibioticInfo("Colistin (Polymyxin E)", "Liều nạp 9 triệu UI, sau đó 4.5 triệu UI mỗi 12h + Khí dung Colistin", AdminRoute.IV, "Lựa chọn phối hợp", "Polymyxin", ""));

            alt.add(new AntibioticInfo("Tigecycline", "Liều nạp 100mg, sau đó 50mg mỗi 12 giờ", AdminRoute.IV, "Thay thế", "Glycylcycline", ""));
            alt.add(new AntibioticInfo("Cefiderocol", "2g truyền tĩnh mạch mỗi 8 giờ", AdminRoute.IV, "Thay thế", "Siderophore Cephalosporin", ""));

            dur = "14 - 21 ngày.";
            minD = 14;
            maxD = 21;
            notes.add("Cần hội chẩn chuyên gia Vi sinh & Dược lâm sàng để phối hợp kháng sinh diệt khuẩn tối ưu.");
        }

        TargetedRegimenResult res = new TargetedRegimenResult();
        res.setPathogenId("KLEBSIELLA");
        res.setPathogenName("Klebsiella pneumoniae / Enterobacterales");
        res.setConditionKey(isCarbapenemResistant ? "CRE" : (isEsblPositive ? "ESBL_POS" : "ESBL_NEG"));
        res.setConditionTitle(desc);
        res.setIntravenousRegimen(primaryIv);
        res.setOralStepDownRegimen(oral);
        res.setAlternativeAllergyRegimen(alt);
        res.setTreatmentDurationText(dur);
        res.setDurationDaysMin(minD);
        res.setDurationDaysMax(maxD);
        res.setClinicalMonitoringAdvice(notes);
        return res;
    }

    public TargetedRegimenResult getPaeruginosaRegimen(boolean isResistantToCeftazidimeCefepime, boolean isCysticFibrosis) {
        String desc;
        List<AntibioticInfo> primaryIv = new ArrayList<>();
        List<AntibioticInfo> oral = new ArrayList<>();
        List<AntibioticInfo> alt = new ArrayList<>();
        List<String> notes = new ArrayList<>();
        String aerosol = null;

        if (!isResistantToCeftazidimeCefepime) {
            desc = "Pseudomonas aeruginosa nhạy cảm đa kháng sinh (Multi-sensitive)";
            primaryIv.add(new AntibioticInfo("Piperacillin / Tazobactam", "4.5g truyền tĩnh mạch liều nạp, sau đó 4.5g mỗi 6 giờ", AdminRoute.IV, "Đầu tay", "Antipseudomonal Penicillin + BLI", ""));
            primaryIv.add(new AntibioticInfo("Cefepime", "2g truyền tĩnh mạch mỗi 8-12 giờ", AdminRoute.IV, "Đầu tay", "Antipseudomonal Cephalosporin", ""));
            primaryIv.add(new AntibioticInfo("Meropenem", "1 - 2g truyền tĩnh mạch mỗi 8 giờ (truyền kéo dài 3 giờ)", AdminRoute.IV, "Lựa chọn Carbapenem", "Carbapenem", ""));
            primaryIv.add(new AntibioticInfo("Ceftazidime", "2g truyền tĩnh mạch mỗi 8 giờ", AdminRoute.IV, "Lựa chọn thay thế", "Cephalosporin 3rd gen", ""));

            oral.add(new AntibioticInfo("Ciprofloxacin", "750mg uống mỗi 12 giờ (hoặc 500mg 2 lần/ngày)", AdminRoute.ORAL, "Chuyển tiếp PO", "Fluoroquinolone", ""));
            oral.add(new AntibioticInfo("Levofloxacin", "750mg uống mỗi 24 giờ", AdminRoute.ORAL, "Chuyển tiếp PO", "Fluoroquinolone", ""));

            alt.add(new AntibioticInfo("Aztreonam", "2g truyền tĩnh mạch mỗi 6-8 giờ (dành cho BN dị ứng nặng Penicillin)", AdminRoute.IV, "Dị ứng Penicillin", "Monobactam", ""));
            alt.add(new AntibioticInfo("Imipenem / Cilastatin", "1g truyền tĩnh mạch mỗi 8 giờ", AdminRoute.IV, "Thay thế", "Carbapenem", ""));
            alt.add(new AntibioticInfo("Amikacin", "15-20mg/kg/ngày phối hợp", AdminRoute.IV, "Phối hợp", "Aminoglycoside", ""));
            notes.add("Nên cấy lại đờm/dịch hút sau 72 giờ điều trị kháng sinh để đánh giá vi khuẩn học.");
        } else {
            desc = "Pseudomonas aeruginosa kháng Ceftazidime / Cefepime (DDR / XDR)";
            primaryIv.add(new AntibioticInfo("Ceftazidime / Avibactam", "2.5g truyền tĩnh mạch mỗi 8 giờ", AdminRoute.IV, "Đầu tay", "Cephalosporin + BLI", ""));
            primaryIv.add(new AntibioticInfo("Meropenem + Amikacin", "Meropenem 2g truyền TM mỗi 8 giờ (truyền kéo dài 3h) phối hợp Amikacin", AdminRoute.IV, "Phối hợp diệt khuẩn", "Carbapenem + Aminoglycoside", ""));
            primaryIv.add(new AntibioticInfo("Ceftolozane / Tazobactam", "3g truyền tĩnh mạch (trong 1 giờ) mỗi 8 giờ", AdminRoute.IV, "Đầu tay thay thế", "Antipseudomonal Ceph + BLI", ""));

            alt.add(new AntibioticInfo("Imipenem / Cilastatin / Relebactam", "1.25g truyền tĩnh mạch mỗi 6 giờ", AdminRoute.IV, "Thay thế", "Carbapenem + Novel BLI", ""));
            alt.add(new AntibioticInfo("Colistin (Polymyxin E)", "Colistin truyền TM phối hợp Khí dung Colistin", AdminRoute.IV, "Thay thế", "Polymyxin", ""));
            notes.add("Ceftolozane/Tazobactam và Ceftazidime/Avibactam là vũ khí chủ lực đối với trực khuẩn mủ xanh đa kháng.");
        }

        if (isCysticFibrosis) {
            aerosol = "BỔ SUNG KHÍ DUNG CHO BN XƠ NANG: Tobramycin 300mg khí dung 2 lần/ngày HOẶC Colistin 1.5 - 2.25 MIU (50-75mg) khí dung 2 lần/ngày HOẶC Aztreonam 75mg khí dung 3 lần/ngày.";
        }

        TargetedRegimenResult res = new TargetedRegimenResult();
        res.setPathogenId("P_AERUGINOSA");
        res.setPathogenName("Pseudomonas aeruginosa (Trực khuẩn mủ xanh)");
        res.setConditionKey(isResistantToCeftazidimeCefepime ? "RESISTANT" : "SENSITIVE");
        res.setConditionTitle(desc);
        res.setIntravenousRegimen(primaryIv);
        res.setOralStepDownRegimen(oral);
        res.setAlternativeAllergyRegimen(alt);
        res.setTreatmentDurationText("10 - 14 ngày (nặng hoặc xơ nang: 14 - 21 ngày).");
        res.setDurationDaysMin(10);
        res.setDurationDaysMax(isCysticFibrosis ? 21 : 14);
        res.setAerosolProphylaxisRegimen(aerosol);
        res.setClinicalMonitoringAdvice(notes);
        return res;
    }

    public TargetedRegimenResult getWhitmoreRegimen(boolean isPregnant, boolean hasBacteremia, boolean multilobar,
                                                    boolean hasArthritisAbscess, boolean hasOsteomyelitis) {
        String desc = "Burkholderia pseudomallei (Giai đoạn tấn công IV + Giai đoạn duy trì uống)";
        List<AntibioticInfo> primaryIv = new ArrayList<>();
        List<AntibioticInfo> oral = new ArrayList<>();
        List<AntibioticInfo> alt = new ArrayList<>();
        List<String> notes = new ArrayList<>();

        if (!isPregnant) {
            primaryIv.add(new AntibioticInfo("Ceftazidime", "2g truyền tĩnh mạch mỗi 6 giờ", AdminRoute.IV, "Tấn công đầu tay", "Cephalosporin 3rd gen", ""));
            primaryIv.add(new AntibioticInfo("Meropenem", "1 - 2g truyền tĩnh mạch trong 3 giờ, lặp lại mỗi 8 giờ", AdminRoute.IV, "Tấn công nặng / ICU", "Carbapenem", ""));
            primaryIv.add(new AntibioticInfo("Cotrimoxazol (TMP-SMX)", "6-8 mg/kg/ngày (theo liều TMP) uống chia 2 lần/ngày (hoặc Doxycycline 100mg uống 2 lần/ngày)", AdminRoute.ORAL, "Phối hợp kèm theo", "Sulfonamide", ""));

            oral.add(new AntibioticInfo("Cotrimoxazol (TMP-SMX)", "6-8 mg/kg/ngày (tính theo liều TMP) uống chia 2 lần/ngày trong 3 - 6 tháng", AdminRoute.ORAL, "Duy trì tiệt căn", "Sulfonamide", ""));
            oral.add(new AntibioticInfo("Doxycycline", "100mg uống 2 lần/ngày trong 3 - 6 tháng", AdminRoute.ORAL, "Duy trì thay thế", "Tetracycline", ""));

            alt.add(new AntibioticInfo("Imipenem", "1g truyền TM mỗi 8 giờ", AdminRoute.IV, "Thay thế", "Carbapenem", ""));
            notes.add("Tuân thủ tuyệt đối giai đoạn duy trì bằng TMP-SMX đủ 3-6 tháng để phòng ngừa bệnh tái phát với tỉ lệ tử vong cao.");
        } else {
            primaryIv.add(new AntibioticInfo("Ceftazidime", "2g truyền TM mỗi 6h HOẶC Meropenem 1-2g truyền TM mỗi 8h", AdminRoute.IV, "Tấn công thai phụ", "Cephalosporin / Carbapenem", ""));
            primaryIv.add(new AntibioticInfo("Amoxicillin / Acid Clavulanic", "20mg/5mg/kg uống 3 lần/ngày", AdminRoute.ORAL, "Phối hợp", "Beta-lactam/BLI", ""));

            oral.add(new AntibioticInfo("Amoxicillin / Acid Clavulanic", "20mg/5mg/kg uống 3 lần/ngày trong 3 - 6 tháng", AdminRoute.ORAL, "Duy trì thai phụ", "Beta-lactam/BLI", ""));
            alt.add(new AntibioticInfo("Meropenem", "1-2g truyền TM mỗi 8h đơn trị liệu", AdminRoute.IV, "Thay thế", "Carbapenem", ""));
            notes.add("Chống chỉ định TMP-SMX (3 tháng đầu/cuối) và Doxycycline ở phụ nữ mang thai.");
        }

        String dur;
        int minD, maxD;
        if (hasOsteomyelitis) {
            dur = "Giai đoạn tấn công tĩnh mạch: 6 TUẦN (Viêm xương tủy), sau đó duy trì uống 6 tháng.";
            minD = 42;
            maxD = 42;
        } else if (hasArthritisAbscess) {
            dur = "Giai đoạn tấn công tĩnh mạch: 4 TUẦN (Viêm khớp / Áp xe đa ổ), sau đó duy trì uống 3-6 tháng.";
            minD = 28;
            maxD = 28;
        } else if (hasBacteremia) {
            if (multilobar) {
                dur = "Giai đoạn tấn công tĩnh mạch: 4 TUẦN (mờ nhiều thùy có nhiễm khuẩn huyết), sau đó duy trì uống 3-6 tháng.";
                minD = 28;
                maxD = 28;
            } else {
                dur = "Giai đoạn tấn công tĩnh mạch: 3 TUẦN (mờ 1 thùy có NKH), sau đó duy trì uống 3-6 tháng.";
                minD = 21;
                maxD = 21;
            }
        } else {
            if (multilobar) {
                dur = "Giai đoạn tấn công tĩnh mạch: 3 TUẦN (mờ nhiều thùy không NKH), sau đó duy trì uống 3-6 tháng.";
                minD = 21;
                maxD = 21;
            } else {
                dur = "Giai đoạn tấn công tĩnh mạch: 2 TUẦN (mờ 1 thùy không NKH), sau đó duy trì uống 3-6 tháng.";
                minD = 14;
                maxD = 14;
            }
        }

        TargetedRegimenResult res = new TargetedRegimenResult();
        res.setPathogenId("B_PSEUDOMALLEI");
        res.setPathogenName("Burkholderia pseudomallei (Bệnh Whitmore / Melioidosis)");
        res.setConditionKey("MELIOIDOSIS");
        res.setConditionTitle(desc);
        res.setIntravenousRegimen(primaryIv);
        res.setOralStepDownRegimen(oral);
        res.setAlternativeAllergyRegimen(alt);
        res.setTreatmentDurationText(dur);
        res.setDurationDaysMin(minD);
        res.setDurationDaysMax(maxD);
        res.setClinicalMonitoringAdvice(notes);
        return res;
    }

    public TargetedRegimenResult getWhitmoreRegimen(boolean hasBacteremia, boolean multilobar) {
        return getWhitmoreRegimen(false, hasBacteremia, multilobar, false, false);
    }

    public TargetedRegimenResult getVirusRegimen(boolean isInpatient, boolean cannotSwallow, boolean crclGt60, boolean isSevereOrImmunocompromised) {
        String desc = "Virus cúm A/B (Influenza) hoặc virus hô hấp";
        List<AntibioticInfo> primaryIv = new ArrayList<>();
        List<AntibioticInfo> oral = new ArrayList<>();
        List<AntibioticInfo> alt = new ArrayList<>();
        List<String> notes = new ArrayList<>();
        String dur;
        int minD, maxD;

        if (!isInpatient) {
            oral.add(new AntibioticInfo("Oseltamivir (Tamiflu)", "75mg uống 2 lần/ngày trong 5 ngày", AdminRoute.ORAL, "Đầu tay", "Neuraminidase Inhibitor", ""));
            alt.add(new AntibioticInfo("Zanamivir (Relenza)", "Phun khí dung / Hít 10mg (2 lần xịt 5mg) 2 lần/ngày trong 5 ngày", AdminRoute.INHALED, "Thay thế", "Neuraminidase Inhibitor", ""));
            dur = "5 ngày.";
            minD = 5;
            maxD = 5;
            notes.add("Điều trị ngoại trú nên bắt đầu trong vòng 48 giờ kể từ khi khởi phát triệu chứng.");
        } else {
            if (cannotSwallow && crclGt60) {
                primaryIv.add(new AntibioticInfo("Peramivir", "600mg truyền tĩnh mạch 1 liều duy nhất (trong 15-30 phút)", AdminRoute.IV, "Tĩnh mạch đơn liều", "Neuraminidase Inhibitor", "Dành cho bệnh nhân không thể nuốt và CrCl > 60 mL/phút."));
            }
            oral.add(new AntibioticInfo("Oseltamivir (Tamiflu)", "75mg uống 2 lần/ngày (uống qua sonde nếu có)", AdminRoute.ORAL, "Đầu tay", "Neuraminidase Inhibitor", ""));

            if (isSevereOrImmunocompromised) {
                dur = "10 ngày (kéo dài thời gian dùng thuốc do bệnh cảnh nặng/nguy kịch hoặc suy giảm miễn dịch).";
                minD = 10;
                maxD = 10;
                notes.add("Tăng thời gian sử dụng Oseltamivir lên 10 ngày ở bệnh nhân nặng, nguy kịch hoặc suy giảm miễn dịch.");
            } else {
                dur = "5 ngày.";
                minD = 5;
                maxD = 5;
            }
        }

        TargetedRegimenResult res = new TargetedRegimenResult();
        res.setPathogenId("VIRUS");
        res.setPathogenName("Virus hô hấp (Influenza / SARS-CoV-2 / RSV...)");
        res.setConditionKey("RESPIRATORY_VIRUS");
        res.setConditionTitle(desc);
        res.setIntravenousRegimen(primaryIv);
        res.setOralStepDownRegimen(oral);
        res.setAlternativeAllergyRegimen(alt);
        res.setTreatmentDurationText(dur);
        res.setDurationDaysMin(minD);
        res.setDurationDaysMax(maxD);
        res.setClinicalMonitoringAdvice(notes);
        return res;
    }

    public TargetedRegimenResult getVirusRegimen(boolean isInpatient) {
        return getVirusRegimen(isInpatient, false, true, false);
    }

    public OralStepDownResult evaluateOralStepDown(double temp, int hr, int rr, int sbp, double spo2RoomAir,
                                                   boolean canEatAndSwallow, boolean normalMentalStatus) {
        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();
        Map<String, Boolean> details = new LinkedHashMap<>();

        if (temp <= 37.8) {
            passed.add("1. Thân nhiệt ổn định: " + temp + "°C (Tiêu chuẩn <= 37.8°C)");
            details.put("temperature", true);
        } else {
            failed.add("1. Thân nhiệt còn sốt: " + temp + "°C (Yêu cầu <= 37.8°C)");
            details.put("temperature", false);
        }

        if (hr <= 100) {
            passed.add("2. Nhịp tim ổn định: " + hr + " l/p (Tiêu chuẩn <= 100 l/p)");
            details.put("heartRate", true);
        } else {
            failed.add("2. Nhịp tim nhanh: " + hr + " l/p (Yêu cầu <= 100 l/p)");
            details.put("heartRate", false);
        }

        if (rr <= 24) {
            passed.add("3. Tần số thở ổn định: " + rr + " l/p (Tiêu chuẩn <= 24 l/p)");
            details.put("respiratoryRate", true);
        } else {
            failed.add("3. Còn thở nhanh: " + rr + " l/p (Yêu cầu <= 24 l/p)");
            details.put("respiratoryRate", false);
        }

        if (sbp >= 90) {
            passed.add("4. Huyết áp tâm thu đạt đích: " + sbp + " mmHg (Tiêu chuẩn >= 90 mmHg)");
            details.put("systolicBp", true);
        } else {
            failed.add("4. Huyết áp tâm thu thấp: " + sbp + " mmHg (Yêu cầu >= 90 mmHg)");
            details.put("systolicBp", false);
        }

        if (spo2RoomAir >= 90.0) {
            passed.add("5. Bão hòa oxy khí phòng đạt chuẩn: " + spo2RoomAir + "% (Tiêu chuẩn >= 90%)");
            details.put("spo2RoomAir", true);
        } else {
            failed.add("5. Thiếu oxy ở khí phòng: SpO2 " + spo2RoomAir + "% (Yêu cầu >= 90%)");
            details.put("spo2RoomAir", false);
        }

        if (canEatAndSwallow) {
            passed.add("6. Khả năng dung nạp đường miệng tốt (uống được thuốc)");
            details.put("canEatAndSwallow", true);
        } else {
            failed.add("6. Không thể uống được hoặc nôn/rối loạn nuốt");
            details.put("canEatAndSwallow", false);
        }

        if (normalMentalStatus) {
            passed.add("7. Tri giác và trạng thái tâm thần bình thường");
            details.put("normalMentalStatus", true);
        } else {
            failed.add("7. Còn lú lẫn / thay đổi tri giác");
            details.put("normalMentalStatus", false);
        }

        boolean isEligible = failed.isEmpty();
        String advice = isEligible
                ? "Bệnh nhân đạt đủ 7/7 tiêu chuẩn ổn định lâm sàng -> Khuyến cáo chuyển từ kháng sinh tiêm truyền tĩnh mạch (IV) sang đường uống (PO) và chuẩn bị kế hoạch xuất viện an toàn."
                : "Bệnh nhân chưa đạt đủ 7 tiêu chuẩn ổn định lâm sàng (" + passed.size() + "/7 đạt) -> Tiếp tục duy trì kháng sinh đường tĩnh mạch và theo dõi sát các tiêu chí chưa đạt.";

        OralStepDownResult res = new OralStepDownResult();
        res.setEligible(isEligible);
        res.setMetCriteriaCount(passed.size());
        res.setTotalCriteriaCount(7);
        res.setChecklistDetails(details);
        res.setPassedCriteria(passed);
        res.setFailedCriteria(failed);
        res.setClinicalAdvice(advice);
        return res;
    }

    public TreatmentResponse72hResult evaluate72hResponse(boolean hrGt125OrRrGt33, boolean bpLt9060,
                                                          boolean imagingWorsening, boolean atsScoreIncreased,
                                                          boolean respFailureWorsening,
                                                          Double pctD0, Double pctD3, Double pctD5D7) {
        List<String> warnings = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        if (hrGt125OrRrGt33) {
            warnings.add("Nhịp tim > 125 l/p hoặc nhịp thở > 33 l/p (suy hô hấp / sốc tiến triển).");
        }
        if (bpLt9060) {
            warnings.add("Huyết áp tụt < 90/60 mmHg (nguy cơ sốc nhiễm khuẩn).");
        }
        if (imagingWorsening) {
            warnings.add("Hình ảnh học tổn thương lan rộng >50% hoặc xuất hiện ổ tổn thương mới.");
        }
        if (atsScoreIncreased) {
            warnings.add("Tăng số lượng tiêu chuẩn nặng của ATS/IDSA.");
        }
        if (respFailureWorsening) {
            warnings.add("Suy giảm chức năng hô hấp: PaO2 < 60 mmHg hoặc SpO2 < 90% ở khí phòng.");
        }

        String pctStatus = "Chưa đủ dữ liệu PCT động học.";
        if (pctD0 != null && pctD3 != null) {
            double pctDrop = pctD0 > 0 ? (pctD0 - pctD3) / pctD0 : 0.0;
            if (pctDrop >= 0.8 || pctD3 < 0.25) {
                pctStatus = String.format("Động học PCT thuận lợi: Giảm %.1f%% sau 72h (PCT D3: %.2f ng/mL) -> Đáp ứng kháng sinh tốt.", (pctDrop * 100.0), pctD3);
                recommendations.add("Xem xét ngừng kháng sinh sớm hoặc chuyển sang đường uống nếu lâm sàng ổn định.");
            } else if (pctD3 < pctD0) {
                pctStatus = String.format("Động học PCT giảm một phần: Giảm %.1f%% sau 72h (D0: %.2f -> D3: %.2f ng/mL) -> Tiếp tục theo dõi động học D5-D7.", (pctDrop * 100.0), pctD0, pctD3);
                recommendations.add("Tiếp tục duy trì phác đồ hiện tại và đánh giá lại PCT sau 5-7 ngày.");
            } else {
                pctStatus = String.format("CẢNH BÁO: Động học PCT không giảm hoặc tăng (D0: %.2f -> D3: %.2f ng/mL) -> Thất bại điều trị / Ổ nhiễm trùng chưa kiểm soát.", pctD0, pctD3);
                warnings.add("PCT không giảm sau 72h: Nghi ngờ vi khuẩn kháng thuốc, biến chứng áp xe/mủ màng phổi hoặc chẩn đoán sai.");
                recommendations.add("Đổi phác đồ kháng sinh phổ rộng hơn, cấy vi sinh lại và kích hoạt Bước 3 (Chẩn đoán loại trừ PE, Lao, K phổi).");
            }
        }

        boolean isFailure = !warnings.isEmpty();
        String status = isFailure ? "Thất bại điều trị sau 72h (Treatment Failure)" : "Đáp ứng điều trị tốt sau 72h (Clinical Stability)";

        TreatmentResponse72hResult res = new TreatmentResponse72hResult();
        res.setTreatmentFailure(isFailure);
        res.setFailureSignsCount(warnings.size());
        res.setFailureSignsDetected(warnings);
        res.setPctInterpretation(pctStatus);
        res.setRecommendedActions(recommendations);
        res.setStatus(status);
        return res;
    }
}
