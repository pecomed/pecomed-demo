package vn.pecomed.cdss.engine;

import vn.pecomed.cdss.model.enums.CareSetting;
import vn.pecomed.cdss.model.results.*;

/**
 * Unified Master Orchestrator for PECOMED CAP CDSS.
 * Executes the complete 5-step clinical reasoning and decision support pipeline on a PatientCase.
 */
public class PecomedCdssMaster {

    private final Step1SeverityEngine severityEngine;
    private final Step2PathogenEngine pathogenEngine;
    private final Step3ExclusionEngine exclusionEngine;
    private final Step4EmpiricalEngine empiricalEngine;
    private final Step5TargetedEngine targetedEngine;

    public PecomedCdssMaster() {
        this.severityEngine = new Step1SeverityEngine();
        this.pathogenEngine = new Step2PathogenEngine();
        this.exclusionEngine = new Step3ExclusionEngine();
        this.empiricalEngine = new Step4EmpiricalEngine();
        this.targetedEngine = new Step5TargetedEngine();
    }

    public Step1SeverityEngine getSeverityEngine() {
        return severityEngine;
    }

    public Step2PathogenEngine getPathogenEngine() {
        return pathogenEngine;
    }

    public Step3ExclusionEngine getExclusionEngine() {
        return exclusionEngine;
    }

    public Step4EmpiricalEngine getEmpiricalEngine() {
        return empiricalEngine;
    }

    public Step5TargetedEngine getTargetedEngine() {
        return targetedEngine;
    }

    public FullCdssReport processCase(PatientCase patientCase) {
        if (patientCase == null) {
            throw new IllegalArgumentException("PatientCase cannot be null");
        }

        // --- Step 1: Severity Assessment & Triage ---
        SeverityAssessmentResult step1 = severityEngine.evaluateStep1(
                patientCase.getAge(),
                patientCase.getGender(),
                patientCase.getVitals(),
                patientCase.getComorbidities(),
                patientCase.getLabs(),
                patientCase.getImaging(),
                patientCase.getSymptoms()
        );
        CareSetting careSetting = step1.getRecommendedCareSetting();

        // --- Step 2: Pathogen Prediction & Microbiology Orders ---
        boolean pleuralEffusion = patientCase.getImaging() != null && patientCase.getImaging().isPleuralEffusion();
        PathogenEngineResult step2 = pathogenEngine.evaluateStep2(
                careSetting,
                patientCase.getRiskProfile(),
                pleuralEffusion
        );

        // Pathogen suspicion signals for Step 4
        boolean suspectPseudo = step2.getTopPathogens().stream()
                .anyMatch(p -> "P_AERUGINOSA".equals(p.getId()) && p.getScore() >= 2);
        boolean suspectMrsa = step2.getTopPathogens().stream()
                .anyMatch(p -> ("MRSA".equals(p.getId()) || "S_AUREUS".equals(p.getId())) && p.getScore() >= 3);
        boolean viralPos = step2.getTopPathogens().stream()
                .anyMatch(p -> ("INFLUENZA".equals(p.getId()) || "SARS_COV_2".equals(p.getId()) || "RSV".equals(p.getId())) && p.getScore() >= 5);

        // --- Step 4: Empirical Antibiotic Therapy (Tuyến Tỉnh) ---
        boolean hasComorb = patientCase.getComorbidities() != null && patientCase.getComorbidities().hasAnyMajorComorbidity();
        boolean abxPast3m = patientCase.getRiskProfile() != null && patientCase.getRiskProfile().isPriorAntibioticsPast3m();

        Step4EmpiricalEngine.Step4InputData step4Input = new Step4EmpiricalEngine.Step4InputData();
        step4Input.careSetting = careSetting;
        step4Input.age = patientCase.getAge();
        step4Input.hasComorbidities = hasComorb;
        step4Input.antibioticsInPast3m = abxPast3m;
        step4Input.suspectPseudomonas = suspectPseudo;
        step4Input.suspectMrsa = suspectMrsa;
        step4Input.viralTestPositive = viralPos;
        step4Input.viralTestNegative = !viralPos;
        step4Input.spo2 = patientCase.getVitals() != null ? patientCase.getVitals().getSpo2() : 98.0;
        step4Input.within24hIcu = (careSetting == CareSetting.ICU);

        EmpiricalRegimenResult step4 = empiricalEngine.evaluateStep4(step4Input);

        // --- Step 3: Exclusion & Differential Diagnosis ---
        ExclusionAssessmentResult step3 = exclusionEngine.evaluateStep3(patientCase.getExclusionTriggers());

        // --- Step 5: Targeted Definitive Therapy (if pathogen identified) ---
        TargetedRegimenResult step5 = null;
        if (patientCase.getIdentifiedPathogen() != null && !patientCase.getIdentifiedPathogen().trim().isEmpty()) {
            step5 = resolveStep5Targeted(patientCase);
        }

        // Step 5 Oral Step-down Check (if values provided)
        OralStepDownResult oralStepDown = null;
        if (patientCase.getStepDownTemp() != null) {
            double temp = patientCase.getStepDownTemp();
            int hr = patientCase.getStepDownHr() != null ? patientCase.getStepDownHr() : 80;
            int rr = patientCase.getStepDownRr() != null ? patientCase.getStepDownRr() : 18;
            int sbp = patientCase.getStepDownSbp() != null ? patientCase.getStepDownSbp() : 120;
            double spo2 = patientCase.getStepDownSpo2() != null ? patientCase.getStepDownSpo2() : 96.0;
            boolean canEat = patientCase.getStepDownCanEat() == null || patientCase.getStepDownCanEat();
            boolean normalMental = patientCase.getStepDownNormalMental() == null || patientCase.getStepDownNormalMental();

            oralStepDown = targetedEngine.evaluateOralStepDown(temp, hr, rr, sbp, spo2, canEat, normalMental);
        }

        // Step 5 72h Response Monitoring (if values provided)
        TreatmentResponse72hResult mon72h = null;
        if (patientCase.getMonHrGt125OrRrGt33() != null || patientCase.getMonPctD0() != null || patientCase.getMonPctD3() != null) {
            boolean hrRr = Boolean.TRUE.equals(patientCase.getMonHrGt125OrRrGt33());
            boolean bp = Boolean.TRUE.equals(patientCase.getMonBpLt9060());
            boolean img = Boolean.TRUE.equals(patientCase.getMonImagingWorsening());
            boolean ats = Boolean.TRUE.equals(patientCase.getMonAtsScoreIncreased());
            boolean resp = Boolean.TRUE.equals(patientCase.getMonRespFailureWorsening());

            mon72h = targetedEngine.evaluate72hResponse(hrRr, bp, img, ats, resp,
                    patientCase.getMonPctD0(), patientCase.getMonPctD3(), patientCase.getMonPctD5D7());
        }

        return new FullCdssReport(patientCase, step1, step2, step3, step4, step5, oralStepDown, mon72h);
    }

    private TargetedRegimenResult resolveStep5Targeted(PatientCase patientCase) {
        String p = patientCase.getIdentifiedPathogen().toUpperCase();

        if (p.contains("PNEUMONIAE") && !p.contains("MYCOPLASMA") && !p.contains("CHLAMYDIA") && !p.contains("KLEBSIELLA")) {
            double mic = patientCase.getMicPenicillin() != null ? patientCase.getMicPenicillin() : 1.0;
            return targetedEngine.getSpneumoniaeRegimen(mic);
        } else if (p.contains("INFLUENZAE") || p.contains("CATARRHALIS")) {
            return targetedEngine.getHinfluenzaeRegimen(patientCase.isBetaLactamasePositive());
        } else if (p.contains("AUREUS") || p.contains("STAPH") || p.contains("MRSA")) {
            return targetedEngine.getSaureusRegimen(patientCase.isMrsa() || p.contains("MRSA"), patientCase.isBacteremia());
        } else if (p.contains("KLEBSIELLA") || p.contains("ENTEROBACTER")) {
            return targetedEngine.getKlebsiellaRegimen(patientCase.isEsbl(), patientCase.isCarbapenemResistant());
        } else if (p.contains("AERUGINOSA") || p.contains("PSEUDOMONAS")) {
            return targetedEngine.getPaeruginosaRegimen(patientCase.isPseudomonasResistant(), false);
        } else if (p.contains("PSEUDOMALLEI") || p.contains("WHITMORE") || p.contains("MELIOIDOSIS")) {
            boolean multilobar = patientCase.getImaging() != null && patientCase.getImaging().isMultilobarInfiltrates();
            return targetedEngine.getWhitmoreRegimen(
                    patientCase.isPregnant(),
                    patientCase.isBacteremia(),
                    multilobar,
                    patientCase.isHasArthritisAbscess(),
                    patientCase.isHasOsteomyelitis()
            );
        } else if (p.contains("MYCOPLASMA") || p.contains("CHLAMYDIA") || p.contains("LEGIONELLA") || p.contains("ATYPICAL")) {
            String agent = patientCase.getAtypicalAgent() != null ? patientCase.getAtypicalAgent() : p;
            return targetedEngine.getAtypicalRegimen(agent, patientCase.isSevereOrImmunocompromised());
        } else if (p.contains("VIRUS") || p.contains("FLU") || p.contains("SARS") || p.contains("COVID") || p.contains("RSV")) {
            return targetedEngine.getVirusRegimen(true, patientCase.isCannotSwallow(), patientCase.isCrclGt60(), patientCase.isSevereOrImmunocompromised());
        }

        // Fallback default to S. pneumoniae
        return targetedEngine.getSpneumoniaeRegimen(1.0);
    }
}
