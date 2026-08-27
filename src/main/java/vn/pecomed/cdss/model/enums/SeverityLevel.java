package vn.pecomed.cdss.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Severity levels of Community-Acquired Pneumonia (CAP).
 */
public enum SeverityLevel {
    MILD("Nhẹ (Mild)"),
    MODERATE("Trung bình (Moderate)"),
    SEVERE("Nặng (Severe)"),
    VERY_SEVERE("Rất nặng / Nguy kịch (Critical / Very Severe)");

    private final String description;

    SeverityLevel(String description) {
        this.description = description;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return description;
    }
}
