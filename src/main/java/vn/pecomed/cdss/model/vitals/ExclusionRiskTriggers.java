package vn.pecomed.cdss.model.vitals;

/**
 * Clinical triggers for Step 3 Differential Diagnosis & Exclusion reasoning.
 */
public class ExclusionRiskTriggers {
    // 1. Thuốc đang điều trị (Medications)
    private boolean amiodarone = false;
    private boolean diuretics = false;
    private boolean systemicCorticosteroids = false;
    private boolean oralContraceptives = false;
    private boolean oilNasalDrops = false;

    // 2. Triệu chứng lâm sàng (Clinical symptoms)
    private boolean chronicCoughGt2w = false;
    private boolean hemoptysis = false;
    private boolean nightSweatsWeightLoss = false;
    private boolean afternoonLowFeverNightSweats = false;
    private boolean unexplainedWeightLoss = false;
    private boolean suddenSevereChestPain = false;
    private boolean dyspneaWithShock = false;
    private boolean prolongedFeverFoulSputum = false;
    private boolean highFeverProlonged12w = false;
    private boolean paroxysmalCoughChoking = false;
    private boolean foulSmellingSputum = false;
    private boolean chronicPurulentSputum = false;
    private boolean transientWheezingDyspnea = false;
    private boolean orthopneaPnd = false;

    // 3. Khám thực thể (Physical examination)
    private boolean pleuriticFrictionRub = false;
    private boolean apicalCavityOrDecreasedBreathSounds = false;
    private boolean fixedCoarseCrackles = false;

    // 4. Tiền sử & Bệnh đồng mắc (Comorbidities & History)
    private boolean postpartumOrPelvicSurgery = false;
    private boolean longTermImmobilizationOrDvt = false;
    private boolean ascarisOrParasiteInfection = false;
    private boolean tbContactHistory = false;
    private boolean smokingHeavyHistory = false;
    private boolean congestiveHeartFailure = false;

    public ExclusionRiskTriggers() {
    }

    // Getters and Setters with convenient aliases
    public boolean isAmiodarone() { return amiodarone; }
    public void setAmiodarone(boolean amiodarone) { this.amiodarone = amiodarone; }

    public boolean isDiuretics() { return diuretics; }
    public void setDiuretics(boolean diuretics) { this.diuretics = diuretics; }
    public boolean isDiureticsUseOrChange() { return diuretics; }
    public void setDiureticsUseOrChange(boolean v) { this.diuretics = v; }

    public boolean isSystemicCorticosteroids() { return systemicCorticosteroids; }
    public void setSystemicCorticosteroids(boolean systemicCorticosteroids) { this.systemicCorticosteroids = systemicCorticosteroids; }
    public boolean isCorticoidLongTerm() { return systemicCorticosteroids; }
    public void setCorticoidLongTerm(boolean v) { this.systemicCorticosteroids = v; }

    public boolean isOralContraceptives() { return oralContraceptives; }
    public void setOralContraceptives(boolean oralContraceptives) { this.oralContraceptives = oralContraceptives; }

    public boolean isOilNasalDrops() { return oilNasalDrops; }
    public void setOilNasalDrops(boolean oilNasalDrops) { this.oilNasalDrops = oilNasalDrops; }
    public boolean isOilyNasalDrops() { return oilNasalDrops; }
    public void setOilyNasalDrops(boolean v) { this.oilNasalDrops = v; }

    public boolean isChronicCoughGt2w() { return chronicCoughGt2w; }
    public void setChronicCoughGt2w(boolean chronicCoughGt2w) { this.chronicCoughGt2w = chronicCoughGt2w; }

    public boolean isHemoptysis() { return hemoptysis; }
    public void setHemoptysis(boolean hemoptysis) { this.hemoptysis = hemoptysis; }

    public boolean isNightSweatsWeightLoss() { return nightSweatsWeightLoss || (afternoonLowFeverNightSweats && unexplainedWeightLoss); }
    public void setNightSweatsWeightLoss(boolean nightSweatsWeightLoss) {
        this.nightSweatsWeightLoss = nightSweatsWeightLoss;
        if (nightSweatsWeightLoss) {
            this.afternoonLowFeverNightSweats = true;
            this.unexplainedWeightLoss = true;
        }
    }

    public boolean isAfternoonLowFeverNightSweats() { return afternoonLowFeverNightSweats || nightSweatsWeightLoss; }
    public void setAfternoonLowFeverNightSweats(boolean v) { this.afternoonLowFeverNightSweats = v; }

    public boolean isUnexplainedWeightLoss() { return unexplainedWeightLoss || nightSweatsWeightLoss; }
    public void setUnexplainedWeightLoss(boolean v) { this.unexplainedWeightLoss = v; }

    public boolean isSuddenSevereChestPain() { return suddenSevereChestPain; }
    public void setSuddenSevereChestPain(boolean suddenSevereChestPain) { this.suddenSevereChestPain = suddenSevereChestPain; }

    public boolean isDyspneaWithShock() { return dyspneaWithShock; }
    public void setDyspneaWithShock(boolean dyspneaWithShock) { this.dyspneaWithShock = dyspneaWithShock; }
    public boolean isSuddenDyspneaOrShock() { return dyspneaWithShock; }
    public void setSuddenDyspneaOrShock(boolean v) { this.dyspneaWithShock = v; }

    public boolean isProlongedFeverFoulSputum() { return prolongedFeverFoulSputum || highFeverProlonged12w || foulSmellingSputum || paroxysmalCoughChoking; }
    public void setProlongedFeverFoulSputum(boolean prolongedFeverFoulSputum) {
        this.prolongedFeverFoulSputum = prolongedFeverFoulSputum;
        if (prolongedFeverFoulSputum) {
            this.highFeverProlonged12w = true;
            this.foulSmellingSputum = true;
        }
    }

    public boolean isHighFeverProlonged12w() { return highFeverProlonged12w; }
    public void setHighFeverProlonged12w(boolean v) { this.highFeverProlonged12w = v; }

    public boolean isParoxysmalCoughChoking() { return paroxysmalCoughChoking; }
    public void setParoxysmalCoughChoking(boolean v) { this.paroxysmalCoughChoking = v; }

    public boolean isFoulSmellingSputum() { return foulSmellingSputum; }
    public void setFoulSmellingSputum(boolean v) { this.foulSmellingSputum = v; }

    public boolean isChronicPurulentSputum() { return chronicPurulentSputum; }
    public void setChronicPurulentSputum(boolean chronicPurulentSputum) { this.chronicPurulentSputum = chronicPurulentSputum; }

    public boolean isTransientWheezingDyspnea() { return transientWheezingDyspnea; }
    public void setTransientWheezingDyspnea(boolean transientWheezingDyspnea) { this.transientWheezingDyspnea = transientWheezingDyspnea; }

    public boolean isOrthopneaPnd() { return orthopneaPnd; }
    public void setOrthopneaPnd(boolean orthopneaPnd) { this.orthopneaPnd = orthopneaPnd; }

    public boolean isPleuriticFrictionRub() { return pleuriticFrictionRub; }
    public void setPleuriticFrictionRub(boolean pleuriticFrictionRub) { this.pleuriticFrictionRub = pleuriticFrictionRub; }

    public boolean isApicalCavityOrDecreasedBreathSounds() { return apicalCavityOrDecreasedBreathSounds; }
    public void setApicalCavityOrDecreasedBreathSounds(boolean v) { this.apicalCavityOrDecreasedBreathSounds = v; }
    public boolean isApicalDecreasedBreathSoundsAmphoric() { return apicalCavityOrDecreasedBreathSounds; }
    public void setApicalDecreasedBreathSoundsAmphoric(boolean v) { this.apicalCavityOrDecreasedBreathSounds = v; }

    public boolean isFixedCoarseCrackles() { return fixedCoarseCrackles; }
    public void setFixedCoarseCrackles(boolean fixedCoarseCrackles) { this.fixedCoarseCrackles = fixedCoarseCrackles; }

    public boolean isPostpartumOrPelvicSurgery() { return postpartumOrPelvicSurgery; }
    public void setPostpartumOrPelvicSurgery(boolean v) { this.postpartumOrPelvicSurgery = v; }

    public boolean isLongTermImmobilizationOrDvt() { return longTermImmobilizationOrDvt || postpartumOrPelvicSurgery; }
    public void setLongTermImmobilizationOrDvt(boolean v) { this.longTermImmobilizationOrDvt = v; }
    public boolean isDvtHistoryOrImmobilization() { return isLongTermImmobilizationOrDvt(); }
    public void setDvtHistoryOrImmobilization(boolean v) { this.longTermImmobilizationOrDvt = v; }

    public boolean isAscarisOrParasiteInfection() { return ascarisOrParasiteInfection; }
    public void setAscarisOrParasiteInfection(boolean ascarisOrParasiteInfection) { this.ascarisOrParasiteInfection = ascarisOrParasiteInfection; }

    public boolean isTbContactHistory() { return tbContactHistory; }
    public void setTbContactHistory(boolean tbContactHistory) { this.tbContactHistory = tbContactHistory; }

    public boolean isSmokingHeavyHistory() { return smokingHeavyHistory; }
    public void setSmokingHeavyHistory(boolean smokingHeavyHistory) { this.smokingHeavyHistory = smokingHeavyHistory; }

    public boolean isCongestiveHeartFailure() { return congestiveHeartFailure; }
    public void setCongestiveHeartFailure(boolean congestiveHeartFailure) { this.congestiveHeartFailure = congestiveHeartFailure; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final ExclusionRiskTriggers t = new ExclusionRiskTriggers();

        public Builder amiodarone(boolean v) { t.setAmiodarone(v); return this; }
        public Builder diuretics(boolean v) { t.setDiuretics(v); return this; }
        public Builder systemicCorticosteroids(boolean v) { t.setSystemicCorticosteroids(v); return this; }
        public Builder corticoidLongTerm(boolean v) { t.setCorticoidLongTerm(v); return this; }
        public Builder oralContraceptives(boolean v) { t.setOralContraceptives(v); return this; }
        public Builder oilNasalDrops(boolean v) { t.setOilNasalDrops(v); return this; }
        public Builder chronicCoughGt2w(boolean v) { t.setChronicCoughGt2w(v); return this; }
        public Builder hemoptysis(boolean v) { t.setHemoptysis(v); return this; }
        public Builder nightSweatsWeightLoss(boolean v) { t.setNightSweatsWeightLoss(v); return this; }
        public Builder afternoonLowFeverNightSweats(boolean v) { t.setAfternoonLowFeverNightSweats(v); return this; }
        public Builder unexplainedWeightLoss(boolean v) { t.setUnexplainedWeightLoss(v); return this; }
        public Builder suddenSevereChestPain(boolean v) { t.setSuddenSevereChestPain(v); return this; }
        public Builder dyspneaWithShock(boolean v) { t.setDyspneaWithShock(v); return this; }
        public Builder suddenDyspneaOrShock(boolean v) { t.setDyspneaWithShock(v); return this; }
        public Builder prolongedFeverFoulSputum(boolean v) { t.setProlongedFeverFoulSputum(v); return this; }
        public Builder highFeverProlonged12w(boolean v) { t.setHighFeverProlonged12w(v); return this; }
        public Builder paroxysmalCoughChoking(boolean v) { t.setParoxysmalCoughChoking(v); return this; }
        public Builder foulSmellingSputum(boolean v) { t.setFoulSmellingSputum(v); return this; }
        public Builder chronicPurulentSputum(boolean v) { t.setChronicPurulentSputum(v); return this; }
        public Builder transientWheezingDyspnea(boolean v) { t.setTransientWheezingDyspnea(v); return this; }
        public Builder orthopneaPnd(boolean v) { t.setOrthopneaPnd(v); return this; }
        public Builder pleuriticFrictionRub(boolean v) { t.setPleuriticFrictionRub(v); return this; }
        public Builder apicalCavityOrDecreasedBreathSounds(boolean v) { t.setApicalCavityOrDecreasedBreathSounds(v); return this; }
        public Builder apicalDecreasedBreathSoundsAmphoric(boolean v) { t.setApicalCavityOrDecreasedBreathSounds(v); return this; }
        public Builder fixedCoarseCrackles(boolean v) { t.setFixedCoarseCrackles(v); return this; }
        public Builder postpartumOrPelvicSurgery(boolean v) { t.setPostpartumOrPelvicSurgery(v); return this; }
        public Builder longTermImmobilizationOrDvt(boolean v) { t.setLongTermImmobilizationOrDvt(v); return this; }
        public Builder dvtHistoryOrImmobilization(boolean v) { t.setLongTermImmobilizationOrDvt(v); return this; }
        public Builder ascarisOrParasiteInfection(boolean v) { t.setAscarisOrParasiteInfection(v); return this; }
        public Builder ascarisParasiteInfection(boolean v) { t.setAscarisOrParasiteInfection(v); return this; }
        public Builder tbContactHistory(boolean v) { t.setTbContactHistory(v); return this; }
        public Builder smokingHeavyHistory(boolean v) { t.setSmokingHeavyHistory(v); return this; }
        public Builder congestiveHeartFailure(boolean v) { t.setCongestiveHeartFailure(v); return this; }

        public ExclusionRiskTriggers build() {
            return t;
        }
    }
}
