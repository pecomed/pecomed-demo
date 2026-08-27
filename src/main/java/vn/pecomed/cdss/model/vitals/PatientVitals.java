package vn.pecomed.cdss.model.vitals;

/**
 * Clinical vital signs for CAP patient assessment.
 */
public class PatientVitals {
    private int respiratoryRate = 18;             // nhịp thở (lần/phút)
    private int systolicBp = 120;                 // HA tâm thu (mmHg)
    private int diastolicBp = 80;                 // HA tâm trương (mmHg)
    private int heartRate = 80;                   // mạch / nhịp tim (lần/phút)
    private double temperature = 37.0;            // thân nhiệt (°C)
    private double spo2 = 98.0;                   // SpO2 (%)
    private boolean alteredMentalStatus = false;  // thay đổi tri giác / lú lẫn
    private boolean onAggressiveFluidResuscitation = false; // tụt HA đang bù dịch tích cực

    public PatientVitals() {
    }

    public PatientVitals(int respiratoryRate, int systolicBp, int diastolicBp, int heartRate,
                         double temperature, double spo2, boolean alteredMentalStatus,
                         boolean onAggressiveFluidResuscitation) {
        this.respiratoryRate = respiratoryRate;
        this.systolicBp = systolicBp;
        this.diastolicBp = diastolicBp;
        this.heartRate = heartRate;
        this.temperature = temperature;
        this.spo2 = spo2;
        this.alteredMentalStatus = alteredMentalStatus;
        this.onAggressiveFluidResuscitation = onAggressiveFluidResuscitation;
    }

    public int getRespiratoryRate() {
        return respiratoryRate;
    }

    public void setRespiratoryRate(int respiratoryRate) {
        this.respiratoryRate = respiratoryRate;
    }

    public int getSystolicBp() {
        return systolicBp;
    }

    public void setSystolicBp(int systolicBp) {
        this.systolicBp = systolicBp;
    }

    public int getDiastolicBp() {
        return diastolicBp;
    }

    public void setDiastolicBp(int diastolicBp) {
        this.diastolicBp = diastolicBp;
    }

    public int getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(int heartRate) {
        this.heartRate = heartRate;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getSpo2() {
        return spo2;
    }

    public void setSpo2(double spo2) {
        this.spo2 = spo2;
    }

    public boolean isAlteredMentalStatus() {
        return alteredMentalStatus;
    }

    public void setAlteredMentalStatus(boolean alteredMentalStatus) {
        this.alteredMentalStatus = alteredMentalStatus;
    }

    public boolean isOnAggressiveFluidResuscitation() {
        return onAggressiveFluidResuscitation;
    }

    public void setOnAggressiveFluidResuscitation(boolean onAggressiveFluidResuscitation) {
        this.onAggressiveFluidResuscitation = onAggressiveFluidResuscitation;
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PatientVitals vitals = new PatientVitals();

        public Builder respiratoryRate(int rr) {
            vitals.setRespiratoryRate(rr);
            return this;
        }

        public Builder systolicBp(int sbp) {
            vitals.setSystolicBp(sbp);
            return this;
        }

        public Builder diastolicBp(int dbp) {
            vitals.setDiastolicBp(dbp);
            return this;
        }

        public Builder heartRate(int hr) {
            vitals.setHeartRate(hr);
            return this;
        }

        public Builder temperature(double temp) {
            vitals.setTemperature(temp);
            return this;
        }

        public Builder spo2(double spo2) {
            vitals.setSpo2(spo2);
            return this;
        }

        public Builder alteredMentalStatus(boolean ams) {
            vitals.setAlteredMentalStatus(ams);
            return this;
        }

        public Builder onAggressiveFluidResuscitation(boolean afr) {
            vitals.setOnAggressiveFluidResuscitation(afr);
            return this;
        }

        public PatientVitals build() {
            return vitals;
        }
    }
}
