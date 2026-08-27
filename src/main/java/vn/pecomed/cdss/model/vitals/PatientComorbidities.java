package vn.pecomed.cdss.model.vitals;

/**
 * Underlying patient comorbidities impacting severity and prognosis.
 */
public class PatientComorbidities {
    private boolean neoplasm = false;                  // Ung thư (+30 PSI)
    private boolean liverDisease = false;              // Bệnh gan mạn tính (+20 PSI)
    private boolean congestiveHeartFailure = false;   // Suy tim ứ huyết (+10 PSI)
    private boolean cerebrovascularDisease = false;    // Bệnh mạch não / Tai biến (+10 PSI)
    private boolean renalDisease = false;              // Bệnh thận mạn / Suy thận (+10 PSI)
    private boolean diabetes = false;                  // Đái tháo đường
    private boolean copdChronicLung = false;          // Bệnh phổi mạn tính (COPD, giãn PQ...)
    private boolean immunocompromised = false;         // Suy giảm miễn dịch
    private boolean nursingHomeResident = false;      // Viện dưỡng lão / Nhà điều dưỡng (+10 PSI)

    public PatientComorbidities() {
    }

    public PatientComorbidities(boolean neoplasm, boolean liverDisease, boolean congestiveHeartFailure,
                                boolean cerebrovascularDisease, boolean renalDisease, boolean diabetes,
                                boolean copdChronicLung, boolean immunocompromised, boolean nursingHomeResident) {
        this.neoplasm = neoplasm;
        this.liverDisease = liverDisease;
        this.congestiveHeartFailure = congestiveHeartFailure;
        this.cerebrovascularDisease = cerebrovascularDisease;
        this.renalDisease = renalDisease;
        this.diabetes = diabetes;
        this.copdChronicLung = copdChronicLung;
        this.immunocompromised = immunocompromised;
        this.nursingHomeResident = nursingHomeResident;
    }

    public boolean isNeoplasm() {
        return neoplasm;
    }

    public void setNeoplasm(boolean neoplasm) {
        this.neoplasm = neoplasm;
    }

    public boolean isLiverDisease() {
        return liverDisease;
    }

    public void setLiverDisease(boolean liverDisease) {
        this.liverDisease = liverDisease;
    }

    public boolean isCongestiveHeartFailure() {
        return congestiveHeartFailure;
    }

    public void setCongestiveHeartFailure(boolean congestiveHeartFailure) {
        this.congestiveHeartFailure = congestiveHeartFailure;
    }

    public boolean isCerebrovascularDisease() {
        return cerebrovascularDisease;
    }

    public void setCerebrovascularDisease(boolean cerebrovascularDisease) {
        this.cerebrovascularDisease = cerebrovascularDisease;
    }

    public boolean isRenalDisease() {
        return renalDisease;
    }

    public void setRenalDisease(boolean renalDisease) {
        this.renalDisease = renalDisease;
    }

    public boolean isDiabetes() {
        return diabetes;
    }

    public void setDiabetes(boolean diabetes) {
        this.diabetes = diabetes;
    }

    public boolean isCopdChronicLung() {
        return copdChronicLung;
    }

    public void setCopdChronicLung(boolean copdChronicLung) {
        this.copdChronicLung = copdChronicLung;
    }

    public boolean isImmunocompromised() {
        return immunocompromised;
    }

    public void setImmunocompromised(boolean immunocompromised) {
        this.immunocompromised = immunocompromised;
    }

    public boolean isNursingHomeResident() {
        return nursingHomeResident;
    }

    public void setNursingHomeResident(boolean nursingHomeResident) {
        this.nursingHomeResident = nursingHomeResident;
    }

    public boolean hasAnyMajorComorbidity() {
        return neoplasm || liverDisease || congestiveHeartFailure || cerebrovascularDisease ||
                renalDisease || diabetes || copdChronicLung || immunocompromised;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PatientComorbidities c = new PatientComorbidities();

        public Builder neoplasm(boolean v) {
            c.setNeoplasm(v);
            return this;
        }

        public Builder liverDisease(boolean v) {
            c.setLiverDisease(v);
            return this;
        }

        public Builder congestiveHeartFailure(boolean v) {
            c.setCongestiveHeartFailure(v);
            return this;
        }

        public Builder cerebrovascularDisease(boolean v) {
            c.setCerebrovascularDisease(v);
            return this;
        }

        public Builder renalDisease(boolean v) {
            c.setRenalDisease(v);
            return this;
        }

        public Builder diabetes(boolean v) {
            c.setDiabetes(v);
            return this;
        }

        public Builder copdChronicLung(boolean v) {
            c.setCopdChronicLung(v);
            return this;
        }

        public Builder immunocompromised(boolean v) {
            c.setImmunocompromised(v);
            return this;
        }

        public Builder nursingHomeResident(boolean v) {
            c.setNursingHomeResident(v);
            return this;
        }

        public PatientComorbidities build() {
            return c;
        }
    }
}
