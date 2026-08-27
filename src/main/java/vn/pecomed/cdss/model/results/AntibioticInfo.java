package vn.pecomed.cdss.model.results;

import vn.pecomed.cdss.model.enums.AdminRoute;

/**
 * Detailed antibiotic prescription info.
 */
public class AntibioticInfo {
    private String name = "";
    private String dosage = "";
    private AdminRoute route = AdminRoute.ORAL;
    private String frequency = "";
    private String notes = "";
    private boolean isAlternative = false;
    private String role = "";
    private String category = "";

    public AntibioticInfo() {
    }

    public AntibioticInfo(String name, String dosage, AdminRoute route, String frequency, String notes, boolean isAlternative) {
        this.name = name;
        this.dosage = dosage;
        this.route = route;
        this.frequency = frequency;
        this.notes = notes;
        this.isAlternative = isAlternative;
    }

    public AntibioticInfo(String name, String dosage, AdminRoute route, String role, String category, String notes) {
        this.name = name;
        this.dosage = dosage;
        this.route = route;
        this.role = role;
        this.category = category;
        this.notes = notes;
        this.isAlternative = role != null && role.toLowerCase().contains("thay thế");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getDoseRegimen() {
        return dosage;
    }

    public void setDoseRegimen(String dosage) {
        this.dosage = dosage;
    }

    public AdminRoute getRoute() {
        return route;
    }

    public void setRoute(AdminRoute route) {
        this.route = route;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isAlternative() {
        return isAlternative;
    }

    public void setAlternative(boolean alternative) {
        isAlternative = alternative;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final AntibioticInfo info = new AntibioticInfo();

        public Builder name(String name) { info.setName(name); return this; }
        public Builder dosage(String dosage) { info.setDosage(dosage); return this; }
        public Builder route(AdminRoute route) { info.setRoute(route); return this; }
        public Builder frequency(String freq) { info.setFrequency(freq); return this; }
        public Builder notes(String notes) { info.setNotes(notes); return this; }
        public Builder isAlternative(boolean alt) { info.setAlternative(alt); return this; }
        public Builder role(String role) { info.setRole(role); return this; }
        public Builder category(String cat) { info.setCategory(cat); return this; }

        public AntibioticInfo build() {
            return info;
        }
    }
}
