package vn.pecomed.cdss.model.results;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of Step 5 72h Treatment Response & Procalcitonin Kinetics Monitoring.
 */
public class TreatmentResponse72hResult {
    private boolean isTreatmentFailure = false;
    private int failureSignsCount = 0;
    private List<String> failureSignsDetected = new ArrayList<>();
    private String pctInterpretation = "";
    private List<String> recommendedActions = new ArrayList<>();
    private String status = "";

    public TreatmentResponse72hResult() {
    }

    public boolean isTreatmentFailure() {
        return isTreatmentFailure;
    }

    public void setTreatmentFailure(boolean treatmentFailure) {
        isTreatmentFailure = treatmentFailure;
    }

    public int getFailureSignsCount() {
        return failureSignsCount;
    }

    public void setFailureSignsCount(int failureSignsCount) {
        this.failureSignsCount = failureSignsCount;
    }

    public List<String> getFailureSignsDetected() {
        return failureSignsDetected;
    }

    public void setFailureSignsDetected(List<String> failureSignsDetected) {
        this.failureSignsDetected = failureSignsDetected;
    }

    public List<String> getWarnings() {
        return failureSignsDetected;
    }

    public void setWarnings(List<String> warnings) {
        this.failureSignsDetected = warnings;
    }

    public String getPctInterpretation() {
        return pctInterpretation;
    }

    public void setPctInterpretation(String pctInterpretation) {
        this.pctInterpretation = pctInterpretation;
    }

    public List<String> getRecommendedActions() {
        return recommendedActions;
    }

    public void setRecommendedActions(List<String> recommendedActions) {
        this.recommendedActions = recommendedActions;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
