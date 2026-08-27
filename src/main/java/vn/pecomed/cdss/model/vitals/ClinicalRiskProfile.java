package vn.pecomed.cdss.model.vitals;

/**
 * Clinical risk factor profile matching Step 2 pathogen reasoning.
 */
public class ClinicalRiskProfile {
    // 1. Thói quen (Habits)
    private boolean smoking = false;
    private boolean alcoholism = false;

    // 2. Bệnh đồng mắc (Comorbidities)
    private boolean hiv = false;
    private boolean cd4Lt200 = false;
    private boolean strokeNeurological = false;
    private boolean chronicLiverDisease = false;
    private boolean congestiveHeartFailure = false;
    private boolean malnutrition = false;
    private boolean structuralLungDisease = false;   // COPD FEV1<30%, Giãn phế quản, Xơ nang
    private boolean severeLungAspirationRisk = false; // K phổi, viêm phổi hít, trào ngược, bệnh nha chu
    private boolean diabetes = false;
    private boolean chronicKidneyDisease = false;
    private boolean chronicLungDisease = false;      // Bệnh phổi mạn tính (COPD, bụi phổi, hen...)
    private boolean skinInfection = false;
    private boolean endocarditis = false;
    private boolean postInfluenzaMeasles = false;

    // 3. Suy giảm miễn dịch (Immunosuppression)
    private boolean solidOrganTransplant = false;
    private boolean boneMarrowTransplant = false;
    private boolean neutropenia = false;               // Giảm bạch cầu đa nhân trung tính
    private boolean hypogammaglobulinemia = false;     // Giảm gamma globulin
    private boolean immunosuppressiveDrugs = false;   // Dùng thuốc ức chế miễn dịch / Corticoid liều cao

    // 4. Dịch tễ & Điều trị gần đây (Epidemiology & Recent treatments)
    private boolean rainySeasonMudWater = false;    // Mùa mưa, tiếp xúc bùn nước đất bẩn
    private boolean winterSeason = false;             // Mùa đông
    private boolean ageLt10OrGt65 = false;        // Tuổi <10 hoặc >65
    private boolean priorMrsa = false;                // Tiền sử nhiễm MRSA
    private boolean ivDrugUse = false;               // Tiêm chích nhiều lần / ma túy tĩnh mạch
    private boolean ivAntibioticsGt90d = false;     // Kháng sinh tĩnh mạch >90 ngày
    private boolean priorAntibioticsPast3m = false; // Kháng sinh trong vòng 3 tháng
    private boolean intubationMechanicalVent = false;// Đặt nội khí quản / thở máy
    private boolean anesthesiaHistory = false;        // Tiền sử gây mê
    private String rapidTestPositive = null;         // Test nhanh dương tính ("COVID", "FLU", "RSV"...)

    // 5. Đặc điểm X-Quang / CT ngực (Imaging features)
    private boolean chestCtAvailable = false;
    private boolean ctHomogeneousConsolidationBulgingFissure = false; // Đông đặc thùy + phế quản hơi + đẩy lồi rãnh liên thùy
    private boolean ctBronchopneumoniaCavitary = false;                 // Viêm phế quản phổi + tổn thương dạng hang
    private boolean ctDiffuseLobarConsolidation = false;              // Đông đặc lan tỏa 1 hoặc nhiều thùy
    private boolean ctBilateralGroundGlassReticular = false;         // Kính mờ / nốt lưới rải rác hai bên
    private boolean ctProgressiveGroundGlassCrazyPaving = false;    // Kính mờ tiến triển + dày vách liên tiểu thùy
    private boolean xrayUnclearOrRecurrent = false;                   // X-quang không rõ hoặc viêm phổi tái phát

    public ClinicalRiskProfile() {
    }

    // Getters and Setters
    public boolean isSmoking() { return smoking; }
    public void setSmoking(boolean smoking) { this.smoking = smoking; }

    public boolean isAlcoholism() { return alcoholism; }
    public void setAlcoholism(boolean alcoholism) { this.alcoholism = alcoholism; }

    public boolean isHiv() { return hiv; }
    public void setHiv(boolean hiv) { this.hiv = hiv; }

    public boolean isCd4Lt200() { return cd4Lt200; }
    public void setCd4Lt200(boolean cd4Lt200) { this.cd4Lt200 = cd4Lt200; }

    public boolean isStrokeNeurological() { return strokeNeurological; }
    public void setStrokeNeurological(boolean strokeNeurological) { this.strokeNeurological = strokeNeurological; }

    public boolean isChronicLiverDisease() { return chronicLiverDisease; }
    public void setChronicLiverDisease(boolean chronicLiverDisease) { this.chronicLiverDisease = chronicLiverDisease; }

    public boolean isCongestiveHeartFailure() { return congestiveHeartFailure; }
    public void setCongestiveHeartFailure(boolean congestiveHeartFailure) { this.congestiveHeartFailure = congestiveHeartFailure; }

    public boolean isMalnutrition() { return malnutrition; }
    public void setMalnutrition(boolean malnutrition) { this.malnutrition = malnutrition; }

    public boolean isStructuralLungDisease() { return structuralLungDisease; }
    public void setStructuralLungDisease(boolean structuralLungDisease) { this.structuralLungDisease = structuralLungDisease; }

    public boolean isSevereLungAspirationRisk() { return severeLungAspirationRisk; }
    public void setSevereLungAspirationRisk(boolean severeLungAspirationRisk) { this.severeLungAspirationRisk = severeLungAspirationRisk; }

    public boolean isDiabetes() { return diabetes; }
    public void setDiabetes(boolean diabetes) { this.diabetes = diabetes; }

    public boolean isChronicKidneyDisease() { return chronicKidneyDisease; }
    public void setChronicKidneyDisease(boolean chronicKidneyDisease) { this.chronicKidneyDisease = chronicKidneyDisease; }

    public boolean isChronicLungDisease() { return chronicLungDisease; }
    public void setChronicLungDisease(boolean chronicLungDisease) { this.chronicLungDisease = chronicLungDisease; }

    public boolean isSkinInfection() { return skinInfection; }
    public void setSkinInfection(boolean skinInfection) { this.skinInfection = skinInfection; }

    public boolean isEndocarditis() { return endocarditis; }
    public void setEndocarditis(boolean endocarditis) { this.endocarditis = endocarditis; }

    public boolean isPostInfluenzaMeasles() { return postInfluenzaMeasles; }
    public void setPostInfluenzaMeasles(boolean postInfluenzaMeasles) { this.postInfluenzaMeasles = postInfluenzaMeasles; }

    public boolean isSolidOrganTransplant() { return solidOrganTransplant; }
    public void setSolidOrganTransplant(boolean solidOrganTransplant) { this.solidOrganTransplant = solidOrganTransplant; }

    public boolean isBoneMarrowTransplant() { return boneMarrowTransplant; }
    public void setBoneMarrowTransplant(boolean boneMarrowTransplant) { this.boneMarrowTransplant = boneMarrowTransplant; }

    public boolean isNeutropenia() { return neutropenia; }
    public void setNeutropenia(boolean neutropenia) { this.neutropenia = neutropenia; }

    public boolean isHypogammaglobulinemia() { return hypogammaglobulinemia; }
    public void setHypogammaglobulinemia(boolean hypogammaglobulinemia) { this.hypogammaglobulinemia = hypogammaglobulinemia; }

    public boolean isImmunosuppressiveDrugs() { return immunosuppressiveDrugs; }
    public void setImmunosuppressiveDrugs(boolean immunosuppressiveDrugs) { this.immunosuppressiveDrugs = immunosuppressiveDrugs; }

    public boolean isRainySeasonMudWater() { return rainySeasonMudWater; }
    public void setRainySeasonMudWater(boolean rainySeasonMudWater) { this.rainySeasonMudWater = rainySeasonMudWater; }

    public boolean isWinterSeason() { return winterSeason; }
    public void setWinterSeason(boolean winterSeason) { this.winterSeason = winterSeason; }

    public boolean isAgeLt10OrGt65() { return ageLt10OrGt65; }
    public void setAgeLt10OrGt65(boolean ageLt10OrGt65) { this.ageLt10OrGt65 = ageLt10OrGt65; }

    public boolean isPriorMrsa() { return priorMrsa; }
    public void setPriorMrsa(boolean priorMrsa) { this.priorMrsa = priorMrsa; }

    public boolean isIvDrugUse() { return ivDrugUse; }
    public void setIvDrugUse(boolean ivDrugUse) { this.ivDrugUse = ivDrugUse; }

    public boolean isIvAntibioticsGt90d() { return ivAntibioticsGt90d; }
    public void setIvAntibioticsGt90d(boolean ivAntibioticsGt90d) { this.ivAntibioticsGt90d = ivAntibioticsGt90d; }

    public boolean isPriorAntibioticsPast3m() { return priorAntibioticsPast3m; }
    public void setPriorAntibioticsPast3m(boolean priorAntibioticsPast3m) { this.priorAntibioticsPast3m = priorAntibioticsPast3m; }

    public boolean isIntubationMechanicalVent() { return intubationMechanicalVent; }
    public void setIntubationMechanicalVent(boolean intubationMechanicalVent) { this.intubationMechanicalVent = intubationMechanicalVent; }

    public boolean isAnesthesiaHistory() { return anesthesiaHistory; }
    public void setAnesthesiaHistory(boolean anesthesiaHistory) { this.anesthesiaHistory = anesthesiaHistory; }

    public String getRapidTestPositive() { return rapidTestPositive; }
    public void setRapidTestPositive(String rapidTestPositive) { this.rapidTestPositive = rapidTestPositive; }

    public boolean isChestCtAvailable() { return chestCtAvailable; }
    public void setChestCtAvailable(boolean chestCtAvailable) { this.chestCtAvailable = chestCtAvailable; }

    public boolean isCtHomogeneousConsolidationBulgingFissure() { return ctHomogeneousConsolidationBulgingFissure; }
    public void setCtHomogeneousConsolidationBulgingFissure(boolean v) { this.ctHomogeneousConsolidationBulgingFissure = v; }

    public boolean isCtBronchopneumoniaCavitary() { return ctBronchopneumoniaCavitary; }
    public void setCtBronchopneumoniaCavitary(boolean v) { this.ctBronchopneumoniaCavitary = v; }

    public boolean isCtDiffuseLobarConsolidation() { return ctDiffuseLobarConsolidation; }
    public void setCtDiffuseLobarConsolidation(boolean v) { this.ctDiffuseLobarConsolidation = v; }

    public boolean isCtBilateralGroundGlassReticular() { return ctBilateralGroundGlassReticular; }
    public void setCtBilateralGroundGlassReticular(boolean v) { this.ctBilateralGroundGlassReticular = v; }

    public boolean isCtProgressiveGroundGlassCrazyPaving() { return ctProgressiveGroundGlassCrazyPaving; }
    public void setCtProgressiveGroundGlassCrazyPaving(boolean v) { this.ctProgressiveGroundGlassCrazyPaving = v; }

    public boolean isXrayUnclearOrRecurrent() { return xrayUnclearOrRecurrent; }
    public void setXrayUnclearOrRecurrent(boolean v) { this.xrayUnclearOrRecurrent = v; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final ClinicalRiskProfile p = new ClinicalRiskProfile();

        public Builder smoking(boolean v) { p.setSmoking(v); return this; }
        public Builder alcoholism(boolean v) { p.setAlcoholism(v); return this; }
        public Builder hiv(boolean v) { p.setHiv(v); return this; }
        public Builder cd4Lt200(boolean v) { p.setCd4Lt200(v); return this; }
        public Builder strokeNeurological(boolean v) { p.setStrokeNeurological(v); return this; }
        public Builder chronicLiverDisease(boolean v) { p.setChronicLiverDisease(v); return this; }
        public Builder congestiveHeartFailure(boolean v) { p.setCongestiveHeartFailure(v); return this; }
        public Builder malnutrition(boolean v) { p.setMalnutrition(v); return this; }
        public Builder structuralLungDisease(boolean v) { p.setStructuralLungDisease(v); return this; }
        public Builder severeLungAspirationRisk(boolean v) { p.setSevereLungAspirationRisk(v); return this; }
        public Builder diabetes(boolean v) { p.setDiabetes(v); return this; }
        public Builder chronicKidneyDisease(boolean v) { p.setChronicKidneyDisease(v); return this; }
        public Builder chronicLungDisease(boolean v) { p.setChronicLungDisease(v); return this; }
        public Builder skinInfection(boolean v) { p.setSkinInfection(v); return this; }
        public Builder endocarditis(boolean v) { p.setEndocarditis(v); return this; }
        public Builder postInfluenzaMeasles(boolean v) { p.setPostInfluenzaMeasles(v); return this; }
        public Builder solidOrganTransplant(boolean v) { p.setSolidOrganTransplant(v); return this; }
        public Builder boneMarrowTransplant(boolean v) { p.setBoneMarrowTransplant(v); return this; }
        public Builder neutropenia(boolean v) { p.setNeutropenia(v); return this; }
        public Builder hypogammaglobulinemia(boolean v) { p.setHypogammaglobulinemia(v); return this; }
        public Builder immunosuppressiveDrugs(boolean v) { p.setImmunosuppressiveDrugs(v); return this; }
        public Builder rainySeasonMudWater(boolean v) { p.setRainySeasonMudWater(v); return this; }
        public Builder winterSeason(boolean v) { p.setWinterSeason(v); return this; }
        public Builder ageLt10OrGt65(boolean v) { p.setAgeLt10OrGt65(v); return this; }
        public Builder priorMrsa(boolean v) { p.setPriorMrsa(v); return this; }
        public Builder ivDrugUse(boolean v) { p.setIvDrugUse(v); return this; }
        public Builder ivAntibioticsGt90d(boolean v) { p.setIvAntibioticsGt90d(v); return this; }
        public Builder priorAntibioticsPast3m(boolean v) { p.setPriorAntibioticsPast3m(v); return this; }
        public Builder intubationMechanicalVent(boolean v) { p.setIntubationMechanicalVent(v); return this; }
        public Builder anesthesiaHistory(boolean v) { p.setAnesthesiaHistory(v); return this; }
        public Builder rapidTestPositive(String v) { p.setRapidTestPositive(v); return this; }
        public Builder chestCtAvailable(boolean v) { p.setChestCtAvailable(v); return this; }
        public Builder ctHomogeneousConsolidationBulgingFissure(boolean v) { p.setCtHomogeneousConsolidationBulgingFissure(v); return this; }
        public Builder ctBronchopneumoniaCavitary(boolean v) { p.setCtBronchopneumoniaCavitary(v); return this; }
        public Builder ctDiffuseLobarConsolidation(boolean v) { p.setCtDiffuseLobarConsolidation(v); return this; }
        public Builder ctBilateralGroundGlassReticular(boolean v) { p.setCtBilateralGroundGlassReticular(v); return this; }
        public Builder ctProgressiveGroundGlassCrazyPaving(boolean v) { p.setCtProgressiveGroundGlassCrazyPaving(v); return this; }
        public Builder xrayUnclearOrRecurrent(boolean v) { p.setXrayUnclearOrRecurrent(v); return this; }

        public ClinicalRiskProfile build() {
            return p;
        }
    }
}
