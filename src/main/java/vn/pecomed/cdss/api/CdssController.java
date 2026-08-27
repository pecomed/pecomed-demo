package vn.pecomed.cdss.api;

import org.springframework.web.bind.annotation.*;
import vn.pecomed.cdss.engine.*;
import vn.pecomed.cdss.model.enums.*;
import vn.pecomed.cdss.model.results.*;
import vn.pecomed.cdss.model.vitals.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cdss")
@CrossOrigin("*")
public class CdssController {

    private final PecomedCdssMaster master = new PecomedCdssMaster();

    @PostMapping("/evaluate")
    public FullCdssReport evaluateCase(@RequestBody PatientCase patientCase) {
        return master.processCase(patientCase);
    }

    public static class Step1Request {
        public int age;
        public Gender gender;
        public PatientVitals vitals;
        public PatientComorbidities comorbidities;
        public PatientLabs labs;
        public PatientImagingAndIntervention imaging;
        public ClinicalSymptoms symptoms;
    }

    @PostMapping("/step1/severity")
    public SeverityAssessmentResult evaluateStep1(@RequestBody Step1Request req) {
        return master.getSeverityEngine().evaluateStep1(
                req.age, req.gender, req.vitals, req.comorbidities, req.labs, req.imaging, req.symptoms
        );
    }

    public static class Step2Request {
        public CareSetting careSetting;
        public ClinicalRiskProfile riskProfile;
        public boolean pleuralEffusion;
    }

    @PostMapping("/step2/pathogen")
    public PathogenEngineResult evaluateStep2(@RequestBody Step2Request req) {
        return master.getPathogenEngine().evaluateStep2(req.careSetting, req.riskProfile, req.pleuralEffusion);
    }

    @PostMapping("/step3/exclusion")
    public ExclusionAssessmentResult evaluateStep3(@RequestBody ExclusionRiskTriggers req) {
        return master.getExclusionEngine().evaluateStep3(req);
    }

    @PostMapping("/step4/empirical")
    public EmpiricalRegimenResult evaluateStep4(@RequestBody Step4EmpiricalEngine.Step4InputData req) {
        return master.getEmpiricalEngine().evaluateStep4(req);
    }

    public static class Step5TargetedRequest {
        public String pathogenId;
        public Double micPenicillin;
        public boolean isMrsa;
        public boolean isEsbl;
        public boolean isCarbapenemResistant;
        public boolean isBacteremia;
        public boolean isPregnant;
        public boolean multilobar;
        public boolean hasArthritisAbscess;
        public boolean hasOsteomyelitis;
        public boolean isCysticFibrosis;
        public String atypicalAgent;
        public boolean cannotSwallow;
        public boolean crclGt60;
        public boolean isSevereOrImmunocompromised;
        public boolean isPseudomonasResistant;
    }

    @PostMapping("/step5/targeted")
    public TargetedRegimenResult evaluateStep5Targeted(@RequestBody Step5TargetedRequest req) {
        String p = req.pathogenId != null ? req.pathogenId.toUpperCase() : "";
        Step5TargetedEngine targetedEngine = master.getTargetedEngine();

        if (p.contains("PNEUMONIAE") && !p.contains("MYCOPLASMA") && !p.contains("CHLAMYDIA") && !p.contains("KLEBSIELLA")) {
            double mic = req.micPenicillin != null ? req.micPenicillin : 1.0;
            return targetedEngine.getSpneumoniaeRegimen(mic);
        } else if (p.contains("INFLUENZAE") || p.contains("CATARRHALIS")) {
            return targetedEngine.getHinfluenzaeRegimen(false); // Defaulting for simple req
        } else if (p.contains("AUREUS") || p.contains("STAPH") || p.contains("MRSA")) {
            return targetedEngine.getSaureusRegimen(req.isMrsa || p.contains("MRSA"), req.isBacteremia);
        } else if (p.contains("KLEBSIELLA") || p.contains("ENTEROBACTER")) {
            return targetedEngine.getKlebsiellaRegimen(req.isEsbl, req.isCarbapenemResistant);
        } else if (p.contains("AERUGINOSA") || p.contains("PSEUDOMONAS")) {
            return targetedEngine.getPaeruginosaRegimen(req.isPseudomonasResistant, false);
        } else if (p.contains("PSEUDOMALLEI") || p.contains("WHITMORE") || p.contains("MELIOIDOSIS")) {
            return targetedEngine.getWhitmoreRegimen(
                    req.isPregnant,
                    req.isBacteremia,
                    req.multilobar,
                    req.hasArthritisAbscess,
                    req.hasOsteomyelitis
            );
        } else if (p.contains("MYCOPLASMA") || p.contains("CHLAMYDIA") || p.contains("LEGIONELLA") || p.contains("ATYPICAL")) {
            String agent = req.atypicalAgent != null ? req.atypicalAgent : p;
            return targetedEngine.getAtypicalRegimen(agent, req.isSevereOrImmunocompromised);
        } else if (p.contains("VIRUS") || p.contains("FLU") || p.contains("SARS") || p.contains("COVID") || p.contains("RSV")) {
            return targetedEngine.getVirusRegimen(true, req.cannotSwallow, req.crclGt60, req.isSevereOrImmunocompromised);
        }

        return targetedEngine.getSpneumoniaeRegimen(1.0);
    }

    public static class OralStepDownRequest {
        public double temp;
        public int hr;
        public int rr;
        public int sbp;
        public double spo2;
        public boolean canEatAndSwallow;
        public boolean normalMentalStatus;
    }

    @PostMapping("/step5/oral-step-down")
    public OralStepDownResult evaluateOralStepDown(@RequestBody OralStepDownRequest req) {
        return master.getTargetedEngine().evaluateOralStepDown(
                req.temp, req.hr, req.rr, req.sbp, req.spo2, req.canEatAndSwallow, req.normalMentalStatus
        );
    }

    public static class Response72hRequest {
        public boolean hrGt125OrRrGt33;
        public boolean bpLt9060;
        public boolean imagingWorsening;
        public boolean atsScoreIncreased;
        public boolean respFailureWorsening;
        public Double pctD0;
        public Double pctD3;
        public Double pctD5D7;
    }

    @PostMapping("/step5/72h-response")
    public TreatmentResponse72hResult evaluate72hResponse(@RequestBody Response72hRequest req) {
        return master.getTargetedEngine().evaluate72hResponse(
                req.hrGt125OrRrGt33, req.bpLt9060, req.imagingWorsening, req.atsScoreIncreased, req.respFailureWorsening,
                req.pctD0, req.pctD3, req.pctD5D7
        );
    }

    @GetMapping("/health")
    public Map<String, String> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "PECOMED CAP CDSS");
        status.put("version", "1.0.0");
        return status;
    }
}
