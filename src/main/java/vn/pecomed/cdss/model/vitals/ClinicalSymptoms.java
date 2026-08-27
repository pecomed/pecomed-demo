package vn.pecomed.cdss.model.vitals;

/**
 * Clinical symptoms and physical examination findings.
 */
public class ClinicalSymptoms {
    private Double fever;                       // Nhiệt độ sốt (>39: điển hình, sốt nhẹ: không điển hình)
    private boolean coughDry = false;           // Ho khan
    private boolean coughProductive = false;    // Ho có đờm
    private boolean pleuriticChestPain = false; // Đau ngực kiểu màng phổi
    private boolean toxicSyndrome = false;      // Lưỡi bẩn, môi khô, hơi thở hôi (HC nhiễm trùng/nhiễm độc)
    private boolean bronchialConsolidation = false; // Hội chứng đông đặc (rung thanh tăng, gõ đục, RRPN giảm, ran nổ)
    private int consolidationSites = 1;         // Số vị trí đông đặc (1 vị trí -> thùy; >1 -> phế quản phế viêm)

    public ClinicalSymptoms() {
    }

    public ClinicalSymptoms(Double fever, boolean coughDry, boolean coughProductive,
                            boolean pleuriticChestPain, boolean toxicSyndrome,
                            boolean bronchialConsolidation, int consolidationSites) {
        this.fever = fever;
        this.coughDry = coughDry;
        this.coughProductive = coughProductive;
        this.pleuriticChestPain = pleuriticChestPain;
        this.toxicSyndrome = toxicSyndrome;
        this.bronchialConsolidation = bronchialConsolidation;
        this.consolidationSites = consolidationSites;
    }

    public Double getFever() {
        return fever;
    }

    public void setFever(Double fever) {
        this.fever = fever;
    }

    public boolean isCoughDry() {
        return coughDry;
    }

    public void setCoughDry(boolean coughDry) {
        this.coughDry = coughDry;
    }

    public boolean isCoughProductive() {
        return coughProductive;
    }

    public void setCoughProductive(boolean coughProductive) {
        this.coughProductive = coughProductive;
    }

    public boolean isPleuriticChestPain() {
        return pleuriticChestPain;
    }

    public void setPleuriticChestPain(boolean pleuriticChestPain) {
        this.pleuriticChestPain = pleuriticChestPain;
    }

    public boolean isToxicSyndrome() {
        return toxicSyndrome;
    }

    public void setToxicSyndrome(boolean toxicSyndrome) {
        this.toxicSyndrome = toxicSyndrome;
    }

    public boolean isBronchialConsolidation() {
        return bronchialConsolidation;
    }

    public void setBronchialConsolidation(boolean bronchialConsolidation) {
        this.bronchialConsolidation = bronchialConsolidation;
    }

    public int getConsolidationSites() {
        return consolidationSites;
    }

    public void setConsolidationSites(int consolidationSites) {
        this.consolidationSites = consolidationSites;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final ClinicalSymptoms sym = new ClinicalSymptoms();

        public Builder fever(Double val) {
            sym.setFever(val);
            return this;
        }

        public Builder coughDry(boolean val) {
            sym.setCoughDry(val);
            return this;
        }

        public Builder coughProductive(boolean val) {
            sym.setCoughProductive(val);
            return this;
        }

        public Builder pleuriticChestPain(boolean val) {
            sym.setPleuriticChestPain(val);
            return this;
        }

        public Builder toxicSyndrome(boolean val) {
            sym.setToxicSyndrome(val);
            return this;
        }

        public Builder bronchialConsolidation(boolean val) {
            sym.setBronchialConsolidation(val);
            return this;
        }

        public Builder consolidationSites(int val) {
            sym.setConsolidationSites(val);
            return this;
        }

        public ClinicalSymptoms build() {
            return sym;
        }
    }
}
