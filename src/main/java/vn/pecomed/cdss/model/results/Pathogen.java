package vn.pecomed.cdss.model.results;

import vn.pecomed.cdss.model.enums.PathogenCategory;

import java.util.ArrayList;
import java.util.List;

/**
 * Pathogen candidate model.
 */
public class Pathogen {
    private String id;
    private String name;
    private PathogenCategory category;
    private String vietnameseName = "";
    private boolean isPreset = true;
    private int score = 0;
    private List<String> matchedFactors = new ArrayList<>();

    public Pathogen() {
    }

    public Pathogen(String id, String name, PathogenCategory category, String vietnameseName) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.vietnameseName = vietnameseName;
        this.isPreset = true;
        this.score = 0;
        this.matchedFactors = new ArrayList<>();
    }

    public Pathogen(String id, String name, PathogenCategory category, String vietnameseName, boolean isPreset) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.vietnameseName = vietnameseName;
        this.isPreset = isPreset;
        this.score = 0;
        this.matchedFactors = new ArrayList<>();
    }

    public Pathogen copy() {
        Pathogen p = new Pathogen(this.id, this.name, this.category, this.vietnameseName, this.isPreset);
        p.setScore(this.score);
        p.setMatchedFactors(new ArrayList<>(this.matchedFactors));
        return p;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PathogenCategory getCategory() {
        return category;
    }

    public void setCategory(PathogenCategory category) {
        this.category = category;
    }

    public String getVietnameseName() {
        return vietnameseName;
    }

    public void setVietnameseName(String vietnameseName) {
        this.vietnameseName = vietnameseName;
    }

    public boolean isPreset() {
        return isPreset;
    }

    public void setPreset(boolean preset) {
        isPreset = preset;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<String> getMatchedFactors() {
        return matchedFactors;
    }

    public void setMatchedFactors(List<String> matchedFactors) {
        this.matchedFactors = matchedFactors;
    }

    public void addMatchedFactor(String factor, int scoreIncrement) {
        this.matchedFactors.add(factor);
        this.score += scoreIncrement;
    }
}
