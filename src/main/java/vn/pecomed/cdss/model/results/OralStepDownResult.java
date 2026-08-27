package vn.pecomed.cdss.model.results;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Result of Step 5 Oral Step-down (IV to PO Switch) 7 Criteria Evaluation.
 */
public class OralStepDownResult {
    private boolean isEligible = false;
    private int metCriteriaCount = 0;
    private int totalCriteriaCount = 7;
    private Map<String, Boolean> checklistDetails = new LinkedHashMap<>();
    private List<String> passedCriteria = new ArrayList<>();
    private List<String> failedCriteria = new ArrayList<>();
    private String clinicalAdvice = "";

    public OralStepDownResult() {
    }

    public boolean isEligible() {
        return isEligible;
    }

    public void setEligible(boolean eligible) {
        isEligible = eligible;
    }

    public int getMetCriteriaCount() {
        return metCriteriaCount;
    }

    public void setMetCriteriaCount(int metCriteriaCount) {
        this.metCriteriaCount = metCriteriaCount;
    }

    public int getTotalCriteriaCount() {
        return totalCriteriaCount;
    }

    public void setTotalCriteriaCount(int totalCriteriaCount) {
        this.totalCriteriaCount = totalCriteriaCount;
    }

    public Map<String, Boolean> getChecklistDetails() {
        return checklistDetails;
    }

    public void setChecklistDetails(Map<String, Boolean> checklistDetails) {
        this.checklistDetails = checklistDetails;
    }

    public List<String> getPassedCriteria() {
        return passedCriteria;
    }

    public void setPassedCriteria(List<String> passedCriteria) {
        this.passedCriteria = passedCriteria;
    }

    public List<String> getFailedCriteria() {
        return failedCriteria;
    }

    public void setFailedCriteria(List<String> failedCriteria) {
        this.failedCriteria = failedCriteria;
    }

    public String getClinicalAdvice() {
        return clinicalAdvice;
    }

    public void setClinicalAdvice(String clinicalAdvice) {
        this.clinicalAdvice = clinicalAdvice;
    }
}
