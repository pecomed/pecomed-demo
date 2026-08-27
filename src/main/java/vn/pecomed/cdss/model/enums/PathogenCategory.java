package vn.pecomed.cdss.model.enums;

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

    @Override
    public String toString() {
        return description;
    }
}
