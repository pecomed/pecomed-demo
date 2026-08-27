package vn.pecomed.cdss.model.results;

import vn.pecomed.cdss.model.enums.CareSetting;
import vn.pecomed.cdss.model.enums.SeverityLevel;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of Step 1 Severity Assessment & Triage.
 */
public class SeverityAssessmentResult {
    // Scores
    private int crb65Score;
    private List<String> crb65Details = new ArrayList<>();
    private Integer curb65Score;
    private List<String> curb65Details = new ArrayList<>();
    private int psiScore;
    private String psiClass = "";
    private List<String> psiDetails = new ArrayList<>();
    private int smartCopScore;
    private String smartCopRisk = "";
    private List<String> smartCopDetails = new ArrayList<>();

    // ATS / IDSA
    private int atsMajorCount;
    private List<String> atsMajorCriteriaMet = new ArrayList<>();
    private int atsMinorCount;
    private List<String> atsMinorCriteriaMet = new ArrayList<>();
    private boolean atsSevereCap;

    // Recommendations
    private CareSetting recommendedCareSetting;
    private SeverityLevel severityLevel;
    private List<String> syndromeSummary = new ArrayList<>();
    private List<String> routineLabOrders = new ArrayList<>();
    private List<String> clinicalNotes = new ArrayList<>();

    public SeverityAssessmentResult() {
    }

    public int getCrb65Score() {
        return crb65Score;
    }

    public void setCrb65Score(int crb65Score) {
        this.crb65Score = crb65Score;
    }

    public List<String> getCrb65Details() {
        return crb65Details;
    }

    public void setCrb65Details(List<String> crb65Details) {
        this.crb65Details = crb65Details;
    }

    public Integer getCurb65Score() {
        return curb65Score;
    }

    public void setCurb65Score(Integer curb65Score) {
        this.curb65Score = curb65Score;
    }

    public List<String> getCurb65Details() {
        return curb65Details;
    }

    public void setCurb65Details(List<String> curb65Details) {
        this.curb65Details = curb65Details;
    }

    public int getPsiScore() {
        return psiScore;
    }

    public void setPsiScore(int psiScore) {
        this.psiScore = psiScore;
    }

    public String getPsiClass() {
        return psiClass;
    }

    public void setPsiClass(String psiClass) {
        this.psiClass = psiClass;
    }

    public List<String> getPsiDetails() {
        return psiDetails;
    }

    public void setPsiDetails(List<String> psiDetails) {
        this.psiDetails = psiDetails;
    }

    public int getSmartCopScore() {
        return smartCopScore;
    }

    public void setSmartCopScore(int smartCopScore) {
        this.smartCopScore = smartCopScore;
    }

    public String getSmartCopRisk() {
        return smartCopRisk;
    }

    public void setSmartCopRisk(String smartCopRisk) {
        this.smartCopRisk = smartCopRisk;
    }

    public List<String> getSmartCopDetails() {
        return smartCopDetails;
    }

    public void setSmartCopDetails(List<String> smartCopDetails) {
        this.smartCopDetails = smartCopDetails;
    }

    public int getAtsMajorCount() {
        return atsMajorCount;
    }

    public void setAtsMajorCount(int atsMajorCount) {
        this.atsMajorCount = atsMajorCount;
    }

    public List<String> getAtsMajorCriteriaMet() {
        return atsMajorCriteriaMet;
    }

    public void setAtsMajorCriteriaMet(List<String> atsMajorCriteriaMet) {
        this.atsMajorCriteriaMet = atsMajorCriteriaMet;
    }

    public int getAtsMinorCount() {
        return atsMinorCount;
    }

    public void setAtsMinorCount(int atsMinorCount) {
        this.atsMinorCount = atsMinorCount;
    }

    public List<String> getAtsMinorCriteriaMet() {
        return atsMinorCriteriaMet;
    }

    public void setAtsMinorCriteriaMet(List<String> atsMinorCriteriaMet) {
        this.atsMinorCriteriaMet = atsMinorCriteriaMet;
    }

    public boolean isAtsSevereCap() {
        return atsSevereCap;
    }

    public void setAtsSevereCap(boolean atsSevereCap) {
        this.atsSevereCap = atsSevereCap;
    }

    public CareSetting getRecommendedCareSetting() {
        return recommendedCareSetting;
    }

    public void setRecommendedCareSetting(CareSetting recommendedCareSetting) {
        this.recommendedCareSetting = recommendedCareSetting;
    }

    public SeverityLevel getSeverityLevel() {
        return severityLevel;
    }

    public void setSeverityLevel(SeverityLevel severityLevel) {
        this.severityLevel = severityLevel;
    }

    public List<String> getSyndromeSummary() {
        return syndromeSummary;
    }

    public void setSyndromeSummary(List<String> syndromeSummary) {
        this.syndromeSummary = syndromeSummary;
    }

    public List<String> getRoutineLabOrders() {
        return routineLabOrders;
    }

    public void setRoutineLabOrders(List<String> routineLabOrders) {
        this.routineLabOrders = routineLabOrders;
    }

    public List<String> getClinicalNotes() {
        return clinicalNotes;
    }

    public void setClinicalNotes(List<String> clinicalNotes) {
        this.clinicalNotes = clinicalNotes;
    }
}
