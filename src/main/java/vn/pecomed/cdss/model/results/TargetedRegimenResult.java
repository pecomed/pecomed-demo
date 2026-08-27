package vn.pecomed.cdss.model.results;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of Step 5 Targeted Definitive Antibiotic Therapy based on Antibiogram.
 */
public class TargetedRegimenResult {
    private String pathogenId = "";
    private String pathogenName = "";
    private String conditionKey = "";
    private String conditionTitle = "";
    private List<AntibioticInfo> intravenousRegimen = new ArrayList<>();
    private List<AntibioticInfo> oralStepDownRegimen = new ArrayList<>();
    private List<AntibioticInfo> alternativeAllergyRegimen = new ArrayList<>();
    private String treatmentDurationText = "";
    private int durationDaysMin = 5;
    private int durationDaysMax = 7;
    private String aerosolProphylaxisRegimen;
    private List<String> clinicalMonitoringAdvice = new ArrayList<>();

    public TargetedRegimenResult() {
    }

    public String getPathogenId() {
        return pathogenId;
    }

    public void setPathogenId(String pathogenId) {
        this.pathogenId = pathogenId;
    }

    public String getPathogenName() {
        return pathogenName;
    }

    public void setPathogenName(String pathogenName) {
        this.pathogenName = pathogenName;
    }

    public String getConditionKey() {
        return conditionKey;
    }

    public void setConditionKey(String conditionKey) {
        this.conditionKey = conditionKey;
    }

    public String getConditionTitle() {
        return conditionTitle;
    }

    public void setConditionTitle(String conditionTitle) {
        this.conditionTitle = conditionTitle;
    }

    public List<AntibioticInfo> getIntravenousRegimen() {
        return intravenousRegimen;
    }

    public void setIntravenousRegimen(List<AntibioticInfo> intravenousRegimen) {
        this.intravenousRegimen = intravenousRegimen;
    }

    public List<AntibioticInfo> getPrimaryIvRegimen() {
        return intravenousRegimen;
    }

    public void setPrimaryIvRegimen(List<AntibioticInfo> primaryIvRegimen) {
        this.intravenousRegimen = primaryIvRegimen;
    }

    public List<AntibioticInfo> getOralStepDownRegimen() {
        return oralStepDownRegimen;
    }

    public void setOralStepDownRegimen(List<AntibioticInfo> oralStepDownRegimen) {
        this.oralStepDownRegimen = oralStepDownRegimen;
    }

    public List<AntibioticInfo> getAlternativeAllergyRegimen() {
        return alternativeAllergyRegimen;
    }

    public void setAlternativeAllergyRegimen(List<AntibioticInfo> alternativeAllergyRegimen) {
        this.alternativeAllergyRegimen = alternativeAllergyRegimen;
    }

    public String getTreatmentDurationText() {
        return treatmentDurationText;
    }

    public void setTreatmentDurationText(String treatmentDurationText) {
        this.treatmentDurationText = treatmentDurationText;
    }

    public String getTreatmentDuration() {
        return treatmentDurationText;
    }

    public void setTreatmentDuration(String treatmentDuration) {
        this.treatmentDurationText = treatmentDuration;
    }

    public int getDurationDaysMin() {
        return durationDaysMin;
    }

    public void setDurationDaysMin(int durationDaysMin) {
        this.durationDaysMin = durationDaysMin;
    }

    public int getDurationDaysMax() {
        return durationDaysMax;
    }

    public void setDurationDaysMax(int durationDaysMax) {
        this.durationDaysMax = durationDaysMax;
    }

    public String getAerosolProphylaxisRegimen() {
        return aerosolProphylaxisRegimen;
    }

    public void setAerosolProphylaxisRegimen(String aerosolProphylaxisRegimen) {
        this.aerosolProphylaxisRegimen = aerosolProphylaxisRegimen;
    }

    public List<String> getClinicalMonitoringAdvice() {
        return clinicalMonitoringAdvice;
    }

    public void setClinicalMonitoringAdvice(List<String> clinicalMonitoringAdvice) {
        this.clinicalMonitoringAdvice = clinicalMonitoringAdvice;
    }

    public List<String> getSpecificNotes() {
        return clinicalMonitoringAdvice;
    }

    public void setSpecificNotes(List<String> specificNotes) {
        this.clinicalMonitoringAdvice = specificNotes;
    }
}
