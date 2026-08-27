package vn.pecomed.cdss.model.vitals;

/**
 * Imaging findings and critical life support interventions.
 */
public class PatientImagingAndIntervention {
    private boolean multilobarInfiltrates = false;    // Thâm nhiễm nhiều thùy (SMART-COP, ATS phụ)
    private boolean pleuralEffusion = false;          // Tràn dịch màng phổi (+10 PSI)
    private boolean mechanicalVentilation = false;    // Thở máy xâm nhập / Đặt nội khí quản (ATS chính)
    private boolean septicShockVasopressors = false; // Sốc nhiễm khuẩn dùng vận mạch (ATS chính)

    public PatientImagingAndIntervention() {
    }

    public PatientImagingAndIntervention(boolean multilobarInfiltrates, boolean pleuralEffusion,
                                         boolean mechanicalVentilation, boolean septicShockVasopressors) {
        this.multilobarInfiltrates = multilobarInfiltrates;
        this.pleuralEffusion = pleuralEffusion;
        this.mechanicalVentilation = mechanicalVentilation;
        this.septicShockVasopressors = septicShockVasopressors;
    }

    public boolean isMultilobarInfiltrates() {
        return multilobarInfiltrates;
    }

    public void setMultilobarInfiltrates(boolean multilobarInfiltrates) {
        this.multilobarInfiltrates = multilobarInfiltrates;
    }

    public boolean isPleuralEffusion() {
        return pleuralEffusion;
    }

    public void setPleuralEffusion(boolean pleuralEffusion) {
        this.pleuralEffusion = pleuralEffusion;
    }

    public boolean isMechanicalVentilation() {
        return mechanicalVentilation;
    }

    public void setMechanicalVentilation(boolean mechanicalVentilation) {
        this.mechanicalVentilation = mechanicalVentilation;
    }

    public boolean isSepticShockVasopressors() {
        return septicShockVasopressors;
    }

    public void setSepticShockVasopressors(boolean septicShockVasopressors) {
        this.septicShockVasopressors = septicShockVasopressors;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PatientImagingAndIntervention img = new PatientImagingAndIntervention();

        public Builder multilobarInfiltrates(boolean val) {
            img.setMultilobarInfiltrates(val);
            return this;
        }

        public Builder pleuralEffusion(boolean val) {
            img.setPleuralEffusion(val);
            return this;
        }

        public Builder mechanicalVentilation(boolean val) {
            img.setMechanicalVentilation(val);
            return this;
        }

        public Builder septicShockVasopressors(boolean val) {
            img.setSepticShockVasopressors(val);
            return this;
        }

        public PatientImagingAndIntervention build() {
            return img;
        }
    }
}
