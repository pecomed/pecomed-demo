package vn.pecomed.cdss.engine;

import vn.pecomed.cdss.model.enums.AdminRoute;
import vn.pecomed.cdss.model.enums.CareSetting;
import vn.pecomed.cdss.model.results.AntibioticInfo;
import vn.pecomed.cdss.model.results.EmpiricalRegimenResult;

import java.util.ArrayList;
import java.util.List;

/**
 * Step 4: Empirical Antibiotic Therapy Engine for Provincial Level Hospital (Tuyến Tỉnh).
 * Formulates empirical antibiotic combinations, early corticosteroid therapy, and respiratory support.
 */
public class Step4EmpiricalEngine {

    public static class Step4InputData {
        public CareSetting careSetting;
        public int age;
        public boolean hasComorbidities;
        public boolean antibioticsInPast3m;
        public boolean suspectPseudomonas = false;
        public boolean suspectMrsa = false;
        public boolean viralTestPositive = false;
        public boolean viralTestNegative = false;
        public double spo2 = 98.0;
        public boolean within24hIcu = true;
        public boolean hasPenicillinAllergy = false;

        public Step4InputData(CareSetting careSetting, int age, boolean hasComorbidities, boolean antibioticsInPast3m) {
            this.careSetting = careSetting;
            this.age = age;
            this.hasComorbidities = hasComorbidities;
            this.antibioticsInPast3m = antibioticsInPast3m;
        }

        public Step4InputData() {
        }
    }

    public EmpiricalRegimenResult generateOutpatientRegimen(Step4InputData inputs) {
        boolean isGroup2 = (inputs.age >= 65 || inputs.hasComorbidities || inputs.antibioticsInPast3m);

        List<AntibioticInfo> primary = new ArrayList<>();
        List<AntibioticInfo> alternative = new ArrayList<>();
        List<AntibioticInfo> addOns = new ArrayList<>();
        List<AntibioticInfo> stepDown = new ArrayList<>();
        List<String> monitoring = List.of(
                "Đánh giá lại lâm sàng sau 48-72 giờ (sốt, ho, khó thở, khả năng ăn uống).",
                "Hướng dẫn bệnh nhân tái khám ngay nếu có dấu hiệu cảnh báo: Sốt cao liên tục, khó thở tăng, lú lẫn, nôn không uống được."
        );

        String target;
        String regimenTitle;

        if (!isGroup2) {
            target = "Ngoại trú Nhóm 1 (< 65 tuổi, không có bệnh đồng mắc, không dùng kháng sinh trong 3 tháng qua)";
            regimenTitle = "Phác đồ Ngoại trú Nhóm 1 (Liệu pháp đơn trị ưu tiên)";

            primary.add(new AntibioticInfo(
                    "Amoxicillin",
                    "1g uống mỗi 8 giờ (3g/ngày)",
                    AdminRoute.ORAL,
                    "Lựa chọn ưu tiên hàng đầu",
                    "Aminopenicillin",
                    "Bao phủ tốt Phế cầu khuẩn (S. pneumoniae) nhạy cảm."
            ));
            primary.add(new AntibioticInfo(
                    "Doxycycline",
                    "100mg uống 2 lần/ngày",
                    AdminRoute.ORAL,
                    "Lựa chọn thay thế hàng đầu",
                    "Tetracycline",
                    "Bao phủ cả Phế cầu và vi khuẩn không điển hình (Mycoplasma, Chlamydia)."
            ));

            alternative.add(new AntibioticInfo(
                    "Amoxicillin / Acid Clavulanic",
                    "875/125mg uống mỗi 8-12 giờ",
                    AdminRoute.ORAL,
                    "Lựa chọn khi nghi H. influenzae hoặc M. catarrhalis sinh Beta-lactamase",
                    "Beta-lactam + Beta-lactamase inhibitor",
                    ""
            ));
            alternative.add(new AntibioticInfo(
                    "Azithromycin",
                    "500mg uống ngày 1, sau đó 250mg/ngày từ ngày 2-5 (hoặc 500mg/ngày x 3 ngày)",
                    AdminRoute.ORAL,
                    "Lựa chọn cho vi khuẩn không điển hình hoặc dị ứng Penicillin",
                    "Macrolide",
                    ""
            ));
            alternative.add(new AntibioticInfo(
                    "Clarithromycin",
                    "500mg uống 2 lần/ngày (hoặc 1g phóng thích kéo dài ER 1 lần/ngày) trong 5-7 ngày",
                    AdminRoute.ORAL,
                    "Lựa chọn Macrolide thay thế",
                    "Macrolide",
                    ""
            ));

        } else {
            target = "Ngoại trú Nhóm 2 (>= 65 tuổi HOẶC có bệnh đồng mắc tim/gan/thận/phổi/ĐTĐ/suy giảm miễn dịch HOẶC dùng KS trong 3 tháng)";
            regimenTitle = "Phác đồ Ngoại trú Nhóm 2 (Phối hợp thuốc hoặc Quinolone hô hấp đơn trị)";

            primary.add(new AntibioticInfo(
                    "Amoxicillin / Acid Clavulanic",
                    "875/125mg uống mỗi 8-12 giờ (hoặc 1000/62.5mg 2 viên mỗi 12h)",
                    AdminRoute.ORAL,
                    "Phối hợp thuốc (Thành phần Beta-lactam chính)",
                    "Beta-lactam / Beta-lactamase inhibitor",
                    ""
            ));
            primary.add(new AntibioticInfo(
                    "Azithromycin (hoặc Doxycycline)",
                    "Azithromycin 500mg ngày đầu, sau đó 250mg/ngày x 4 ngày (hoặc Doxycycline 100mg x 2 lần/ngày)",
                    AdminRoute.ORAL,
                    "Phối hợp thuốc (Thành phần Macrolide/Doxycycline)",
                    "Macrolide / Tetracycline",
                    "Bắt buộc phối hợp để bao phủ vi khuẩn không điển hình và cộng hưởng diệt khuẩn."
            ));

            alternative.add(new AntibioticInfo(
                    "Cefpodoxime (hoặc Cefditoren / Cefdinir)",
                    "Cefpodoxime 200mg uống mỗi 12h (hoặc Cefditoren 400mg mỗi 12h / Cefdinir 300mg mỗi 12h) + Azithromycin",
                    AdminRoute.ORAL,
                    "Lựa chọn Beta-lactam thế hệ 3 uống thay thế",
                    "Oral Cephalosporin 3rd gen",
                    ""
            ));
            alternative.add(new AntibioticInfo(
                    "Levofloxacin (hoặc Moxifloxacin)",
                    "Levofloxacin 750mg uống mỗi 24h (hoặc 500mg mỗi 12h) HOẶC Moxifloxacin 400mg uống mỗi 24h",
                    AdminRoute.ORAL,
                    "Quinolone hô hấp đơn trị liệu (Dành cho BN dị ứng Beta-lactam hoặc thất bại phác đồ đầu)",
                    "Respiratory Fluoroquinolone",
                    "Bao phủ phổ rộng Phế cầu kháng thuốc (DRSP), Gram âm và vi khuẩn không điển hình."
            ));
        }

        if (inputs.viralTestPositive) {
            addOns.add(new AntibioticInfo(
                    "Oseltamivir (Tamiflu)",
                    "75mg uống 2 lần/ngày trong 5 ngày",
                    AdminRoute.ORAL,
                    "Thuốc kháng virus bổ sung",
                    "Neuraminidase Inhibitor",
                    "Chỉ định khi test nhanh Cúm A/B dương tính hoặc nghi ngờ dịch tễ cao trong 48h đầu."
            ));
        }

        EmpiricalRegimenResult res = new EmpiricalRegimenResult();
        res.setCareSetting(CareSetting.OUTPATIENT);
        res.setRegimenName(regimenTitle);
        res.setTargetProfile(target);
        res.setPrimaryRegimen(primary);
        res.setAlternativeAllergyRegimen(alternative);
        res.setAddOnRegimen(addOns);
        res.setOralStepDownOptions(stepDown);
        res.setMonitoringInstructions(monitoring);
        return res;
    }

    public EmpiricalRegimenResult generateInpatientRegimen(Step4InputData inputs) {
        String target = "Bệnh nhân viêm phổi mức độ trung bình nhập viện Khoa Nội trú / Khoa Hô hấp";
        List<AntibioticInfo> primary = new ArrayList<>();
        List<AntibioticInfo> alternative = new ArrayList<>();
        List<AntibioticInfo> addOns = new ArrayList<>();
        List<AntibioticInfo> stepDown = new ArrayList<>();
        List<String> monitoring = List.of(
                "Theo dõi mạch, huyết áp, nhịp thở, SpO2 mỗi 4-6 giờ trong 48 giờ đầu.",
                "Đánh giá Procalcitonin (PCT) hoặc CRP vào ngày D0, D3 (48-72h) và D5-D7 để theo dõi động học đáp ứng viêm.",
                "Chỉ định xét nghiệm sàng lọc Lao phổi (AFB đờm, GeneXpert MTB) cho mọi bệnh nhân nội trú có ho khạc đờm kéo dài.",
                "Đánh giá tiêu chuẩn chuyển kháng sinh đường uống sau 48-72h."
        );

        stepDown.add(new AntibioticInfo("Amoxicillin", "1000mg mỗi 8 giờ", AdminRoute.ORAL, "Chuyển tiếp PO", "Penicillin", ""));
        stepDown.add(new AntibioticInfo("Amoxicillin / Acid Clavulanic", "875/125mg mỗi 8-12 giờ", AdminRoute.ORAL, "Chuyển tiếp PO", "Beta-lactam/BLI", ""));

        String regimenTitle;

        if (inputs.suspectPseudomonas) {
            regimenTitle = "Phác đồ Nội trú Phổ rộng (Nghi ngờ Trực khuẩn mủ xanh P. aeruginosa & Gram âm đường ruột)";

            primary.add(new AntibioticInfo(
                    "Piperacillin / Tazobactam",
                    "3.375g - 4.5g liều tải truyền TM trong 30 phút, sau đó 4.5g truyền TM mỗi 6 giờ",
                    AdminRoute.IV,
                    "Kháng sinh Beta-lactam kháng trực khuẩn mủ xanh ưu tiên hàng đầu",
                    "Antipseudomonal Penicillin + BLI",
                    ""
            ));
            primary.add(new AntibioticInfo(
                    "Ceftazidime (hoặc Cefepime)",
                    "Ceftazidime 2g tiêm/truyền TM mỗi 8 giờ HOẶC Cefepime 2g tiêm/truyền TM mỗi 8-12 giờ",
                    AdminRoute.IV,
                    "Cephalosporin kháng trực khuẩn mủ xanh thay thế",
                    "Antipseudomonal Cephalosporin",
                    ""
            ));

            alternative.add(new AntibioticInfo(
                    "Levofloxacin IV",
                    "750mg truyền tĩnh mạch mỗi 24 giờ (hoặc 500mg mỗi 12 giờ)",
                    AdminRoute.IV,
                    "Quinolone phối hợp hoặc đơn trị khi dị ứng",
                    "Respiratory Fluoroquinolone",
                    ""
            ));

        } else if (inputs.hasPenicillinAllergy) {
            regimenTitle = "Phác đồ Nội trú cho Bệnh nhân Dị ứng Beta-lactam";
            primary.add(new AntibioticInfo(
                    "Levofloxacin IV",
                    "750mg truyền tĩnh mạch mỗi 24 giờ (hoặc 500mg mỗi 12 giờ)",
                    AdminRoute.IV,
                    "Quinolone hô hấp đơn trị liệu",
                    "Respiratory Fluoroquinolone",
                    ""
            ));
            primary.add(new AntibioticInfo(
                    "Moxifloxacin IV",
                    "400mg truyền tĩnh mạch mỗi 24 giờ",
                    AdminRoute.IV,
                    "Quinolone hô hấp đơn trị liệu thay thế",
                    "Respiratory Fluoroquinolone",
                    ""
            ));

        } else {
            regimenTitle = "Phác đồ Nội trú Tiêu chuẩn (Beta-lactam IV phối hợp Macrolide HOẶC Quinolone hô hấp)";

            primary.add(new AntibioticInfo(
                    "Ampicillin (hoặc Amoxicillin/Clavulanate / Ceftriaxone)",
                    "Ampicillin 2g truyền TM mỗi 6h HOẶC Amox/Clav 1.2g IV mỗi 8h HOẶC Ceftriaxone 1-2g IV mỗi 24h",
                    AdminRoute.IV,
                    "Beta-lactam tiêm truyền tĩnh mạch chính",
                    "Beta-lactam / Cephalosporin 3rd gen",
                    ""
            ));
            primary.add(new AntibioticInfo(
                    "Azithromycin (hoặc Clarithromycin / Doxycycline)",
                    "Azithromycin 500mg truyền TM / uống mỗi 24h HOẶC Clarithromycin 500mg uống 2 lần/ngày",
                    AdminRoute.IV,
                    "Macrolide phối hợp bao phủ vi khuẩn không điển hình",
                    "Macrolide",
                    ""
            ));

            alternative.add(new AntibioticInfo(
                    "Levofloxacin IV (hoặc Moxifloxacin IV)",
                    "Levofloxacin 750mg truyền TM mỗi 24h HOẶC Moxifloxacin 400mg truyền TM mỗi 24h",
                    AdminRoute.IV,
                    "Quinolone hô hấp đơn trị liệu",
                    "Respiratory Fluoroquinolone",
                    ""
            ));
        }

        if (inputs.viralTestPositive) {
            addOns.add(new AntibioticInfo(
                    "Oseltamivir",
                    "75mg uống 2 lần/ngày x 5 ngày",
                    AdminRoute.ORAL,
                    "Kháng virus phối hợp",
                    "Neuraminidase Inhibitor",
                    ""
            ));
        }

        EmpiricalRegimenResult res = new EmpiricalRegimenResult();
        res.setCareSetting(inputs.careSetting != null ? inputs.careSetting : CareSetting.INPATIENT);
        res.setRegimenName(regimenTitle);
        res.setTargetProfile(target);
        res.setPrimaryRegimen(primary);
        res.setAlternativeAllergyRegimen(alternative);
        res.setAddOnRegimen(addOns);
        res.setOralStepDownOptions(stepDown);
        res.setMonitoringInstructions(monitoring);
        return res;
    }

    public EmpiricalRegimenResult generateIcuRegimen(Step4InputData inputs) {
        String target = "Bệnh nhân viêm phổi nặng / nguy kịch nhập Khoa Hồi sức tích cực (ICU)";
        List<AntibioticInfo> primary = new ArrayList<>();
        List<AntibioticInfo> alternative = new ArrayList<>();
        List<AntibioticInfo> addOns = new ArrayList<>();
        List<AntibioticInfo> stepDown = new ArrayList<>();
        List<String> monitoring = List.of(
                "Theo dõi sát huyết động liên tục (Huyết áp động mạch xâm lấn IBP, CVP, ScvO2 nếu có sốc nhiễm khuẩn).",
                "Khí máu động mạch (ABG) mỗi 6-12 giờ hoặc khi thay đổi thông số máy thở / HFNC.",
                "Định lượng Procalcitonin (PCT) tại thời điểm D0, sau 48-72 giờ và sau 5-7 ngày để hướng dẫn thời gian dùng kháng sinh và đánh giá kiểm soát ổ nhiễm trùng.",
                "Cấy đờm/máu lại sau 72 giờ nếu bệnh nhân chưa hạ sốt hoặc không cải thiện oxy hóa máu."
        );

        String corticoid = null;
        if (inputs.within24hIcu && (inputs.viralTestNegative || !inputs.viralTestPositive)) {
            corticoid = "Chỉ định Corticoid sớm trong vòng 24 giờ đầu cho bệnh nhân Viêm phổi nặng nhập ICU khi xét nghiệm virus âm tính: Hydrocortisone hemisuccinate 200mg/ngày truyền tĩnh mạch liên tục (hoặc chia 50mg mỗi 6h) HOẶC Methylprednisolone 0.5 mg/kg IV mỗi 12h. Tại ngày thứ 4: Giảm liều 10mg. Tổng thời gian 8-14 ngày.";
        }

        String respSupport = null;
        if (inputs.spo2 < 90.0) {
            respSupport = "CHỈ ĐỊNH HỖ TRỢ HÔ HẤP: SpO2 < 90% -> Chỉ định thở oxy dòng cao qua gọng mũi (HFNC) hoặc thông khí nhân tạo không xâm nhập (NIV/BiPAP). Chuẩn bị sẵn sàng đặt nội khí quản thở máy xâm nhập nếu không cải thiện sau 1-2 giờ.";
        }

        String regimenTitle;

        if (inputs.suspectPseudomonas) {
            regimenTitle = "Phác đồ ICU Viêm phổi Nặng: Nghi ngờ Trực khuẩn mủ xanh (Pseudomonas aeruginosa)";

            primary.add(new AntibioticInfo(
                    "Piperacillin / Tazobactam (hoặc Meropenem / Cefepime)",
                    "Piperacillin/Tazobactam 4.5g truyền TM mỗi 6h HOẶC Meropenem 1-2g truyền TM mỗi 8h (truyền kéo dài 3h) HOẶC Cefepime 2g mỗi 8h",
                    AdminRoute.IV,
                    "Khung Beta-lactam / Carbapenem kháng Pseudomonas",
                    "Antipseudomonal Beta-lactam / Carbapenem",
                    ""
            ));
            primary.add(new AntibioticInfo(
                    "Ciprofloxacin IV (hoặc Levofloxacin IV)",
                    "Ciprofloxacin 400mg truyền TM mỗi 8-12h (hoặc 500mg mỗi 12h) HOẶC Levofloxacin 750mg truyền TM mỗi 24h",
                    AdminRoute.IV,
                    "Quinolone kháng Pseudomonas phối hợp hiệp đồng diệt khuẩn",
                    "Antipseudomonal Fluoroquinolone",
                    ""
            ));

            alternative.add(new AntibioticInfo(
                    "Amikacin (hoặc Tobramycin) + Azithromycin IV",
                    "Amikacin 15-20mg/kg truyền TM 1 lần/ngày + Azithromycin 500mg IV mỗi 24h",
                    AdminRoute.IV,
                    "Aminoglycoside phối hợp Macrolide thay thế cho Quinolone",
                    "Aminoglycoside + Macrolide",
                    "Cần theo dõi chức năng thận và đo nồng độ đáy của Aminoglycoside."
            ));

        } else {
            regimenTitle = "Phác đồ ICU Viêm phổi Nặng: Đã Loại trừ Pseudomonas aeruginosa";

            primary.add(new AntibioticInfo(
                    "Ceftriaxone (hoặc Cefotaxime / Ampicillin-Sulbactam)",
                    "Ceftriaxone 2g truyền TM mỗi 24h HOẶC Cefotaxime 2g truyền TM mỗi 8h HOẶC Ampicillin/Sulbactam 3g truyền TM mỗi 6h",
                    AdminRoute.IV,
                    "Beta-lactam thế hệ 3 / ức chế beta-lactamase phổ rộng",
                    "Cephalosporin 3rd gen / Aminopenicillin + BLI",
                    ""
            ));
            primary.add(new AntibioticInfo(
                    "Azithromycin IV (hoặc Levofloxacin IV / Moxifloxacin IV)",
                    "Azithromycin 500mg truyền TM mỗi 24h HOẶC Levofloxacin 750mg truyền TM mỗi 24h HOẶC Moxifloxacin 400mg IV mỗi 24h",
                    AdminRoute.IV,
                    "Phối hợp bao phủ vi khuẩn không điển hình (Legionella) & giảm phản ứng viêm",
                    "Macrolide / Respiratory Quinolone",
                    ""
            ));

            alternative.add(new AntibioticInfo(
                    "Ertapenem (hoặc Imipenem/Cilastatin)",
                    "Ertapenem 1g truyền TM mỗi 24h HOẶC Imipenem 500mg truyền TM mỗi 6h (nặng dùng 1g mỗi 8h, tối đa 1g mỗi 6h)",
                    AdminRoute.IV,
                    "Carbapenem thế hệ 1 (dành cho BN nghi ngờ vi khuẩn sinh ESBL)",
                    "Carbapenem (Non-pseudomonal)",
                    ""
            ));
        }

        if (inputs.suspectMrsa) {
            addOns.add(new AntibioticInfo(
                    "Vancomycin IV",
                    "15-20mg/kg truyền TM mỗi 8-12 giờ (duy trì nồng độ đáy Trough: 15-20 mcg/mL)",
                    AdminRoute.IV,
                    "Kháng sinh kháng MRSA đầu tay",
                    "Glycopeptide",
                    "Bắt buộc theo dõi nồng độ thuốc trong máu (TDM) trước liều thứ 4."
            ));
            addOns.add(new AntibioticInfo(
                    "Linezolid (hoặc Teicoplanin / Ceftaroline)",
                    "Linezolid 600mg truyền TM/uống mỗi 12h HOẶC Teicoplanin liều tải 6mg/kg (800mg) mỗi 12h x 3 liều, sau đó 6mg/kg mỗi 24h HOẶC Ceftaroline 600mg IV mỗi 8h",
                    AdminRoute.IV,
                    "Kháng sinh kháng MRSA thay thế khi suy thận, dị ứng hoặc thất bại Vancomycin",
                    "Oxazolidinone / Lipoglycopeptide / 5th gen Cephalosporin",
                    ""
            ));
        }

        EmpiricalRegimenResult res = new EmpiricalRegimenResult();
        res.setCareSetting(CareSetting.ICU);
        res.setRegimenName(regimenTitle);
        res.setTargetProfile(target);
        res.setPrimaryRegimen(primary);
        res.setAlternativeAllergyRegimen(alternative);
        res.setAddOnRegimen(addOns);
        res.setOralStepDownOptions(stepDown);
        res.setMonitoringInstructions(monitoring);
        res.setEarlyCorticosteroidRecommendation(corticoid);
        res.setRespiratorySupportRecommendation(respSupport);
        return res;
    }

    public EmpiricalRegimenResult evaluateStep4(Step4InputData inputs) {
        if (inputs == null) inputs = new Step4InputData();
        if (inputs.careSetting == null) inputs.careSetting = CareSetting.INPATIENT;
        if (inputs.careSetting == CareSetting.OUTPATIENT) {
            return generateOutpatientRegimen(inputs);
        } else if (inputs.careSetting == CareSetting.SHORT_TERM_INPATIENT || inputs.careSetting == CareSetting.INPATIENT) {
            return generateInpatientRegimen(inputs);
        } else {
            return generateIcuRegimen(inputs);
        }
    }
}
