package vn.pecomed.cdss.cli;

import vn.pecomed.cdss.engine.PecomedCdssMaster;
import vn.pecomed.cdss.model.enums.Gender;
import vn.pecomed.cdss.model.results.FullCdssReport;
import vn.pecomed.cdss.model.results.PatientCase;
import vn.pecomed.cdss.model.vitals.*;

/**
 * Command-line demo application for PECOMED CAP CDSS.
 */
public class PecomedCliApp {

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("     PECOMED CAP CDSS - COMMUNITY-ACQUIRED PNEUMONIA CLINICAL DECISION SYSTEM   ");
        System.out.println("         Guidelines: Vietnam Respiratory Society / Ministry of Health           ");
        System.out.println("================================================================================\n");

        PecomedCdssMaster master = new PecomedCdssMaster();

        // Sample Case 1: Outpatient Mild CAP
        System.out.println(">>> DEMO CASE 1: Bệnh nhân Ngoại trú (Nhẹ - Outpatient)");
        PatientCase case1 = PatientCase.builder()
                .patientId("BN-2026-0101")
                .fullName("Trần Thị Mai")
                .age(28)
                .gender(Gender.FEMALE)
                .vitals(PatientVitals.builder()
                        .respiratoryRate(18)
                        .systolicBp(115)
                        .diastolicBp(75)
                        .temperature(38.0)
                        .spo2(98.0)
                        .build())
                .symptoms(ClinicalSymptoms.builder()
                        .coughDry(true)
                        .fever(38.0)
                        .build())
                .build();

        FullCdssReport report1 = master.processCase(case1);
        System.out.println("- Nơi điều trị: " + report1.getStep1().getRecommendedCareSetting().getDescription());
        System.out.println("- Mức độ nặng: " + report1.getStep1().getSeverityLevel().getDescription());
        System.out.println("- Phác đồ kinh nghiệm: " + report1.getStep4().getRegimenName());
        System.out.println();

        // Sample Case 2: Severe ICU Melioidosis Case
        System.out.println(">>> DEMO CASE 2: Bệnh nhân ICU Rất nặng - Nhiễm Whitmore (B. pseudomallei)");
        PatientCase case2 = PatientCase.builder()
                .patientId("BN-2026-0889")
                .fullName("Nguyễn Văn An")
                .age(65)
                .gender(Gender.MALE)
                .vitals(PatientVitals.builder()
                        .respiratoryRate(32)
                        .systolicBp(85)
                        .diastolicBp(50)
                        .heartRate(126)
                        .temperature(39.5)
                        .spo2(86.0)
                        .alteredMentalStatus(true)
                        .onAggressiveFluidResuscitation(true)
                        .build())
                .comorbidities(PatientComorbidities.builder()
                        .diabetes(true)
                        .copdChronicLung(true)
                        .build())
                .riskProfile(ClinicalRiskProfile.builder()
                        .smoking(true)
                        .diabetes(true)
                        .rainySeasonMudWater(true)
                        .priorAntibioticsPast3m(true)
                        .structuralLungDisease(true)
                        .build())
                .labs(PatientLabs.builder()
                        .ureaMmolL(12.4)
                        .arterialPh(7.29)
                        .sodiumMmolL(127.0)
                        .glucoseMmolL(18.5)
                        .wbcGL(3.4)
                        .plateletsGL(88.0)
                        .pao2Fio2Ratio(185.0)
                        .procalcitoninNgMl(8.5)
                        .build())
                .imaging(PatientImagingAndIntervention.builder()
                        .multilobarInfiltrates(true)
                        .pleuralEffusion(true)
                        .septicShockVasopressors(true)
                        .build())
                .identifiedPathogen("B_PSEUDOMALLEI")
                .isBacteremia(true)
                .stepDownTemp(37.0)
                .stepDownHr(82)
                .stepDownRr(19)
                .stepDownSbp(115)
                .stepDownSpo2(96.0)
                .stepDownCanEat(true)
                .stepDownNormalMental(true)
                .monPctD0(8.5)
                .monPctD3(1.2)
                .build();

        FullCdssReport report2 = master.processCase(case2);
        System.out.println(report2.toMarkdownReport());

        System.out.println("================================================================================");
        System.out.println("JSON Output Preview:");
        System.out.println(report2.jsonExport());
    }
}
