package vn.pecomed.cdss.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Biological gender for PSI score calculation.
 */
public enum Gender {
    MALE("Nam"),
    FEMALE("Nữ");

    private final String description;

    Gender(String description) {
        this.description = description;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static Gender fromValue(String value) {
        if (value == null || value.trim().isEmpty()) return MALE;
        String v = value.trim().toUpperCase();
        if (v.equals("FEMALE") || v.equals("NỮ") || v.equals("NU") || v.equals("F")) {
            return FEMALE;
        }
        return MALE;
    }

    @Override
    public String toString() {
        return description;
    }
}

