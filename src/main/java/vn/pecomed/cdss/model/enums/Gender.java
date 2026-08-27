package vn.pecomed.cdss.model.enums;

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

    @Override
    public String toString() {
        return description;
    }
}
