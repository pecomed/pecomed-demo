package vn.pecomed.cdss.model.results;

import vn.pecomed.cdss.model.enums.CareSetting;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of Step 2 Pathogen Prediction & Microbiology Test Indications.
 */
public class PathogenEngineResult {
    private CareSetting careSetting;
    private int candidateSetACount;
    private List<Pathogen> candidateSetB = new ArrayList<>();
    private List<Pathogen> topPathogens = new ArrayList<>();
    private List<String> generalLabOrders = new ArrayList<>();
    private List<String> specificLabOrders = new ArrayList<>();
    private boolean chestCtIndicated;
    private List<String> chestCtReasons = new ArrayList<>();
    private boolean fungalWarning;
    private List<String> clinicalRationale = new ArrayList<>();

    public PathogenEngineResult() {
    }

    public CareSetting getCareSetting() {
        return careSetting;
    }

    public void setCareSetting(CareSetting careSetting) {
        this.careSetting = careSetting;
    }

    public int getCandidateSetACount() {
        return candidateSetACount;
    }

    public void setCandidateSetACount(int candidateSetACount) {
        this.candidateSetACount = candidateSetACount;
    }

    public List<Pathogen> getCandidateSetB() {
        return candidateSetB;
    }

    public void setCandidateSetB(List<Pathogen> candidateSetB) {
        this.candidateSetB = candidateSetB;
    }

    public List<Pathogen> getTopPathogens() {
        return topPathogens;
    }

    public void setTopPathogens(List<Pathogen> topPathogens) {
        this.topPathogens = topPathogens;
    }

    public List<String> getGeneralLabOrders() {
        return generalLabOrders;
    }

    public void setGeneralLabOrders(List<String> generalLabOrders) {
        this.generalLabOrders = generalLabOrders;
    }

    public List<String> getSpecificLabOrders() {
        return specificLabOrders;
    }

    public void setSpecificLabOrders(List<String> specificLabOrders) {
        this.specificLabOrders = specificLabOrders;
    }

    public boolean isChestCtIndicated() {
        return chestCtIndicated;
    }

    public void setChestCtIndicated(boolean chestCtIndicated) {
        this.chestCtIndicated = chestCtIndicated;
    }

    public List<String> getChestCtReasons() {
        return chestCtReasons;
    }

    public void setChestCtReasons(List<String> chestCtReasons) {
        this.chestCtReasons = chestCtReasons;
    }

    public boolean isFungalWarning() {
        return fungalWarning;
    }

    public void setFungalWarning(boolean fungalWarning) {
        this.fungalWarning = fungalWarning;
    }

    public List<String> getClinicalRationale() {
        return clinicalRationale;
    }

    public void setClinicalRationale(List<String> clinicalRationale) {
        this.clinicalRationale = clinicalRationale;
    }
}
