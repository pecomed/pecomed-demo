package vn.pecomed.cdss.model.vitals;

/**
 * Laboratory findings for CAP assessment (PSI, CURB-65, SMART-COP, ATS/IDSA).
 */
public class PatientLabs {
    private Double arterialPh;          // pH máu động mạch (<7.35: +30 PSI, +2 SMART-COP)
    private Double bunMgDl;             // BUN (mg/dL) (>=20mg/dL: CURB-65/ATS; >=30mg/dL: +20 PSI)
    private Double ureaMmolL;           // Ure máu (mmol/L) (>7 mmol/L: CURB-65/ATS; >=11 mmol/L: +20 PSI)
    private Double sodiumMmolL;         // Natri máu (mmol/L) (<130: +20 PSI)
    private Double glucoseMmolL;        // Glucose máu (mmol/L) (>=14 mmol/L: +10 PSI)
    private Double hematocritPct;       // Hct (%) (<30%: +10 PSI)
    private Double pao2Mmhg;            // PaO2 (mmHg) (<60 mmHg: +10 PSI)
    private Double pao2Fio2Ratio;       // PaO2/FiO2 (<=250: tiêu chuẩn phụ ATS)
    private Double wbcGL;               // Bạch cầu WBC (G/L or x10^9/L) (<4 G/L: ATS phụ)
    private Double plateletsGL;         // Tiểu cầu PLT (G/L) (<100 G/L: ATS phụ)
    private Double albuminGDl;          // Albumin máu (g/dL) (<3.5 g/dL: SMART-COP)
    private Double procalcitoninNgMl;   // Procalcitonin (ng/mL)
    private Double crpMgL;              // CRP (mg/L)

    public PatientLabs() {
    }

    public Double getArterialPh() {
        return arterialPh;
    }

    public void setArterialPh(Double arterialPh) {
        this.arterialPh = arterialPh;
    }

    public Double getBunMgDl() {
        return bunMgDl;
    }

    public void setBunMgDl(Double bunMgDl) {
        this.bunMgDl = bunMgDl;
    }

    public Double getUreaMmolL() {
        return ureaMmolL;
    }

    public void setUreaMmolL(Double ureaMmolL) {
        this.ureaMmolL = ureaMmolL;
    }

    public Double getSodiumMmolL() {
        return sodiumMmolL;
    }

    public void setSodiumMmolL(Double sodiumMmolL) {
        this.sodiumMmolL = sodiumMmolL;
    }

    public Double getGlucoseMmolL() {
        return glucoseMmolL;
    }

    public void setGlucoseMmolL(Double glucoseMmolL) {
        this.glucoseMmolL = glucoseMmolL;
    }

    public Double getHematocritPct() {
        return hematocritPct;
    }

    public void setHematocritPct(Double hematocritPct) {
        this.hematocritPct = hematocritPct;
    }

    public Double getPao2Mmhg() {
        return pao2Mmhg;
    }

    public void setPao2Mmhg(Double pao2Mmhg) {
        this.pao2Mmhg = pao2Mmhg;
    }

    public Double getPao2Fio2Ratio() {
        return pao2Fio2Ratio;
    }

    public void setPao2Fio2Ratio(Double pao2Fio2Ratio) {
        this.pao2Fio2Ratio = pao2Fio2Ratio;
    }

    public Double getWbcGL() {
        return wbcGL;
    }

    public void setWbcGL(Double wbcGL) {
        this.wbcGL = wbcGL;
    }

    public Double getPlateletsGL() {
        return plateletsGL;
    }

    public void setPlateletsGL(Double plateletsGL) {
        this.plateletsGL = plateletsGL;
    }

    public Double getAlbuminGDl() {
        return albuminGDl;
    }

    public void setAlbuminGDl(Double albuminGDl) {
        this.albuminGDl = albuminGDl;
    }

    public Double getProcalcitoninNgMl() {
        return procalcitoninNgMl;
    }

    public void setProcalcitoninNgMl(Double procalcitoninNgMl) {
        this.procalcitoninNgMl = procalcitoninNgMl;
    }

    public Double getCrpMgL() {
        return crpMgL;
    }

    public void setCrpMgL(Double crpMgL) {
        this.crpMgL = crpMgL;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PatientLabs labs = new PatientLabs();

        public Builder arterialPh(Double val) {
            labs.setArterialPh(val);
            return this;
        }

        public Builder bunMgDl(Double val) {
            labs.setBunMgDl(val);
            return this;
        }

        public Builder ureaMmolL(Double val) {
            labs.setUreaMmolL(val);
            return this;
        }

        public Builder sodiumMmolL(Double val) {
            labs.setSodiumMmolL(val);
            return this;
        }

        public Builder glucoseMmolL(Double val) {
            labs.setGlucoseMmolL(val);
            return this;
        }

        public Builder hematocritPct(Double val) {
            labs.setHematocritPct(val);
            return this;
        }

        public Builder pao2Mmhg(Double val) {
            labs.setPao2Mmhg(val);
            return this;
        }

        public Builder pao2Fio2Ratio(Double val) {
            labs.setPao2Fio2Ratio(val);
            return this;
        }

        public Builder wbcGL(Double val) {
            labs.setWbcGL(val);
            return this;
        }

        public Builder plateletsGL(Double val) {
            labs.setPlateletsGL(val);
            return this;
        }

        public Builder albuminGDl(Double val) {
            labs.setAlbuminGDl(val);
            return this;
        }

        public Builder procalcitoninNgMl(Double val) {
            labs.setProcalcitoninNgMl(val);
            return this;
        }

        public Builder crpMgL(Double val) {
            labs.setCrpMgL(val);
            return this;
        }

        public PatientLabs build() {
            return labs;
        }
    }
}
