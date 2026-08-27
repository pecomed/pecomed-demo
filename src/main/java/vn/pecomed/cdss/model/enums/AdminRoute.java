package vn.pecomed.cdss.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Drug administration route.
 */
public enum AdminRoute {
    ORAL("Uống (PO)"),
    IV("Tiêm / Truyền tĩnh mạch (IV)"),
    INHALED("Phun khí dung / Hít (Inhaled)");

    private final String description;

    AdminRoute(String description) {
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
