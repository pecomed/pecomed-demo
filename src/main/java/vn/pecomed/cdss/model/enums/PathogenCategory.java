package vn.pecomed.cdss.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Etiological pathogen category.
 */
public enum PathogenCategory {
    BACTERIA("Vi khuẩn (Bacteria)"),
    VIRUS("Virus hô hấp (Respiratory Virus)"),
    FUNGI("Nấm (Fungi)"),
    ATYPICAL("Vi khuẩn không điển hình (Atypical Bacteria)");

    private final String description;

    PathogenCategory(String description) {
        this.description = description;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static PathogenCategory fromValue(String value) {
        if (value == null || value.trim().isEmpty()) return BACTERIA;
        for (PathogenCategory cat : values()) {
            if (cat.name().equalsIgnoreCase(value) || cat.description.equalsIgnoreCase(value)) {
                return cat;
            }
        }
        return BACTERIA;
    }

    @Override
    public String toString() {
        return description;
    }
}

