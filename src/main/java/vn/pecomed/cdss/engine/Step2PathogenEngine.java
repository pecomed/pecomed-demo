package vn.pecomed.cdss.engine;

import vn.pecomed.cdss.model.enums.CareSetting;
import vn.pecomed.cdss.model.enums.PathogenCategory;
import vn.pecomed.cdss.model.results.Pathogen;
import vn.pecomed.cdss.model.results.PathogenEngineResult;
import vn.pecomed.cdss.model.vitals.ClinicalRiskProfile;

import java.util.*;

/**
 * Step 2: Pathogen Diagnosis & Microbiological Test Ordering Engine.
 * Multi-filter pathogen prediction, risk factor scoring, microbiological tests, chest CT indications.
 */
public class Step2PathogenEngine {

    private static final List<Pathogen> PRESET_PATHOGENS = List.of(
            new Pathogen("S_PNEUMONIAE", "Streptococcus pneumoniae", PathogenCategory.BACTERIA, "Phế cầu khuẩn"),
            new Pathogen("M_PNEUMONIAE", "Mycoplasma pneumoniae", PathogenCategory.ATYPICAL, "Vi khuẩn không điển hình Mycoplasma"),
            new Pathogen("C_PNEUMONIAE", "Chlamydia pneumoniae", PathogenCategory.ATYPICAL, "Vi khuẩn không điển hình Chlamydia"),
            new Pathogen("H_INFLUENZAE", "Haemophilus influenzae", PathogenCategory.BACTERIA, "Trực khuẩn HI"),
            new Pathogen("GRAM_NEG_ENTERIC", "Gram-negative enteric bacteria", PathogenCategory.BACTERIA, "Vi khuẩn Gram âm đường ruột (Klebsiella, E. coli...)"),
            new Pathogen("LEGIONELLA_SPP", "Legionella pneumophila / spp.", PathogenCategory.ATYPICAL, "Vi khuẩn Legionella"),

            // Viruses
            new Pathogen("INFLUENZA", "Influenza virus (A/B)", PathogenCategory.VIRUS, "Virus cúm A/B"),
            new Pathogen("PARAINFLUENZA", "Parainfluenza virus", PathogenCategory.VIRUS, "Virus á cúm"),
            new Pathogen("RSV", "Respiratory Syncytial Virus (RSV)", PathogenCategory.VIRUS, "Virus hợp bào hô hấp"),
            new Pathogen("ENTEROVIRUS", "Enterovirus", PathogenCategory.VIRUS, "Enterovirus"),
            new Pathogen("RHINOVIRUS", "Rhinovirus", PathogenCategory.VIRUS, "Rhinovirus"),
            new Pathogen("ADENOVIRUS", "Adenovirus", PathogenCategory.VIRUS, "Adenovirus"),
            new Pathogen("CORONAVIRUS", "Coronavirus", PathogenCategory.VIRUS, "Coronavirus thông thường"),
            new Pathogen("SARS_COV_2", "SARS-CoV-2", PathogenCategory.VIRUS, "Virus SARS-CoV-2 (COVID-19)"),
            new Pathogen("HMPV", "Human Metapneumovirus (HMPV)", PathogenCategory.VIRUS, "Human Metapneumovirus"),
            new Pathogen("CMV", "Cytomegalovirus (CMV)", PathogenCategory.VIRUS, "Cytomegalovirus"),
            new Pathogen("EBV", "Epstein-Barr virus (EBV)", PathogenCategory.VIRUS, "Epstein-Barr virus"),
            new Pathogen("BOCAVIRUS", "Human Bocavirus", PathogenCategory.VIRUS, "Human Bocavirus")
    );

    public Map<String, Pathogen> runFilter1(CareSetting careSetting) {
        if (careSetting == null) careSetting = CareSetting.INPATIENT;
        Map<String, Pathogen> candidates = new LinkedHashMap<>();
        for (Pathogen p : PRESET_PATHOGENS) {
            candidates.put(p.getId(), p.copy());
        }

        if (careSetting == CareSetting.OUTPATIENT) {
            candidates.remove("LEGIONELLA_SPP");
            candidates.remove("GRAM_NEG_ENTERIC");
        } else if (careSetting == CareSetting.SHORT_TERM_INPATIENT || careSetting == CareSetting.INPATIENT) {
            candidates.put("ANAEROBIC", new Pathogen("ANAEROBIC", "Anaerobic bacteria", PathogenCategory.BACTERIA, "Vi khuẩn kỵ khí", false));
            candidates.put("B_PERTUSSIS", new Pathogen("B_PERTUSSIS", "Bordetella pertussis", PathogenCategory.BACTERIA, "Vi khuẩn ho gà (B. pertussis)", false));
            candidates.put("CO_INFECTION", new Pathogen("CO_INFECTION", "Mixed / Polymicrobial infection", PathogenCategory.BACTERIA, "Nhiễm khuẩn phối hợp", false));
        } else if (careSetting == CareSetting.ICU) {
            candidates.put("ANAEROBIC", new Pathogen("ANAEROBIC", "Anaerobic bacteria", PathogenCategory.BACTERIA, "Vi khuẩn kỵ khí", false));
            candidates.put("B_PERTUSSIS", new Pathogen("B_PERTUSSIS", "Bordetella pertussis", PathogenCategory.BACTERIA, "Vi khuẩn ho gà (B. pertussis)", false));
            candidates.put("CO_INFECTION", new Pathogen("CO_INFECTION", "Mixed / Polymicrobial infection", PathogenCategory.BACTERIA, "Nhiễm khuẩn phối hợp", false));
            candidates.put("P_AERUGINOSA", new Pathogen("P_AERUGINOSA", "Pseudomonas aeruginosa", PathogenCategory.BACTERIA, "Trực khuẩn mủ xanh (P. aeruginosa)", false));
            candidates.put("S_AUREUS", new Pathogen("S_AUREUS", "Staphylococcus aureus (MSSA / MRSA)", PathogenCategory.BACTERIA, "Tụ cầu vàng (S. aureus)", false));
        }

        return candidates;
    }

    public static class Filter2Result {
        public final List<Pathogen> rankedPathogens;
        public final List<String> rationale;

        public Filter2Result(List<Pathogen> rankedPathogens, List<String> rationale) {
            this.rankedPathogens = rankedPathogens;
            this.rationale = rationale;
        }
    }

    public Filter2Result runFilter2(Map<String, Pathogen> candidateDict, ClinicalRiskProfile profile, CareSetting careSetting) {
        if (candidateDict == null) {
            candidateDict = runFilter1(careSetting);
        }
        Map<String, Pathogen> candidates = new LinkedHashMap<>(candidateDict);
        List<String> rationale = new ArrayList<>();

        // Helper to add or bump factor
        var addFactor = new Object() {
            void apply(String id, String factor, int bump, String defaultName, String vietName, PathogenCategory cat) {
                if (!candidates.containsKey(id)) {
                    candidates.put(id, new Pathogen(id, defaultName.isEmpty() ? id : defaultName, cat, vietName, false));
                }
                Pathogen p = candidates.get(id);
                p.addMatchedFactor(factor, bump);
            }
        };

        if (profile == null) {
            profile = new ClinicalRiskProfile();
        }

        // 1. Thói quen
        if (profile.isSmoking()) {
            addFactor.apply("S_PNEUMONIAE", "Hút thuốc lá", 2, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
            addFactor.apply("H_INFLUENZAE", "Hút thuốc lá", 2, "Haemophilus influenzae", "Trực khuẩn HI", PathogenCategory.BACTERIA);
            addFactor.apply("LEGIONELLA_SPP", "Hút thuốc lá", 1, "Legionella pneumophila / spp.", "Vi khuẩn Legionella", PathogenCategory.ATYPICAL);
            rationale.add("Hút thuốc lá làm tăng nguy cơ Phế cầu, H. influenzae và Legionella.");
        }

        if (profile.isAlcoholism()) {
            addFactor.apply("S_PNEUMONIAE", "Nghiện rượu", 2, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
            addFactor.apply("H_INFLUENZAE", "Nghiện rượu", 1, "Haemophilus influenzae", "Trực khuẩn HI", PathogenCategory.BACTERIA);
            addFactor.apply("KLEBSIELLA", "Nghiện rượu", 3, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella pneumoniae", PathogenCategory.BACTERIA);
            addFactor.apply("A_BAUMANNII", "Nghiện rượu", 2, "Acinetobacter baumannii", "Trực khuẩn Acinetobacter baumannii", PathogenCategory.BACTERIA);
            addFactor.apply("ANAEROBIC", "Viêm phổi hít do nghiện rượu", 2, "Anaerobic bacteria", "Vi khuẩn kỵ khí", PathogenCategory.BACTERIA);
            rationale.add("Nghiện rượu làm tăng rõ rệt nguy cơ Klebsiella, A. baumannii, phế cầu và vi khuẩn kỵ khí.");
        }

        // 2. Bệnh đồng mắc
        if (profile.isHiv() || profile.isCd4Lt200()) {
            addFactor.apply("S_PNEUMONIAE", "HIV / CD4 < 200", 2, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
            addFactor.apply("H_INFLUENZAE", "HIV / CD4 < 200", 2, "Haemophilus influenzae", "Trực khuẩn HI", PathogenCategory.BACTERIA);
            addFactor.apply("P_JIROVECII", "Nhiễm HIV / CD4 < 200/uL", 4, "Pneumocystis jirovecii (PJP/PCP)", "Nấm Pneumocystis jirovecii", PathogenCategory.FUNGI);
            rationale.add("Nhiễm HIV / CD4 < 200 là nguy cơ hàng đầu của nấm Pneumocystis jirovecii (PJP).");
        }

        if (profile.isStrokeNeurological()) {
            addFactor.apply("KLEBSIELLA", "Bệnh lý mạch não / Tâm thần / Nuốt nghẹn", 2, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella pneumoniae", PathogenCategory.BACTERIA);
            addFactor.apply("ANAEROBIC", "Nguy cơ hít sặc do tai biến mạch não", 2, "Anaerobic bacteria", "Vi khuẩn kỵ khí", PathogenCategory.BACTERIA);
            rationale.add("Bệnh mạch não/thần kinh tăng nguy cơ hít phải Klebsiella và vi khuẩn kỵ khí.");
        }

        if (profile.isChronicLiverDisease() || profile.isCongestiveHeartFailure() || profile.isMalnutrition()) {
            addFactor.apply("S_PNEUMONIAE", "Bệnh nội khoa mạn tính (Gan / Tim / Suy dinh dưỡng)", 2, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
        }

        if (profile.isStructuralLungDisease()) {
            addFactor.apply("P_AERUGINOSA", "Bệnh phổi cấu trúc (COPD FEV1<30%, Giãn PQ, Xơ nang)", 4, "Pseudomonas aeruginosa", "Trực khuẩn mủ xanh (P. aeruginosa)", PathogenCategory.BACTERIA);
            addFactor.apply("S_PNEUMONIAE", "Bệnh phổi cấu trúc", 2, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
            addFactor.apply("H_INFLUENZAE", "Bệnh phổi cấu trúc", 2, "Haemophilus influenzae", "Trực khuẩn HI", PathogenCategory.BACTERIA);
            rationale.add("Bệnh phổi cấu trúc (COPD nặng FEV1<30%, giãn PQ) làm tăng nguy cơ cao trực khuẩn mủ xanh P. aeruginosa.");
        }

        if (profile.isSevereLungAspirationRisk()) {
            addFactor.apply("ANAEROBIC", "Bệnh phổi nặng / Viêm phổi hít / Viêm nha chu", 3, "Anaerobic bacteria", "Vi khuẩn kỵ khí", PathogenCategory.BACTERIA);
            rationale.add("Viêm phổi hít / bệnh nha chu hầu họng mang nguy cơ cao vi khuẩn kỵ khí.");
        }

        if (profile.isPostInfluenzaMeasles()) {
            addFactor.apply("S_AUREUS", "Bội nhiễm sau cúm / sởi", 3, "Staphylococcus aureus (MSSA / MRSA)", "Tụ cầu vàng (S. aureus)", PathogenCategory.BACTERIA);
            addFactor.apply("S_PNEUMONIAE", "Bội nhiễm sau cúm", 2, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
            rationale.add("Bệnh cảnh bội nhiễm sau cúm/sởi thường gặp Tụ cầu vàng (S. aureus) hoại tử phổi.");
        }

        if (profile.isEndocarditis()) {
            addFactor.apply("S_AUREUS", "Viêm nội tâm mạc nhiễm khuẩn", 3, "Staphylococcus aureus (MSSA / MRSA)", "Tụ cầu vàng (S. aureus)", PathogenCategory.BACTERIA);
        }

        // 3. Suy giảm miễn dịch
        if (profile.isSolidOrganTransplant()) {
            addFactor.apply("S_PNEUMONIAE", "Ghép tạng", 2, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
            addFactor.apply("CMV", "Ghép tạng / Dùng ức chế miễn dịch", 3, "Cytomegalovirus (CMV)", "Cytomegalovirus", PathogenCategory.VIRUS);
            addFactor.apply("RSV", "Ghép tạng", 2, "Respiratory Syncytial Virus (RSV)", "Virus hợp bào hô hấp", PathogenCategory.VIRUS);
            rationale.add("Sau ghép tạng cần cảnh giác nhiễm CMV, RSV và Phế cầu.");
        }

        if (profile.isBoneMarrowTransplant()) {
            addFactor.apply("RSV", "Ghép tủy / Ghép tế bào gốc", 3, "Respiratory Syncytial Virus (RSV)", "Virus hợp bào hô hấp", PathogenCategory.VIRUS);
            addFactor.apply("CMV", "Ghép tủy", 3, "Cytomegalovirus (CMV)", "Cytomegalovirus", PathogenCategory.VIRUS);
            addFactor.apply("ASPERGILLUS", "Ghép tủy", 2, "Aspergillus spp.", "Nấm Aspergillus", PathogenCategory.FUNGI);
        }

        if (profile.isNeutropenia()) {
            addFactor.apply("P_AERUGINOSA", "Giảm bạch cầu đa nhân trung tính", 4, "Pseudomonas aeruginosa", "Trực khuẩn mủ xanh (P. aeruginosa)", PathogenCategory.BACTERIA);
            addFactor.apply("S_AUREUS", "Giảm bạch cầu đa nhân trung tính", 3, "Staphylococcus aureus (MSSA / MRSA)", "Tụ cầu vàng (S. aureus)", PathogenCategory.BACTERIA);
            addFactor.apply("ASPERGILLUS", "Giảm bạch cầu trung tính kéo dài", 2, "Aspergillus spp.", "Nấm Aspergillus", PathogenCategory.FUNGI);
            rationale.add("Giảm bạch cầu trung tính (Neutropenia) là yếu tố nguy cơ số 1 của Pseudomonas, S. aureus và nấm.");
        }

        if (profile.isHypogammaglobulinemia()) {
            addFactor.apply("S_PNEUMONIAE", "Giảm gamma globulin", 2, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
            addFactor.apply("H_INFLUENZAE", "Giảm gamma globulin", 2, "Haemophilus influenzae", "Trực khuẩn HI", PathogenCategory.BACTERIA);
        }

        if (profile.isImmunosuppressiveDrugs()) {
            addFactor.apply("CMV", "Dùng thuốc ức chế miễn dịch / Corticoid", 2, "Cytomegalovirus (CMV)", "Cytomegalovirus", PathogenCategory.VIRUS);
            addFactor.apply("P_JIROVECII", "Dùng ức chế miễn dịch kéo dài", 2, "Pneumocystis jirovecii (PJP/PCP)", "Nấm Pneumocystis jirovecii", PathogenCategory.FUNGI);
        }

        // 4. Yếu tố dịch tễ & Điều trị gần đây
        if (profile.isRainySeasonMudWater()) {
            addFactor.apply("B_PSEUDOMALLEI", "Mùa mưa / Tiếp xúc bùn nước đất bẩn", 3, "Burkholderia pseudomallei", "Vi khuẩn Whitmore (B. pseudomallei)", PathogenCategory.BACTERIA);
            rationale.add("Mùa mưa và tiếp xúc bùn đất nước bẩn là yếu tố dịch tễ kinh điển của bệnh Whitmore (B. pseudomallei).");
        }

        if (profile.isDiabetes()) {
            addFactor.apply("B_PSEUDOMALLEI", "Đái tháo đường (Nguy cơ Whitmore)", 3, "Burkholderia pseudomallei", "Vi khuẩn Whitmore (B. pseudomallei)", PathogenCategory.BACTERIA);
            addFactor.apply("S_AUREUS", "Đái tháo đường", 2, "Staphylococcus aureus (MSSA / MRSA)", "Tụ cầu vàng (S. aureus)", PathogenCategory.BACTERIA);
            addFactor.apply("KLEBSIELLA", "Đái tháo đường", 2, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella pneumoniae", PathogenCategory.BACTERIA);
            rationale.add("Đái tháo đường là yếu tố thúc đẩy hàng đầu của Whitmore, Tụ cầu vàng và Klebsiella.");
        }

        if (profile.isChronicKidneyDisease()) {
            addFactor.apply("B_PSEUDOMALLEI", "Bệnh thận mạn / Suy thận", 2, "Burkholderia pseudomallei", "Vi khuẩn Whitmore (B. pseudomallei)", PathogenCategory.BACTERIA);
            addFactor.apply("S_AUREUS", "Bệnh thận mạn / Chạy thận", 2, "Staphylococcus aureus (MSSA / MRSA)", "Tụ cầu vàng (S. aureus)", PathogenCategory.BACTERIA);
        }

        if (profile.isPriorMrsa()) {
            addFactor.apply("MRSA", "Tiền sử nhiễm MRSA trước đó", 5, "Methicillin-resistant Staphylococcus aureus (MRSA)", "Tụ cầu vàng kháng Methicillin (MRSA)", PathogenCategory.BACTERIA);
            rationale.add("Tiền sử nhiễm MRSA: Bắt buộc chỉ định phác đồ kháng MRSA.");
        }

        if (profile.isSkinInfection() || profile.isIvDrugUse()) {
            addFactor.apply("S_AUREUS", "Nhiễm trùng da / Tiêm chích tĩnh mạch", 4, "Staphylococcus aureus (MSSA / MRSA)", "Tụ cầu vàng (S. aureus)", PathogenCategory.BACTERIA);
            rationale.add("Tiêm chích nhiều lần / nhiễm trùng ngoài da gợi ý mạnh mẽ Tụ cầu vàng.");
        }

        if (profile.isChronicLungDisease()) {
            addFactor.apply("S_PNEUMONIAE", "Bệnh phổi mạn tính (COPD, bụi phổi...)", 2, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
            addFactor.apply("KLEBSIELLA", "Bệnh phổi mạn tính", 1, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella pneumoniae", PathogenCategory.BACTERIA);
            addFactor.apply("A_BAUMANNII", "Bệnh phổi mạn tính", 1, "Acinetobacter baumannii", "Trực khuẩn Acinetobacter baumannii", PathogenCategory.BACTERIA);
        }

        if (profile.isIvAntibioticsGt90d()) {
            addFactor.apply("P_AERUGINOSA", "Dùng KS tĩnh mạch > 90 ngày", 3, "Pseudomonas aeruginosa", "Trực khuẩn mủ xanh (P. aeruginosa)", PathogenCategory.BACTERIA);
            addFactor.apply("S_AUREUS", "Dùng KS tĩnh mạch > 90 ngày", 2, "Staphylococcus aureus (MSSA / MRSA)", "Tụ cầu vàng (S. aureus)", PathogenCategory.BACTERIA);
            rationale.add("Dùng KS tĩnh mạch kéo dài >90 ngày làm tăng nguy cơ vi khuẩn đa kháng (Pseudomonas, MRSA).");
        }

        if (profile.isPriorAntibioticsPast3m()) {
            addFactor.apply("KLEBSIELLA", "Dùng kháng sinh trong 3 tháng qua", 2, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella pneumoniae", PathogenCategory.BACTERIA);
            addFactor.apply("P_AERUGINOSA", "Dùng kháng sinh trong 3 tháng qua", 2, "Pseudomonas aeruginosa", "Trực khuẩn mủ xanh (P. aeruginosa)", PathogenCategory.BACTERIA);
            addFactor.apply("DRSP", "Dùng kháng sinh trong 3 tháng qua", 2, "Drug-resistant Streptococcus pneumoniae (DRSP)", "Phế cầu kháng thuốc (DRSP)", PathogenCategory.BACTERIA);
            rationale.add("Tiền sử dùng kháng sinh trong 3 tháng làm tăng nguy cơ Klebsiella, Pseudomonas và Phế cầu kháng thuốc.");
        }

        if (profile.isIntubationMechanicalVent()) {
            addFactor.apply("KLEBSIELLA", "Đặt nội khí quản / Thở máy", 3, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella pneumoniae", PathogenCategory.BACTERIA);
            addFactor.apply("P_AERUGINOSA", "Đặt nội khí quản / Thở máy", 3, "Pseudomonas aeruginosa", "Trực khuẩn mủ xanh (P. aeruginosa)", PathogenCategory.BACTERIA);
            addFactor.apply("A_BAUMANNII", "Đặt nội khí quản", 2, "Acinetobacter baumannii", "Trực khuẩn Acinetobacter baumannii", PathogenCategory.BACTERIA);
        }

        if (profile.isAnesthesiaHistory()) {
            addFactor.apply("KLEBSIELLA", "Tiền sử gây mê gần đây", 2, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella pneumoniae", PathogenCategory.BACTERIA);
        }

        // 5. Virus học
        if (profile.isWinterSeason()) {
            addFactor.apply("INFLUENZA", "Mùa đông dịch tễ virus", 1, "Influenza virus (A/B)", "Virus cúm A/B", PathogenCategory.VIRUS);
            addFactor.apply("RSV", "Mùa đông dịch tễ virus", 1, "Respiratory Syncytial Virus (RSV)", "Virus hợp bào hô hấp", PathogenCategory.VIRUS);
        }

        if (profile.isAgeLt10OrGt65()) {
            addFactor.apply("HMPV", "Độ tuổi nhạy cảm (<10 hoặc >65)", 1, "Human Metapneumovirus (HMPV)", "Human Metapneumovirus", PathogenCategory.VIRUS);
        }

        if (profile.getRapidTestPositive() != null && !profile.getRapidTestPositive().trim().isEmpty()) {
            String testUpper = profile.getRapidTestPositive().toUpperCase();
            if (testUpper.contains("COVID") || testUpper.contains("SARS")) {
                addFactor.apply("SARS_COV_2", "Kit test nhanh COVID-19 dương tính", 6, "SARS-CoV-2", "Virus SARS-CoV-2 (COVID-19)", PathogenCategory.VIRUS);
                rationale.add("Test nhanh COVID-19 dương tính: Xác định căn nguyên SARS-CoV-2.");
            } else if (testUpper.contains("FLU") || testUpper.contains("CÚM") || testUpper.contains("INFLUENZA")) {
                addFactor.apply("INFLUENZA", "Kit test nhanh Cúm dương tính", 6, "Influenza virus (A/B)", "Virus cúm A/B", PathogenCategory.VIRUS);
                rationale.add("Test nhanh Cúm A/B dương tính: Xác định căn nguyên Influenza.");
            } else if (testUpper.contains("RSV")) {
                addFactor.apply("RSV", "Kit test nhanh RSV dương tính", 6, "Respiratory Syncytial Virus (RSV)", "Virus hợp bào hô hấp", PathogenCategory.VIRUS);
                rationale.add("Test nhanh RSV dương tính: Xác định căn nguyên RSV.");
            } else if (testUpper.contains("LEGIONELLA")) {
                addFactor.apply("LEGIONELLA_SPP", "Kháng nguyên Legionella nước tiểu dương tính", 6, "Legionella pneumophila / spp.", "Vi khuẩn Legionella", PathogenCategory.ATYPICAL);
                rationale.add("Kháng nguyên Legionella dương tính: Xác định căn nguyên Legionella.");
            } else if (testUpper.contains("STREP") || testUpper.contains("PNEUMO") || testUpper.contains("PHẾ CẦU")) {
                addFactor.apply("S_PNEUMONIAE", "Kháng nguyên Phế cầu nước tiểu dương tính", 6, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
                rationale.add("Kháng nguyên phế cầu niệu dương tính: Xác định căn nguyên S. pneumoniae.");
            } else if (testUpper.contains("MRSA")) {
                addFactor.apply("MRSA", "Test nhanh / PCR phát hiện MRSA dương tính", 6, "Methicillin-resistant Staphylococcus aureus (MRSA)", "Tụ cầu vàng kháng Methicillin (MRSA)", PathogenCategory.BACTERIA);
                rationale.add("Xét nghiệm phát hiện nhanh MRSA dương tính: Xác định căn nguyên MRSA.");
            } else if (testUpper.contains("WHITMORE") || testUpper.contains("PSEUDOMALLEI")) {
                addFactor.apply("B_PSEUDOMALLEI", "Test nhanh Whitmore (B. pseudomallei) dương tính", 6, "Burkholderia pseudomallei", "Vi khuẩn Whitmore (B. pseudomallei)", PathogenCategory.BACTERIA);
                rationale.add("Xét nghiệm phát hiện Whitmore dương tính.");
            }
        }

        // 6. Chest CT
        if (profile.isChestCtAvailable()) {
            if (profile.isCtHomogeneousConsolidationBulgingFissure()) {
                addFactor.apply("KLEBSIELLA", "CT: Đông đặc thùy trên + Đẩy lồi rãnh liên thùy", 3, "Klebsiella pneumoniae", "Vi khuẩn Klebsiella pneumoniae", PathogenCategory.BACTERIA);
                addFactor.apply("S_PNEUMONIAE", "CT: Đông đặc đồng nhất 1 thùy + Phế quản hơi", 3, "Streptococcus pneumoniae", "Phế cầu khuẩn", PathogenCategory.BACTERIA);
                rationale.add("Hình ảnh CT đông đặc thùy điển hình có dấu hiệu đẩy lồi rãnh liên thùy: Gợi ý Klebsiella pneumoniae hoặc S. pneumoniae.");
            }
            if (profile.isCtBronchopneumoniaCavitary()) {
                addFactor.apply("S_AUREUS", "CT: Viêm phế quản phổi + Tổn thương dạng hang / bóng khí", 4, "Staphylococcus aureus (MSSA / MRSA)", "Tụ cầu vàng (S. aureus)", PathogenCategory.BACTERIA);
                rationale.add("Hình ảnh CT phế quản phế viêm hoại tử tạo hang: Gợi ý mạnh mẽ Tụ cầu vàng (S. aureus).");
            }
            if (profile.isCtDiffuseLobarConsolidation()) {
                addFactor.apply("LEGIONELLA_SPP", "CT: Đông đặc lan tỏa tiến triển nhiều thùy", 3, "Legionella pneumophila / spp.", "Vi khuẩn Legionella", PathogenCategory.ATYPICAL);
            }
            if (profile.isCtBilateralGroundGlassReticular()) {
                addFactor.apply("INFLUENZA", "CT: Tổn thương kính mờ / nốt lưới rải rác 2 bên", 2, "Influenza virus (A/B)", "Virus cúm A/B", PathogenCategory.VIRUS);
                addFactor.apply("RSV", "CT: Kính mờ / tổn thương lưới", 2, "Respiratory Syncytial Virus (RSV)", "Virus hợp bào hô hấp", PathogenCategory.VIRUS);
                addFactor.apply("M_PNEUMONIAE", "CT: Kính mờ / dải mờ kẽ", 2, "Mycoplasma pneumoniae", "Vi khuẩn không điển hình Mycoplasma", PathogenCategory.ATYPICAL);
            }
            if (profile.isCtProgressiveGroundGlassCrazyPaving()) {
                addFactor.apply("SARS_COV_2", "CT: Kính mờ tiến triển + Dày vách liên tiểu thùy (Crazy-paving)", 4, "SARS-CoV-2", "Virus SARS-CoV-2 (COVID-19)", PathogenCategory.VIRUS);
                rationale.add("Hình ảnh CT dạng kính mờ ngoại vi + lát đá (Crazy-paving) tập trung thùy dưới/sau: Đặc trưng COVID-19.");
            }
        }

        List<Pathogen> ranked = new ArrayList<>(candidates.values());
        ranked.sort((a, b) -> {
            if (b.getScore() != a.getScore()) {
                return Integer.compare(b.getScore(), a.getScore());
            }
            if (b.isPreset() != a.isPreset()) {
                return Boolean.compare(b.isPreset(), a.isPreset());
            }
            return a.getId().compareTo(b.getId());
        });

        return new Filter2Result(ranked, rationale);
    }

    public static class MicroOrdersResult {
        public final List<String> generalOrders;
        public final List<String> specificOrders;
        public final boolean fungalWarning;

        public MicroOrdersResult(List<String> generalOrders, List<String> specificOrders, boolean fungalWarning) {
            this.generalOrders = generalOrders;
            this.specificOrders = specificOrders;
            this.fungalWarning = fungalWarning;
        }
    }

    public MicroOrdersResult generateMicrobiologyOrders(CareSetting careSetting, List<Pathogen> rankedPathogens,
                                                         boolean pleuralEffusion, boolean unresponsiveToTherapy) {
        if (careSetting == null) careSetting = CareSetting.INPATIENT;
        if (rankedPathogens == null) rankedPathogens = Collections.emptyList();
        List<String> generalOrders = new ArrayList<>();
        List<String> specificOrders = new ArrayList<>();
        boolean fungalWarning = false;

        if (careSetting != CareSetting.OUTPATIENT) {
            generalOrders.add("1. Nhuộm soi Gram đờm / dịch hút khí quản (Yêu cầu đánh giá tiêu chuẩn đờm: >25 bạch cầu đa nhân, <10 tế bào biểu mô / vi trường).");
            generalOrders.add("2. Nuôi cấy đờm / dịch phế quản phân lập vi khuẩn + Kháng sinh đồ (AST) định lượng MIC.");
        }

        if (careSetting == CareSetting.ICU || careSetting == CareSetting.INPATIENT) {
            generalOrders.add("3. Cấy máu 2 vị trí (2 chai kỵ khí + 2 chai hiếu khí) thực hiện trước khi bắt đầu dùng liều kháng sinh đầu tiên.");
        }

        if (careSetting == CareSetting.ICU) {
            generalOrders.add("4. Real-time Multiplex PCR hô hấp (Panel 20-30 tác nhân vi khuẩn & virus hô hấp).");
        }

        if (pleuralEffusion) {
            generalOrders.add("5. Xét nghiệm dịch màng phổi: Nhuộm Gram, cấy vi khuẩn hiếu khí - kỵ khí, định lượng Protein, LDH, Glucose, pH dịch.");
        }

        Set<String> topIds = new HashSet<>();
        for (Pathogen p : rankedPathogens) {
            if (p.getScore() > 0) {
                topIds.add(p.getId());
            }
        }

        if (topIds.contains("LEGIONELLA_SPP") || rankedPathogens.stream().limit(4).anyMatch(p -> "LEGIONELLA_SPP".equals(p.getId()))) {
            specificOrders.add("Legionella: Xét nghiệm tìm kháng nguyên Legionella pneumophila Serogroup 1 trong nước tiểu (Urine Antigen Test) + PCR đờm.");
        }

        if (topIds.contains("S_PNEUMONIAE") || rankedPathogens.stream().limit(3).anyMatch(p -> "S_PNEUMONIAE".equals(p.getId()))) {
            specificOrders.add("Phế cầu (S. pneumoniae): Test tìm kháng nguyên phế cầu trong nước tiểu (Streptococcal Urinary Antigen).");
        }

        if (topIds.contains("M_PNEUMONIAE") || topIds.contains("C_PNEUMONIAE")) {
            specificOrders.add("Mycoplasma / Chlamydia: Real-time PCR dịch tỵ hầu / đờm & Tìm hiệu giá kháng thể IgM/IgG huyết thanh.");
        }

        if (topIds.contains("INFLUENZA") || topIds.contains("SARS_COV_2") || topIds.contains("RSV")) {
            specificOrders.add("Virus hô hấp: Test nhanh kháng nguyên / Real-time RT-PCR Cúm A/B, SARS-CoV-2, RSV.");
        }

        if (topIds.contains("B_PSEUDOMALLEI")) {
            specificOrders.add("Whitmore (B. pseudomallei): Nuôi cấy máu, đờm, nước tiểu trên môi trường chọn lọc Ashdown + Định danh vi khuẩn tự động.");
        }

        if (topIds.contains("P_JIROVECII")) {
            specificOrders.add("P. jirovecii: Nhuộm soi Giemsa / Gomori Grocott dịch rửa phế quản (BAL) + Real-time PCR Pneumocystis jirovecii.");
            fungalWarning = true;
        }

        if (topIds.contains("MRSA") || topIds.contains("S_AUREUS")) {
            specificOrders.add("Tụ cầu vàng / MRSA: Nuôi cấy phân lập + PCR gen đề kháng mecA / gen độc tố PVL.");
        }

        if (topIds.contains("ANAEROBIC")) {
            specificOrders.add("Vi khuẩn kỵ khí: Cấy dịch phế quản / dịch màng phổi trong bình kỵ khí chuyên dụng.");
        }

        if (unresponsiveToTherapy || topIds.contains("ASPERGILLUS")) {
            specificOrders.add("Căn nguyên nấm: Soi tươi tìm nấm (KOH), cấy nấm môi trường Sabouraud, định lượng Galactomannan / Beta-D-Glucan huyết thanh.");
            fungalWarning = true;
        }

        return new MicroOrdersResult(generalOrders, specificOrders, fungalWarning);
    }

    public static class ChestCtResult {
        public final boolean isIndicated;
        public final List<String> reasons;

        public ChestCtResult(boolean isIndicated, List<String> reasons) {
            this.isIndicated = isIndicated;
            this.reasons = reasons;
        }
    }

    public ChestCtResult evaluateChestCtIndication(CareSetting careSetting, ClinicalRiskProfile profile) {
        List<String> reasons = new ArrayList<>();

        if (careSetting == CareSetting.ICU || careSetting == CareSetting.INPATIENT) {
            reasons.add("Viêm phổi mức độ trung bình - nặng cần đánh giá chính xác biến chứng hoại tử, áp xe hoặc tràn dịch vách hóa.");
        }

        if (profile != null) {
            if (profile.isSolidOrganTransplant() || profile.isHiv() || profile.isNeutropenia() || profile.isImmunosuppressiveDrugs()) {
                reasons.add("Bệnh nhân suy giảm miễn dịch (Nguy cơ cao nhiễm nấm, PJP, tác nhân cơ hội hoặc tổn thương kẽ).");
            }
            if (profile.isXrayUnclearOrRecurrent()) {
                reasons.add("X-quang ngực không rõ tổn thương hoặc viêm phổi tái phát nhiều lần.");
            }
            if (profile.isSevereLungAspirationRisk() || profile.isChronicLungDisease()) {
                reasons.add("Nghi ngờ bệnh lý phối hợp / tổn thương cấu trúc phổi (Giãn phế quản, u phổi, dị vật đường thở).");
            }
        }

        return new ChestCtResult(!reasons.isEmpty(), reasons);
    }

    public PathogenEngineResult evaluateStep2(CareSetting careSetting, ClinicalRiskProfile riskProfile,
                                              boolean pleuralEffusion, boolean unresponsiveToTherapy) {
        Map<String, Pathogen> setA = runFilter1(careSetting);
        int setACount = setA.size();

        Filter2Result filter2 = runFilter2(setA, riskProfile, careSetting);
        MicroOrdersResult micro = generateMicrobiologyOrders(careSetting, filter2.rankedPathogens, pleuralEffusion, unresponsiveToTherapy);
        ChestCtResult ct = evaluateChestCtIndication(careSetting, riskProfile);

        List<Pathogen> topList = new ArrayList<>();
        for (Pathogen p : filter2.rankedPathogens) {
            if (p.getScore() > 0 && topList.size() < 8) {
                topList.add(p);
            }
        }
        if (topList.isEmpty()) {
            for (int i = 0; i < Math.min(5, filter2.rankedPathogens.size()); i++) {
                topList.add(filter2.rankedPathogens.get(i));
            }
        }

        PathogenEngineResult res = new PathogenEngineResult();
        res.setCareSetting(careSetting);
        res.setCandidateSetACount(setACount);
        res.setCandidateSetB(filter2.rankedPathogens);
        res.setTopPathogens(topList);
        res.setGeneralLabOrders(micro.generalOrders);
        res.setSpecificLabOrders(micro.specificOrders);
        res.setChestCtIndicated(ct.isIndicated);
        res.setChestCtReasons(ct.reasons);
        res.setFungalWarning(micro.fungalWarning);
        res.setClinicalRationale(filter2.rationale);

        return res;
    }

    public PathogenEngineResult evaluateStep2(CareSetting careSetting, ClinicalRiskProfile riskProfile, boolean pleuralEffusion) {
        return evaluateStep2(careSetting, riskProfile, pleuralEffusion, false);
    }
}
