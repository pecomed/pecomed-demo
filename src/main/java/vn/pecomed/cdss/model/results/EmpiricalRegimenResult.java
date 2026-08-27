package vn.pecomed.cdss.model.results;

import vn.pecomed.cdss.model.enums.CareSetting;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of Step 4 Empirical Antibiotic Therapy (Provincial level).
 */
public class EmpiricalRegimenResult {
    private String hospitalLevel = "Tuyến Tỉnh (Provincial Hospital)";
    private CareSetting careSetting;
    private String regimenName = "";
    private String targetProfile = "";
    private List<AntibioticInfo> primaryRegimen = new ArrayList<>();
    private List<AntibioticInfo> oralStepDownOptions = new ArrayList<>();
    private List<AntibioticInfo> alternativeAllergyRegimen = new ArrayList<>();
    private List<AntibioticInfo> addOnRegimen = new ArrayList<>();
    private String earlyCorticosteroidRecommendation;
    private String respiratorySupportRecommendation;
    private String biomarkerMonitoringRecommendation;
    private List<String> specialWarnings = new ArrayList<>();
    private List<String> monitoringInstructions = new ArrayList<>();

    public EmpiricalRegimenResult() {
    }

    public String getHospitalLevel() {
        return hospitalLevel;
    }

    public void setHospitalLevel(String hospitalLevel) {
        this.hospitalLevel = hospitalLevel;
    }

    public CareSetting getCareSetting() {
        return careSetting;
    }

    public void setCareSetting(CareSetting careSetting) {
        this.careSetting = careSetting;
    }

    public String getRegimenName() {
        return regimenName;
    }

    public void setRegimenName(String regimenName) {
        this.regimenName = regimenName;
    }

    public String getTargetProfile() {
        return targetProfile;
    }

    public void setTargetProfile(String targetProfile) {
        this.targetProfile = targetProfile;
    }

    public List<AntibioticInfo> getPrimaryRegimen() {
        return primaryRegimen;
    }

    public void setPrimaryRegimen(List<AntibioticInfo> primaryRegimen) {
        this.primaryRegimen = primaryRegimen;
    }

    public List<AntibioticInfo> getPrimaryDrugs() {
        return primaryRegimen;
    }

    public void setPrimaryDrugs(List<AntibioticInfo> primaryDrugs) {
        this.primaryRegimen = primaryDrugs;
    }

    public List<AntibioticInfo> getOralStepDownOptions() {
        return oralStepDownOptions;
    }

    public void setOralStepDownOptions(List<AntibioticInfo> oralStepDownOptions) {
        this.oralStepDownOptions = oralStepDownOptions;
    }

    public List<AntibioticInfo> getAlternativeAllergyRegimen() {
        return alternativeAllergyRegimen;
    }

    public void setAlternativeAllergyRegimen(List<AntibioticInfo> alternativeAllergyRegimen) {
        this.alternativeAllergyRegimen = alternativeAllergyRegimen;
    }

    public List<AntibioticInfo> getAlternativeDrugs() {
        return alternativeAllergyRegimen;
    }

    public void setAlternativeDrugs(List<AntibioticInfo> alternativeDrugs) {
        this.alternativeAllergyRegimen = alternativeDrugs;
    }

    public List<AntibioticInfo> getAddOnRegimen() {
        return addOnRegimen;
    }

    public void setAddOnRegimen(List<AntibioticInfo> addOnRegimen) {
        this.addOnRegimen = addOnRegimen;
    }

    public List<AntibioticInfo> getAddOnDrugs() {
        return addOnRegimen;
    }

    public void setAddOnDrugs(List<AntibioticInfo> addOnDrugs) {
        this.addOnRegimen = addOnDrugs;
    }

    public String getEarlyCorticosteroidRecommendation() {
        return earlyCorticosteroidRecommendation;
    }

    public void setEarlyCorticosteroidRecommendation(String earlyCorticosteroidRecommendation) {
        this.earlyCorticosteroidRecommendation = earlyCorticosteroidRecommendation;
    }

    public String getRespiratorySupportRecommendation() {
        return respiratorySupportRecommendation;
    }

    public void setRespiratorySupportRecommendation(String respiratorySupportRecommendation) {
        this.respiratorySupportRecommendation = respiratorySupportRecommendation;
    }

    public String getBiomarkerMonitoringRecommendation() {
        return biomarkerMonitoringRecommendation;
    }

    public void setBiomarkerMonitoringRecommendation(String biomarkerMonitoringRecommendation) {
        this.biomarkerMonitoringRecommendation = biomarkerMonitoringRecommendation;
    }

    public List<String> getSpecialWarnings() {
        return specialWarnings;
    }

    public void setSpecialWarnings(List<String> specialWarnings) {
        this.specialWarnings = specialWarnings;
    }

    public List<String> getMonitoringInstructions() {
        return monitoringInstructions;
    }

    public void setMonitoringInstructions(List<String> monitoringInstructions) {
        this.monitoringInstructions = monitoringInstructions;
    }
}
