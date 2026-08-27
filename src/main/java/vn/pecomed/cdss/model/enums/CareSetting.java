package vn.pecomed.cdss.model.enums;

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

    @Override
    public String toString() {
        return description;
    }
}
