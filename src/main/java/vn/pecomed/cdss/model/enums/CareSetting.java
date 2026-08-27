package vn.pecomed.cdss.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Care setting triage classification for CAP patients.
 */
public enum CareSetting {
    OUTPATIENT("Ngoại trú (Nhẹ)"),
    SHORT_TERM_INPATIENT("Nội trú ngắn hạn / Theo dõi sát"),
    INPATIENT("Nội trú thường (Trung bình)"),
    ICU("ICU (Rất nặng / Nguy kịch)");

    private final String description;

    CareSetting(String description) {
        this.description = description;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static CareSetting fromValue(String value) {
        if (value == null || value.trim().isEmpty()) return OUTPATIENT;
        for (CareSetting setting : values()) {
            if (setting.name().equalsIgnoreCase(value) || setting.description.equalsIgnoreCase(value)) {
                return setting;
            }
        }
        return OUTPATIENT;
    }

    @Override
    public String toString() {
        return description;
    }
}

