package vn.pecomed.cdss.model.results;

import vn.pecomed.cdss.model.enums.Gender;
import vn.pecomed.cdss.model.vitals.*;

/**
 * Complete clinical case definition for a CAP patient.
 */
public class PatientCase {
    // 1. Administrative
    private String patientId = "";
    private String fullName = "";
    private int age = 0;
    private Gender gender = Gender.MALE;

    // 2. Clinical Findings
    private PatientVitals vitals = new PatientVitals();
    private ClinicalSymptoms symptoms = new ClinicalSymptoms();

    // 3. Comorbidities & Risk Factors
    private PatientComorbidities comorbidities = new PatientComorbidities();
    private ClinicalRiskProfile riskProfile = new ClinicalRiskProfile();

    // 4. Diagnostic Tests & Imaging
    private PatientLabs labs = new PatientLabs();
    private PatientImagingAndIntervention imaging = new PatientImagingAndIntervention();

    // 5. Differential Diagnosis & Exclusion Triggers
    private ExclusionRiskTriggers exclusionTriggers = new ExclusionRiskTriggers();

    // 6. Step 5 Microbiological / Targeted inputs (if available)
    private String identifiedPathogen;
    private Double micPenicillin;
    private boolean isMrsa = false;
    private boolean isEsbl = false;
    private boolean isCarbapenemResistant = false;
    private boolean isPseudomonasResistant = false;
    private boolean isBacteremia = false;
    private boolean isPregnant = false;
    private boolean hasArthritisAbscess = false;
    private boolean hasOsteomyelitis = false;
    private boolean isBetaLactamasePositive = false;
    private String atypicalAgent = "MYCOPLASMA";
    private boolean cannotSwallow = false;
    private boolean crclGt60 = true;
    private boolean isSevereOrImmunocompromised = false;

    // 7. Step 5 Oral Step-down & 72h Response inputs
    private Double stepDownTemp;
    private Integer stepDownHr;
    private Integer stepDownRr;
    private Integer stepDownSbp;
    private Double stepDownSpo2;
    private Boolean stepDownCanEat;
    private Boolean stepDownNormalMental;

    private Boolean monHrGt125OrRrGt33;
    private Boolean monBpLt9060;
    private Boolean monImagingWorsening;
    private Boolean monAtsScoreIncreased;
    private Boolean monRespFailureWorsening;
    private Double monPctD0;
    private Double monPctD3;
    private Double monPctD5D7;

    public PatientCase() {
    }

    public PatientCase(String patientId, String fullName, int age, Gender gender) {
        this.patientId = patientId;
        this.fullName = fullName;
        this.age = age;
        this.gender = gender;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPatientName() {
        return fullName;
    }

    public void setPatientName(String name) {
        this.fullName = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public PatientVitals getVitals() {
        return vitals;
    }

    public void setVitals(PatientVitals vitals) {
        this.vitals = vitals;
    }

    public ClinicalSymptoms getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(ClinicalSymptoms symptoms) {
        this.symptoms = symptoms;
    }

    public PatientComorbidities getComorbidities() {
        return comorbidities;
    }

    public void setComorbidities(PatientComorbidities comorbidities) {
        this.comorbidities = comorbidities;
    }

    public ClinicalRiskProfile getRiskProfile() {
        return riskProfile;
    }

    public void setRiskProfile(ClinicalRiskProfile riskProfile) {
        this.riskProfile = riskProfile;
    }

    public PatientLabs getLabs() {
        return labs;
    }

    public void setLabs(PatientLabs labs) {
        this.labs = labs;
    }

    public PatientImagingAndIntervention getImaging() {
        return imaging;
    }

    public void setImaging(PatientImagingAndIntervention imaging) {
        this.imaging = imaging;
    }

    public ExclusionRiskTriggers getExclusionTriggers() {
        return exclusionTriggers;
    }

    public void setExclusionTriggers(ExclusionRiskTriggers exclusionTriggers) {
        this.exclusionTriggers = exclusionTriggers;
    }

    public ExclusionRiskTriggers getExclusionInputs() {
        return exclusionTriggers;
    }

    public void setExclusionInputs(ExclusionRiskTriggers triggers) {
        this.exclusionTriggers = triggers;
    }

    public String getIdentifiedPathogen() {
        return identifiedPathogen;
    }

    public void setIdentifiedPathogen(String identifiedPathogen) {
        this.identifiedPathogen = identifiedPathogen;
    }

    public Double getMicPenicillin() {
        return micPenicillin;
    }

    public void setMicPenicillin(Double micPenicillin) {
        this.micPenicillin = micPenicillin;
    }

    public boolean isMrsa() {
        return isMrsa;
    }

    public void setMrsa(boolean mrsa) {
        isMrsa = mrsa;
    }

    public boolean isEsbl() {
        return isEsbl;
    }

    public void setEsbl(boolean esbl) {
        isEsbl = esbl;
    }

    public boolean isCarbapenemResistant() {
        return isCarbapenemResistant;
    }

    public void setCarbapenemResistant(boolean carbapenemResistant) {
        isCarbapenemResistant = carbapenemResistant;
    }

    public boolean isPseudomonasResistant() {
        return isPseudomonasResistant;
    }

    public void setPseudomonasResistant(boolean pseudomonasResistant) {
        isPseudomonasResistant = pseudomonasResistant;
    }

    public boolean isBacteremia() {
        return isBacteremia;
    }

    public void setBacteremia(boolean bacteremia) {
        isBacteremia = bacteremia;
    }

    public boolean isPregnant() {
        return isPregnant;
    }

    public void setPregnant(boolean pregnant) {
        isPregnant = pregnant;
    }

    public boolean isHasArthritisAbscess() {
        return hasArthritisAbscess;
    }

    public void setHasArthritisAbscess(boolean hasArthritisAbscess) {
        this.hasArthritisAbscess = hasArthritisAbscess;
    }

    public boolean isHasOsteomyelitis() {
        return hasOsteomyelitis;
    }

    public void setHasOsteomyelitis(boolean hasOsteomyelitis) {
        this.hasOsteomyelitis = hasOsteomyelitis;
    }

    public boolean isBetaLactamasePositive() {
        return isBetaLactamasePositive;
    }

    public void setBetaLactamasePositive(boolean betaLactamasePositive) {
        isBetaLactamasePositive = betaLactamasePositive;
    }

    public String getAtypicalAgent() {
        return atypicalAgent;
    }

    public void setAtypicalAgent(String atypicalAgent) {
        this.atypicalAgent = atypicalAgent;
    }

    public boolean isCannotSwallow() {
        return cannotSwallow;
    }

    public void setCannotSwallow(boolean cannotSwallow) {
        this.cannotSwallow = cannotSwallow;
    }

    public boolean isCrclGt60() {
        return crclGt60;
    }

    public void setCrclGt60(boolean crclGt60) {
        this.crclGt60 = crclGt60;
    }

    public boolean isSevereOrImmunocompromised() {
        return isSevereOrImmunocompromised;
    }

    public void setSevereOrImmunocompromised(boolean severeOrImmunocompromised) {
        isSevereOrImmunocompromised = severeOrImmunocompromised;
    }

    public Double getStepDownTemp() {
        return stepDownTemp;
    }

    public void setStepDownTemp(Double stepDownTemp) {
        this.stepDownTemp = stepDownTemp;
    }

    public Integer getStepDownHr() {
        return stepDownHr;
    }

    public void setStepDownHr(Integer stepDownHr) {
        this.stepDownHr = stepDownHr;
    }

    public Integer getStepDownRr() {
        return stepDownRr;
    }

    public void setStepDownRr(Integer stepDownRr) {
        this.stepDownRr = stepDownRr;
    }

    public Integer getStepDownSbp() {
        return stepDownSbp;
    }

    public void setStepDownSbp(Integer stepDownSbp) {
        this.stepDownSbp = stepDownSbp;
    }

    public Double getStepDownSpo2() {
        return stepDownSpo2;
    }

    public void setStepDownSpo2(Double stepDownSpo2) {
        this.stepDownSpo2 = stepDownSpo2;
    }

    public Boolean getStepDownCanEat() {
        return stepDownCanEat;
    }

    public void setStepDownCanEat(Boolean stepDownCanEat) {
        this.stepDownCanEat = stepDownCanEat;
    }

    public Boolean getStepDownNormalMental() {
        return stepDownNormalMental;
    }

    public void setStepDownNormalMental(Boolean stepDownNormalMental) {
        this.stepDownNormalMental = stepDownNormalMental;
    }

    public Boolean getMonHrGt125OrRrGt33() {
        return monHrGt125OrRrGt33;
    }

    public void setMonHrGt125OrRrGt33(Boolean monHrGt125OrRrGt33) {
        this.monHrGt125OrRrGt33 = monHrGt125OrRrGt33;
    }

    public Boolean getMonBpLt9060() {
        return monBpLt9060;
    }

    public void setMonBpLt9060(Boolean monBpLt9060) {
        this.monBpLt9060 = monBpLt9060;
    }

    public Boolean getMonImagingWorsening() {
        return monImagingWorsening;
    }

    public void setMonImagingWorsening(Boolean monImagingWorsening) {
        this.monImagingWorsening = monImagingWorsening;
    }

    public Boolean getMonAtsScoreIncreased() {
        return monAtsScoreIncreased;
    }

    public void setMonAtsScoreIncreased(Boolean monAtsScoreIncreased) {
        this.monAtsScoreIncreased = monAtsScoreIncreased;
    }

    public Boolean getMonRespFailureWorsening() {
        return monRespFailureWorsening;
    }

    public void setMonRespFailureWorsening(Boolean monRespFailureWorsening) {
        this.monRespFailureWorsening = monRespFailureWorsening;
    }

    public Double getMonPctD0() {
        return monPctD0;
    }

    public void setMonPctD0(Double monPctD0) {
        this.monPctD0 = monPctD0;
    }

    public Double getMonPctD3() {
        return monPctD3;
    }

    public void setMonPctD3(Double monPctD3) {
        this.monPctD3 = monPctD3;
    }

    public Double getMonPctD5D7() {
        return monPctD5D7;
    }

    public void setMonPctD5D7(Double monPctD5D7) {
        this.monPctD5D7 = monPctD5D7;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PatientCase pc = new PatientCase();

        public Builder patientId(String id) { pc.setPatientId(id); return this; }
        public Builder fullName(String name) { pc.setFullName(name); return this; }
        public Builder patientName(String name) { pc.setFullName(name); return this; }
        public Builder age(int age) { pc.setAge(age); return this; }
        public Builder gender(Gender gender) { pc.setGender(gender); return this; }
        public Builder vitals(PatientVitals vitals) { pc.setVitals(vitals); return this; }
        public Builder symptoms(ClinicalSymptoms sym) { pc.setSymptoms(sym); return this; }
        public Builder comorbidities(PatientComorbidities comorb) { pc.setComorbidities(comorb); return this; }
        public Builder riskProfile(ClinicalRiskProfile rp) { pc.setRiskProfile(rp); return this; }
        public Builder labs(PatientLabs labs) { pc.setLabs(labs); return this; }
        public Builder imaging(PatientImagingAndIntervention img) { pc.setImaging(img); return this; }
        public Builder exclusionTriggers(ExclusionRiskTriggers ext) { pc.setExclusionTriggers(ext); return this; }
        public Builder exclusionInputs(ExclusionRiskTriggers ext) { pc.setExclusionTriggers(ext); return this; }
        public Builder identifiedPathogen(String pathogen) { pc.setIdentifiedPathogen(pathogen); return this; }
        public Builder micPenicillin(Double mic) { pc.setMicPenicillin(mic); return this; }
        public Builder isMrsa(boolean mrsa) { pc.setMrsa(mrsa); return this; }
        public Builder isEsbl(boolean esbl) { pc.setEsbl(esbl); return this; }
        public Builder isCarbapenemResistant(boolean cr) { pc.setCarbapenemResistant(cr); return this; }
        public Builder isPseudomonasResistant(boolean pr) { pc.setPseudomonasResistant(pr); return this; }
        public Builder isBacteremia(boolean bac) { pc.setBacteremia(bac); return this; }
        public Builder isPregnant(boolean preg) { pc.setPregnant(preg); return this; }
        public Builder hasArthritisAbscess(boolean aa) { pc.setHasArthritisAbscess(aa); return this; }
        public Builder hasOsteomyelitis(boolean om) { pc.setHasOsteomyelitis(om); return this; }
        public Builder isBetaLactamasePositive(boolean bl) { pc.setBetaLactamasePositive(bl); return this; }
        public Builder atypicalAgent(String agent) { pc.setAtypicalAgent(agent); return this; }
        public Builder cannotSwallow(boolean cs) { pc.setCannotSwallow(cs); return this; }
        public Builder crclGt60(boolean crcl) { pc.setCrclGt60(crcl); return this; }
        public Builder isSevereOrImmunocompromised(boolean sev) { pc.setSevereOrImmunocompromised(sev); return this; }

        public Builder stepDownTemp(Double temp) { pc.setStepDownTemp(temp); return this; }
        public Builder stepDownHr(Integer hr) { pc.setStepDownHr(hr); return this; }
        public Builder stepDownRr(Integer rr) { pc.setStepDownRr(rr); return this; }
        public Builder stepDownSbp(Integer sbp) { pc.setStepDownSbp(sbp); return this; }
        public Builder stepDownSpo2(Double spo2) { pc.setStepDownSpo2(spo2); return this; }
        public Builder stepDownCanEat(Boolean canEat) { pc.setStepDownCanEat(canEat); return this; }
        public Builder stepDownNormalMental(Boolean normalMental) { pc.setStepDownNormalMental(normalMental); return this; }

        public Builder monHrGt125OrRrGt33(Boolean val) { pc.setMonHrGt125OrRrGt33(val); return this; }
        public Builder monBpLt9060(Boolean val) { pc.setMonBpLt9060(val); return this; }
        public Builder monImagingWorsening(Boolean val) { pc.setMonImagingWorsening(val); return this; }
        public Builder monAtsScoreIncreased(Boolean val) { pc.setMonAtsScoreIncreased(val); return this; }
        public Builder monRespFailureWorsening(Boolean val) { pc.setMonRespFailureWorsening(val); return this; }
        public Builder monPctD0(Double val) { pc.setMonPctD0(val); return this; }
        public Builder monPctD3(Double val) { pc.setMonPctD3(val); return this; }
        public Builder monPctD5D7(Double val) { pc.setMonPctD5D7(val); return this; }

        public PatientCase build() {
            return pc;
        }
    }
}
