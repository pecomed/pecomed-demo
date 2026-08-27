package vn.pecomed.cdss.model.results;

import java.util.ArrayList;
import java.util.List;

/**
 * Exclusion condition candidate for differential diagnosis (Step 3).
 */
public class ExclusionCondition {
    private String id;
    private String vietnameseName = "";
    private String englishName = "";
    private boolean isSuspected = false;
    private int matchScore = 0;
    private String confidenceLevel = "";
    private List<String> matchedTriggers = new ArrayList<>();
    private List<String> keyDiagnosticTests = new ArrayList<>();
    private List<String> confirmationCriteria = new ArrayList<>();
    private List<String> recommendedAction = new ArrayList<>();

    public ExclusionCondition() {
    }

    public ExclusionCondition(String id, String vietnameseName, String englishName) {
        this.id = id;
        this.vietnameseName = vietnameseName;
        this.englishName = englishName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVietnameseName() {
        return vietnameseName;
    }

    public void setVietnameseName(String vietnameseName) {
        this.vietnameseName = vietnameseName;
    }

    public String getEnglishName() {
        return englishName;
    }

    public void setEnglishName(String englishName) {
        this.englishName = englishName;
    }

    public boolean isSuspected() {
        return isSuspected;
    }

    public void setSuspected(boolean suspected) {
        isSuspected = suspected;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public String getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(String confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public List<String> getMatchedTriggers() {
        return matchedTriggers;
    }

    public void setMatchedTriggers(List<String> matchedTriggers) {
        this.matchedTriggers = matchedTriggers;
    }

    // Aliases for compatibility
    public List<String> getMatchedClues() {
        return matchedTriggers;
    }

    public void setMatchedClues(List<String> clues) {
        this.matchedTriggers = clues;
    }

    public List<String> getKeyDiagnosticTests() {
        return keyDiagnosticTests;
    }

    public void setKeyDiagnosticTests(List<String> keyDiagnosticTests) {
        this.keyDiagnosticTests = keyDiagnosticTests;
    }

    public List<String> getIndicatedTests() {
        return keyDiagnosticTests;
    }

    public void setIndicatedTests(List<String> tests) {
        this.keyDiagnosticTests = tests;
    }

    public List<String> getConfirmationCriteria() {
        return confirmationCriteria;
    }

    public void setConfirmationCriteria(List<String> confirmationCriteria) {
        this.confirmationCriteria = confirmationCriteria;
    }

    public List<String> getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(List<String> recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public List<String> getImmediateActions() {
        return recommendedAction;
    }

    public void setImmediateActions(List<String> actions) {
        this.recommendedAction = actions;
    }
}
