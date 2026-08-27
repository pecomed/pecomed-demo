package vn.pecomed.cdss.model.results;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of Step 3 Differential Diagnosis & Exclusion Assessment.
 */
public class ExclusionAssessmentResult {
    private boolean unknownEtiology = true;
    private String summaryMessage = "";
    private List<ExclusionCondition> suspectedConditions = new ArrayList<>();
    private List<ExclusionCondition> allConditions = new ArrayList<>();
    private List<String> urgentRedFlags = new ArrayList<>();
    private List<String> diagnosticWorkupPlan = new ArrayList<>();

    public ExclusionAssessmentResult() {
    }

    public boolean isUnknownEtiology() {
        return unknownEtiology;
    }

    public void setUnknownEtiology(boolean unknownEtiology) {
        this.unknownEtiology = unknownEtiology;
    }

    public String getSummaryMessage() {
        return summaryMessage;
    }

    public void setSummaryMessage(String summaryMessage) {
        this.summaryMessage = summaryMessage;
    }

    public List<ExclusionCondition> getSuspectedConditions() {
        return suspectedConditions;
    }

    public void setSuspectedConditions(List<ExclusionCondition> suspectedConditions) {
        this.suspectedConditions = suspectedConditions;
    }

    public List<ExclusionCondition> getAllConditions() {
        return allConditions;
    }

    public void setAllConditions(List<ExclusionCondition> allConditions) {
        this.allConditions = allConditions;
    }

    public List<String> getUrgentRedFlags() {
        return urgentRedFlags;
    }

    public void setUrgentRedFlags(List<String> urgentRedFlags) {
        this.urgentRedFlags = urgentRedFlags;
    }

    public List<String> getUrgentReferrals() {
        return urgentRedFlags;
    }

    public void setUrgentReferrals(List<String> referrals) {
        this.urgentRedFlags = referrals;
    }

    public List<String> getDiagnosticWorkupPlan() {
        return diagnosticWorkupPlan;
    }

    public void setDiagnosticWorkupPlan(List<String> diagnosticWorkupPlan) {
        this.diagnosticWorkupPlan = diagnosticWorkupPlan;
    }
}
