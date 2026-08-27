package vn.pecomed.cdss.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
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

    @JsonCreator
    public static AdminRoute fromValue(String value) {
        if (value == null || value.trim().isEmpty()) return ORAL;
        for (AdminRoute route : values()) {
            if (route.name().equalsIgnoreCase(value) || route.description.equalsIgnoreCase(value)) {
                return route;
            }
        }
        return ORAL;
    }

    @Override
    public String toString() {
        return description;
    }
}

