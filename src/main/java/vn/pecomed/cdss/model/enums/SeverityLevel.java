package vn.pecomed.cdss.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
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

    @JsonCreator
    public static SeverityLevel fromValue(String value) {
        if (value == null || value.trim().isEmpty()) return MILD;
        for (SeverityLevel lvl : values()) {
            if (lvl.name().equalsIgnoreCase(value) || lvl.description.equalsIgnoreCase(value)) {
                return lvl;
            }
        }
        return MILD;
    }

    @Override
    public String toString() {
        return description;
    }
}

