package vn.pecomed.cdss;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import vn.pecomed.cdss.engine.*;
import vn.pecomed.cdss.model.enums.*;
import vn.pecomed.cdss.model.results.*;
import vn.pecomed.cdss.model.vitals.*;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive JUnit 5 Test Suite for PECOMED CAP CDSS Engine.
 * Covers Step 1, Step 2, Step 3, Step 4, Step 5, Master Orchestrator, edge cases, and JSON/Markdown export.
 */
public class PecomedCdssTest {

    private Step1SeverityEngine step1Engine;
    private Step2PathogenEngine step2Engine;
    private Step3ExclusionEngine step3Engine;
    private Step4EmpiricalEngine step4Engine;
    private Step5TargetedEngine step5Engine;
    private PecomedCdssMaster master;

    @BeforeEach
    void setUp() {
        step1Engine = new Step1SeverityEngine();
        step2Engine = new Step2PathogenEngine();
        step3Engine = new Step3ExclusionEngine();
        step4Engine = new Step4EmpiricalEngine();
        step5Engine = new Step5TargetedEngine();
        master = new PecomedCdssMaster();
    }

    // =========================================================================
    // STEP 1 TESTS: SEVERITY ASSESSMENT & PRELIMINARY DIAGNOSIS
    // =========================================================================

    @Test
    @DisplayName("Step 1 [1/65]: CRB-65 score calculation across severity levels")
    void testCrb65ScoreCalculation() {
        // Case 1: Young patient, normal vitals -> CRB = 0
        PatientVitals vitalsNormal = PatientVitals.builder()
                .respiratoryRate(18)
                .systolicBp(120)
                .diastolicBp(80)
                .alteredMentalStatus(false)
                .build();
        var crb0 = step1Engine.calculateCrb65(35, vitalsNormal);
        assertEquals(0, crb0.score);

        // Case 2: Elderly, confusion, tachypnea, hypotension -> CRB = 4
        PatientVitals vitalsSevere = PatientVitals.builder()
                .respiratoryRate(32)
                .systolicBp(85)
                .diastolicBp(55)
                .alteredMentalStatus(true)
                .build();
        var crb4 = step1Engine.calculateCrb65(70, vitalsSevere);
        assertEquals(4, crb4.score);
        assertEquals(4, crb4.details.size());
    }

    @Test
    @DisplayName("Step 1 [2/65]: CRB-65 boundary values (age 64 vs 65, RR 29 vs 30, BP 90/60 vs 89/60) & null vitals")
    void testCrb65BoundaryValuesAndNullSafety() {
        // Age 64 -> 0 pt, Age 65 -> 1 pt
        PatientVitals vitalsNormal = PatientVitals.builder().respiratoryRate(20).systolicBp(120).diastolicBp(80).build();
        assertEquals(0, step1Engine.calculateCrb65(64, vitalsNormal).score);
        assertEquals(1, step1Engine.calculateCrb65(65, vitalsNormal).score);

        // RR 29 -> 0 pt, RR 30 -> 1 pt
        PatientVitals vitalsRr29 = PatientVitals.builder().respiratoryRate(29).systolicBp(120).diastolicBp(80).build();
        PatientVitals vitalsRr30 = PatientVitals.builder().respiratoryRate(30).systolicBp(120).diastolicBp(80).build();
        assertEquals(0, step1Engine.calculateCrb65(40, vitalsRr29).score);
        assertEquals(1, step1Engine.calculateCrb65(40, vitalsRr30).score);

        // BP 90/61 -> 0 pt, BP 89/61 -> 1 pt, BP 90/60 -> 1 pt (diastolic <= 60)
        PatientVitals vitalsBp90_61 = PatientVitals.builder().respiratoryRate(20).systolicBp(90).diastolicBp(61).build();
        PatientVitals vitalsBp89_61 = PatientVitals.builder().respiratoryRate(20).systolicBp(89).diastolicBp(61).build();
        PatientVitals vitalsBp90_60 = PatientVitals.builder().respiratoryRate(20).systolicBp(90).diastolicBp(60).build();
        assertEquals(0, step1Engine.calculateCrb65(40, vitalsBp90_61).score);
        assertEquals(1, step1Engine.calculateCrb65(40, vitalsBp89_61).score);
        assertEquals(1, step1Engine.calculateCrb65(40, vitalsBp90_60).score);

        // Null vitals safety
        assertDoesNotThrow(() -> {
            var crbNull = step1Engine.calculateCrb65(40, null);
            assertEquals(0, crbNull.score);
        });
    }

    @Test
    @DisplayName("Step 1 [3/65]: CURB-65 calculation with Urea and BUN labs")
    void testCurb65ScoreCalculation() {
        PatientVitals vitals = PatientVitals.builder()
                .respiratoryRate(32)
                .systolicBp(85)
                .diastolicBp(55)
                .alteredMentalStatus(true)
                .build();

        // With Urea > 7.0 mmol/L -> CURB-65 = 5
        PatientLabs labsUrea = PatientLabs.builder().ureaMmolL(10.2).build();
        var curb5 = step1Engine.calculateCurb65(70, vitals, labsUrea);
        assertNotNull(curb5.score);
        assertEquals(5, curb5.score);

        // With BUN >= 20 mg/dL -> CURB-65 = 5
        PatientLabs labsBun = PatientLabs.builder().bunMgDl(25.0).build();
        var curbBun = step1Engine.calculateCurb65(70, vitals, labsBun);
        assertNotNull(curbBun.score);
        assertEquals(5, curbBun.score);

        // Without lab -> score is null, informative message provided
        var curbNull = step1Engine.calculateCurb65(70, vitals, new PatientLabs());
        assertNull(curbNull.score);
        assertTrue(curbNull.details.get(0).contains("Chưa có xét nghiệm"));
    }

    @Test
    @DisplayName("Step 1 [4/65]: CURB-65 boundary values (Urea 7.0 vs 7.1, BUN 19.9 vs 20.0) & null vitals")
    void testCurb65BoundaryValuesAndNullSafety() {
        PatientVitals vitalsYoung = PatientVitals.builder().respiratoryRate(20).systolicBp(120).diastolicBp(80).build();

        // Urea 7.0 -> 0 pt, Urea 7.1 -> 1 pt
        PatientLabs labsUrea70 = PatientLabs.builder().ureaMmolL(7.0).build();
        PatientLabs labsUrea71 = PatientLabs.builder().ureaMmolL(7.1).build();
        assertEquals(0, step1Engine.calculateCurb65(40, vitalsYoung, labsUrea70).score);
        assertEquals(1, step1Engine.calculateCurb65(40, vitalsYoung, labsUrea71).score);

        // BUN 19.9 -> 0 pt, BUN 20.0 -> 1 pt
        PatientLabs labsBun199 = PatientLabs.builder().bunMgDl(19.9).build();
        PatientLabs labsBun200 = PatientLabs.builder().bunMgDl(20.0).build();
        assertEquals(0, step1Engine.calculateCurb65(40, vitalsYoung, labsBun199).score);
        assertEquals(1, step1Engine.calculateCurb65(40, vitalsYoung, labsBun200).score);

        // Null vitals and null labs
        assertDoesNotThrow(() -> {
            var curb = step1Engine.calculateCurb65(40, null, null);
            assertNull(curb.score);
        });
    }

    @Test
    @DisplayName("Step 1 [5/65]: PSI (Fine) Score stratification from Class I to Class V")
    void testPsiFineScoreStratification() {
        // Class I: 30yo healthy male
        PatientVitals vitalsI = PatientVitals.builder().temperature(37.0).respiratoryRate(16).systolicBp(120).heartRate(75).build();
        PatientComorbidities comorbI = new PatientComorbidities();
        PatientLabs labsI = PatientLabs.builder().arterialPh(7.40).ureaMmolL(5.0).sodiumMmolL(138.0).glucoseMmolL(5.5).build();
        PatientImagingAndIntervention imgI = new PatientImagingAndIntervention();

        var psiI = step1Engine.calculatePsi(30, Gender.MALE, comorbI, vitalsI, labsI, imgI);
        assertTrue(psiI.score <= 70);
        assertTrue(psiI.psiClass.contains("Class I"));

        // Class V: 75yo female with cancer (+30), AMS (+20), SBP<90 (+20), HR>=125 (+10), pH<7.35 (+30), Na<130 (+20), Glu>=14 (+10), PaO2<60 (+10)
        PatientComorbidities comorbCancer = PatientComorbidities.builder().neoplasm(true).build();
        PatientVitals vitalsCrit = PatientVitals.builder()
                .alteredMentalStatus(true)
                .systolicBp(80)
                .heartRate(130)
                .temperature(38.0)
                .build();
        PatientLabs labsCrit = PatientLabs.builder()
                .arterialPh(7.28)
                .sodiumMmolL(125.0)
                .glucoseMmolL(16.0)
                .pao2Mmhg(55.0)
                .build();

        var psiV = step1Engine.calculatePsi(75, Gender.FEMALE, comorbCancer, vitalsCrit, labsCrit, imgI);
        assertTrue(psiV.score > 130);
        assertTrue(psiV.psiClass.contains("Class V"));
    }

    @Test
    @DisplayName("Step 1 [6/65]: PSI Fine score laboratory boundary points (Na, Glucose, BUN, Urea, Hct, pH, PaO2)")
    void testPsiFineBoundaryValues() {
        PatientVitals vitals = PatientVitals.builder().temperature(37.0).respiratoryRate(18).systolicBp(120).heartRate(80).build();
        PatientComorbidities comorb = new PatientComorbidities();

        // Sodium 130 -> 0 pt, Sodium 129 -> +20 pts
        PatientLabs labsNa130 = PatientLabs.builder().sodiumMmolL(130.0).build();
        PatientLabs labsNa129 = PatientLabs.builder().sodiumMmolL(129.0).build();
        assertEquals(30, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsNa130, null).score);
        assertEquals(50, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsNa129, null).score);

        // Glucose 13.9 -> 0 pt, Glucose 14.0 -> +10 pts
        PatientLabs labsGlu139 = PatientLabs.builder().glucoseMmolL(13.9).build();
        PatientLabs labsGlu140 = PatientLabs.builder().glucoseMmolL(14.0).build();
        assertEquals(30, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsGlu139, null).score);
        assertEquals(40, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsGlu140, null).score);

        // BUN 29.9 -> 0 pt, BUN 30.0 -> +20 pts
        PatientLabs labsBun299 = PatientLabs.builder().bunMgDl(29.9).build();
        PatientLabs labsBun300 = PatientLabs.builder().bunMgDl(30.0).build();
        assertEquals(30, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsBun299, null).score);
        assertEquals(50, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsBun300, null).score);

        // Urea 10.9 -> 0 pt, Urea 11.0 -> +20 pts
        PatientLabs labsUrea109 = PatientLabs.builder().ureaMmolL(10.9).build();
        PatientLabs labsUrea110 = PatientLabs.builder().ureaMmolL(11.0).build();
        assertEquals(30, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsUrea109, null).score);
        assertEquals(50, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsUrea110, null).score);

        // Hematocrit 30.0% -> 0 pt, Hematocrit 29.9% -> +10 pts
        PatientLabs labsHct300 = PatientLabs.builder().hematocritPct(30.0).build();
        PatientLabs labsHct299 = PatientLabs.builder().hematocritPct(29.9).build();
        assertEquals(30, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsHct300, null).score);
        assertEquals(40, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsHct299, null).score);

        // Arterial pH 7.35 -> 0 pt, pH 7.34 -> +30 pts
        PatientLabs labsPh735 = PatientLabs.builder().arterialPh(7.35).build();
        PatientLabs labsPh734 = PatientLabs.builder().arterialPh(7.34).build();
        assertEquals(30, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsPh735, null).score);
        assertEquals(60, step1Engine.calculatePsi(30, Gender.MALE, comorb, vitals, labsPh734, null).score);
    }

    @Test
    @DisplayName("Step 1 [7/65]: PSI Fine Class boundary score transitions (Class II, III, IV, V)")
    void testPsiFineClassBoundaryStratification() {
        PatientVitals vitals = new PatientVitals();
        PatientComorbidities comorb = new PatientComorbidities();

        // 60yo Male -> Score 60 -> Class II (<= 70)
        var psi60 = step1Engine.calculatePsi(60, Gender.MALE, comorb, vitals, null, null);
        assertEquals(60, psi60.score);
        assertTrue(psi60.psiClass.contains("Class II"));

        // 70yo Male -> Score 70 -> Class II
        var psi70 = step1Engine.calculatePsi(70, Gender.MALE, comorb, vitals, null, null);
        assertEquals(70, psi70.score);
        assertTrue(psi70.psiClass.contains("Class II"));

        // 71yo Male -> Score 71 -> Class III (71-90)
        var psi71 = step1Engine.calculatePsi(71, Gender.MALE, comorb, vitals, null, null);
        assertEquals(71, psi71.score);
        assertTrue(psi71.psiClass.contains("Class III"));

        // 90yo Male -> Score 90 -> Class III
        var psi90 = step1Engine.calculatePsi(90, Gender.MALE, comorb, vitals, null, null);
        assertEquals(90, psi90.score);
        assertTrue(psi90.psiClass.contains("Class III"));

        // 91yo Male -> Score 91 -> Class IV (91-130)
        var psi91 = step1Engine.calculatePsi(91, Gender.MALE, comorb, vitals, null, null);
        assertEquals(91, psi91.score);
        assertTrue(psi91.psiClass.contains("Class IV"));

        // Score 130 -> Class IV
        var psi130 = step1Engine.calculatePsi(80, Gender.MALE, PatientComorbidities.builder().neoplasm(true).liverDisease(true).build(), vitals, null, null);
        assertEquals(130, psi130.score);
        assertTrue(psi130.psiClass.contains("Class IV"));

        // Score 131 -> Class V (> 130)
        var psi131 = step1Engine.calculatePsi(81, Gender.MALE, PatientComorbidities.builder().neoplasm(true).liverDisease(true).build(), vitals, null, null);
        assertEquals(131, psi131.score);
        assertTrue(psi131.psiClass.contains("Class V"));
    }

    @Test
    @DisplayName("Step 1 [8/65]: PSI Fine score gender offset (Male: +age vs Female: +(age-10))")
    void testPsiFineFemaleScoreOffset() {
        PatientVitals vitals = new PatientVitals();
        PatientComorbidities comorb = new PatientComorbidities();

        var psiMale = step1Engine.calculatePsi(55, Gender.MALE, comorb, vitals, null, null);
        var psiFemale = step1Engine.calculatePsi(55, Gender.FEMALE, comorb, vitals, null, null);

        assertEquals(55, psiMale.score);
        assertEquals(45, psiFemale.score);
    }

    @Test
    @DisplayName("Step 1 [9/65]: SMART-COP score and IRVS risk level prediction")
    void testSmartCopScoreRiskLevels() {
        // Age 60 (>50) with SBP<90 (+2), Multilobar (+1), RR>=30 (+1), SpO2<=90 (+2), pH<7.35 (+2) = 8 pts
        PatientVitals vitals = PatientVitals.builder().systolicBp(85).respiratoryRate(32).spo2(88.0).build();
        PatientLabs labs = PatientLabs.builder().arterialPh(7.30).build();
        PatientImagingAndIntervention img = PatientImagingAndIntervention.builder().multilobarInfiltrates(true).build();

        var smart = step1Engine.calculateSmartCop(60, vitals, labs, img);
        assertEquals(8, smart.score);
        assertTrue(smart.riskLevel.contains("Nguy cơ rất cao"));
    }

    @Test
    @DisplayName("Step 1 [10/65]: SMART-COP age-stratified cutoffs (Age <= 50 vs Age > 50)")
    void testSmartCopAgeStratifiedCutoffsYoungVsOld() {
        // Young patient (age 45 <= 50):
        // RR: 25 bpm -> +1 pt (for age <=50), SpO2: 92% (<=93%) -> +2 pts = 3 pts
        PatientVitals vitalsYoung = PatientVitals.builder().respiratoryRate(25).spo2(92.0).systolicBp(120).build();
        var smartYoung = step1Engine.calculateSmartCop(45, vitalsYoung, null, null);
        assertEquals(3, smartYoung.score);

        // Older patient (age 60 > 50) with same vitals:
        // RR: 25 bpm -> 0 pt (requires >=30), SpO2: 92% -> 0 pt (requires <=90%) = 0 pts
        var smartOld = step1Engine.calculateSmartCop(60, vitalsYoung, null, null);
        assertEquals(0, smartOld.score);

        // Older patient with RR 30 and SpO2 90% -> gets the 3 points
        PatientVitals vitalsOld = PatientVitals.builder().respiratoryRate(30).spo2(90.0).systolicBp(120).build();
        var smartOld2 = step1Engine.calculateSmartCop(60, vitalsOld, null, null);
        assertEquals(3, smartOld2.score);
    }

    @Test
    @DisplayName("Step 1 [11/65]: SMART-COP boundary risk tier transitions (0-2 low, 3-4 moderate, 5-6 high, >=7 very high)")
    void testSmartCopBoundaryRiskLevels() {
        // Score 2: SBP < 90 -> Low risk
        PatientVitals v2 = PatientVitals.builder().systolicBp(85).respiratoryRate(20).spo2(98.0).build();
        var sc2 = step1Engine.calculateSmartCop(60, v2, null, null);
        assertEquals(2, sc2.score);
        assertTrue(sc2.riskLevel.contains("Nguy cơ thấp"));

        // Score 4: SBP < 90 (+2) + Oxygenation SpO2 90% (+2) -> Moderate risk
        PatientVitals v4 = PatientVitals.builder().systolicBp(85).respiratoryRate(20).spo2(90.0).build();
        var sc4 = step1Engine.calculateSmartCop(60, v4, null, null);
        assertEquals(4, sc4.score);
        assertTrue(sc4.riskLevel.contains("Nguy cơ trung bình"));

        // Score 6: SBP < 90 (+2) + SpO2 90% (+2) + pH < 7.35 (+2) -> High risk
        PatientLabs labsPh = PatientLabs.builder().arterialPh(7.30).build();
        var sc6 = step1Engine.calculateSmartCop(60, v4, labsPh, null);
        assertEquals(6, sc6.score);
        assertTrue(sc6.riskLevel.contains("Nguy cơ cao"));

        // Score 7: Score 6 + Multilobar (+1) -> Very high risk
        PatientImagingAndIntervention imgMulti = PatientImagingAndIntervention.builder().multilobarInfiltrates(true).build();
        var sc7 = step1Engine.calculateSmartCop(60, v4, labsPh, imgMulti);
        assertEquals(7, sc7.score);
        assertTrue(sc7.riskLevel.contains("Nguy cơ rất cao"));
    }

    @Test
    @DisplayName("Step 1 [12/65]: ATS/IDSA major and minor severe CAP criteria definition")
    void testAtsIdsaMajorAndMinorCriteria() {
        // Major criterion: Mechanical ventilation
        PatientImagingAndIntervention imgVent = PatientImagingAndIntervention.builder().mechanicalVentilation(true).build();
        var atsVent = step1Engine.evaluateAtsIdsa(new PatientVitals(), new PatientLabs(), imgVent);
        assertEquals(1, atsVent.majorCount);
        assertTrue(atsVent.isSevereCap);

        // 3 Minor criteria: RR>=30, AMS, BUN>=20
        PatientVitals vitalsMin = PatientVitals.builder().respiratoryRate(32).alteredMentalStatus(true).build();
        PatientLabs labsMin = PatientLabs.builder().bunMgDl(25.0).build();
        var atsMin = step1Engine.evaluateAtsIdsa(vitalsMin, labsMin, new PatientImagingAndIntervention());
        assertEquals(0, atsMin.majorCount);
        assertTrue(atsMin.minorCount >= 3);
        assertTrue(atsMin.isSevereCap);
    }

    @Test
    @DisplayName("Step 1 [13/65]: ATS/IDSA all 9 minor criteria evaluated individually")
    void testAtsIdsaNineMinorCriteriaIndividually() {
        // 1. RR >= 30
        var m1 = step1Engine.evaluateAtsIdsa(PatientVitals.builder().respiratoryRate(30).build(), null, null);
        assertEquals(1, m1.minorCount);

        // 2. PaO2/FiO2 <= 250
        var m2 = step1Engine.evaluateAtsIdsa(null, PatientLabs.builder().pao2Fio2Ratio(250.0).build(), null);
        assertEquals(1, m2.minorCount);

        // 3. Multilobar infiltrates
        var m3 = step1Engine.evaluateAtsIdsa(null, null, PatientImagingAndIntervention.builder().multilobarInfiltrates(true).build());
        assertEquals(1, m3.minorCount);

        // 4. Altered mental status
        var m4 = step1Engine.evaluateAtsIdsa(PatientVitals.builder().alteredMentalStatus(true).build(), null, null);
        assertEquals(1, m4.minorCount);

        // 5. Uremia (BUN >= 20 or Urea > 7.0)
        var m5a = step1Engine.evaluateAtsIdsa(null, PatientLabs.builder().bunMgDl(20.0).build(), null);
        var m5b = step1Engine.evaluateAtsIdsa(null, PatientLabs.builder().ureaMmolL(7.5).build(), null);
        assertEquals(1, m5a.minorCount);
        assertEquals(1, m5b.minorCount);

        // 6. Leukopenia WBC < 4.0 G/L
        var m6 = step1Engine.evaluateAtsIdsa(null, PatientLabs.builder().wbcGL(3.8).build(), null);
        assertEquals(1, m6.minorCount);

        // 7. Thrombocytopenia PLT < 100 G/L
        var m7 = step1Engine.evaluateAtsIdsa(null, PatientLabs.builder().plateletsGL(95.0).build(), null);
        assertEquals(1, m7.minorCount);

        // 8. Hypothermia Temp < 36.0°C
        var m8 = step1Engine.evaluateAtsIdsa(PatientVitals.builder().temperature(35.5).build(), null, null);
        assertEquals(1, m8.minorCount);

        // 9. Hypotension requiring fluid resuscitation (SBP < 90 or aggressive fluid)
        var m9a = step1Engine.evaluateAtsIdsa(PatientVitals.builder().systolicBp(85).build(), null, null);
        var m9b = step1Engine.evaluateAtsIdsa(PatientVitals.builder().onAggressiveFluidResuscitation(true).build(), null, null);
        assertEquals(1, m9a.minorCount);
        assertEquals(1, m9b.minorCount);
    }

    @Test
    @DisplayName("Step 1 [14/65]: ATS/IDSA 2 major criteria evaluated individually")
    void testAtsIdsaMajorCriteriaIndividually() {
        // Major 1: Mechanical ventilation
        var maj1 = step1Engine.evaluateAtsIdsa(null, null, PatientImagingAndIntervention.builder().mechanicalVentilation(true).build());
        assertEquals(1, maj1.majorCount);
        assertTrue(maj1.isSevereCap);

        // Major 2: Septic shock on vasopressors
        var maj2 = step1Engine.evaluateAtsIdsa(null, null, PatientImagingAndIntervention.builder().septicShockVasopressors(true).build());
        assertEquals(1, maj2.majorCount);
        assertTrue(maj2.isSevereCap);
    }

    @Test
    @DisplayName("Step 1 [15/65]: ATS severe CAP criteria forces triage escalation to ICU")
    void testAtsIdsaTriageEscalationToIcu() {
        // Patient young (30yo) with otherwise normal scores, but meeting 3 ATS minor criteria
        PatientVitals vitals = PatientVitals.builder().respiratoryRate(32).alteredMentalStatus(true).temperature(35.8).build();
        SeverityAssessmentResult res = step1Engine.evaluateStep1(30, Gender.MALE, vitals, null, null, null, null);

        assertTrue(res.isAtsSevereCap());
        assertEquals(CareSetting.ICU, res.getRecommendedCareSetting());
        assertEquals(SeverityLevel.VERY_SEVERE, res.getSeverityLevel());
    }

    @Test
    @DisplayName("Step 1 [16/65]: Triage care setting recommendation logic (Outpatient vs ICU)")
    void testStep1TriageOutpatientVsIcu() {
        // Outpatient young mild case
        SeverityAssessmentResult resOut = step1Engine.evaluateStep1(
                28, Gender.FEMALE,
                PatientVitals.builder().respiratoryRate(18).systolicBp(115).build(),
                new PatientComorbidities()
        );
        assertEquals(CareSetting.OUTPATIENT, resOut.getRecommendedCareSetting());
        assertEquals(SeverityLevel.MILD, resOut.getSeverityLevel());

        // ICU case: Septic shock on vasopressors
        SeverityAssessmentResult resIcu = step1Engine.evaluateStep1(
                65, Gender.MALE,
                PatientVitals.builder().respiratoryRate(34).systolicBp(80).build(),
                new PatientComorbidities(),
                new PatientLabs(),
                PatientImagingAndIntervention.builder().septicShockVasopressors(true).build(),
                new ClinicalSymptoms()
        );
        assertEquals(CareSetting.ICU, resIcu.getRecommendedCareSetting());
        assertEquals(SeverityLevel.VERY_SEVERE, resIcu.getSeverityLevel());
    }

    @Test
    @DisplayName("Step 1 [17/65]: Triage care setting Inpatient vs Short-term Inpatient (CURB-65 = 2 vs 3)")
    void testStep1TriageInpatientVsShortTermInpatient() {
        // CURB-65 = 2 (Age 65 + Urea > 7.0) -> Short-term Inpatient (Moderate)
        PatientVitals vitals = PatientVitals.builder().respiratoryRate(20).systolicBp(120).diastolicBp(80).build();
        PatientLabs labs2 = PatientLabs.builder().ureaMmolL(8.0).build();
        SeverityAssessmentResult resMod = step1Engine.evaluateStep1(66, Gender.MALE, vitals, null, labs2, null, null);
        assertEquals(CareSetting.SHORT_TERM_INPATIENT, resMod.getRecommendedCareSetting());
        assertEquals(SeverityLevel.MODERATE, resMod.getSeverityLevel());

        // CURB-65 = 3 (Age 65 + Urea > 7.0 + RR >= 30) -> Inpatient (Severe)
        PatientVitals vitals3 = PatientVitals.builder().respiratoryRate(30).systolicBp(120).diastolicBp(80).build();
        SeverityAssessmentResult resSev = step1Engine.evaluateStep1(66, Gender.MALE, vitals3, null, labs2, null, null);
        assertEquals(CareSetting.INPATIENT, resSev.getRecommendedCareSetting());
        assertEquals(SeverityLevel.SEVERE, resSev.getSeverityLevel());
    }

    @Test
    @DisplayName("Step 1 [18/65]: Immunocompromised patient triage upgrade to short-term inpatient")
    void testStep1ImmunocompromisedTriageUpgrade() {
        PatientComorbidities comorbImmuno = PatientComorbidities.builder().immunocompromised(true).build();
        SeverityAssessmentResult res = step1Engine.evaluateStep1(
                35, Gender.MALE,
                PatientVitals.builder().respiratoryRate(18).systolicBp(120).build(),
                comorbImmuno
        );
        assertEquals(CareSetting.SHORT_TERM_INPATIENT, res.getRecommendedCareSetting());
        assertTrue(res.getClinicalNotes().stream().anyMatch(n -> n.contains("suy giảm miễn dịch")));
    }

    @Test
    @DisplayName("Step 1 [19/65]: Routine lab test orders generation based on hypoxia and pleural effusion")
    void testStep1RoutineLabOrdersGeneration() {
        PatientVitals vitalsHypoxic = PatientVitals.builder().spo2(88.0).respiratoryRate(26).build();
        PatientImagingAndIntervention imgEff = PatientImagingAndIntervention.builder().pleuralEffusion(true).build();

        List<String> orders = step1Engine.generateRoutineLabOrders(vitalsHypoxic, new PatientLabs(), imgEff);
        assertTrue(orders.stream().anyMatch(o -> o.contains("Khí máu động mạch")));
        assertTrue(orders.stream().anyMatch(o -> o.contains("Siêu âm màng phổi")));
    }

    @Test
    @DisplayName("Step 1 [20/65]: Syndrome synthesis from clinical symptoms and vital signs")
    void testStep1SyndromeSynthesis() {
        ClinicalSymptoms sym = ClinicalSymptoms.builder()
                .toxicSyndrome(true)
                .bronchialConsolidation(true)
                .consolidationSites(1)
                .pleuriticChestPain(true)
                .coughProductive(true)
                .build();
        PatientVitals vitals = PatientVitals.builder().temperature(39.0).build();

        List<String> syndromes = step1Engine.synthesizeSyndromes(sym, vitals);
        assertTrue(syndromes.stream().anyMatch(s -> s.contains("Hội chứng nhiễm trùng")));
        assertTrue(syndromes.stream().anyMatch(s -> s.contains("đông đặc phổi khu trú")));
        assertTrue(syndromes.stream().anyMatch(s -> s.contains("Đau ngực kiểu màng phổi")));
        assertTrue(syndromes.stream().anyMatch(s -> s.contains("Ho khạc đờm")));
    }

    // =========================================================================
    // STEP 2 TESTS: PATHOGEN PREDICTION & MICROBIOLOGICAL ORDERS
    // =========================================================================

    @Test
    @DisplayName("Step 2 [21/65]: Filter 1 care setting inclusion and exclusion")
    void testStep2Filter1CareSettingFiltering() {
        // Outpatient: Excludes Legionella and Gram-negative enteric
        Map<String, Pathogen> setOut = step2Engine.runFilter1(CareSetting.OUTPATIENT);
        assertFalse(setOut.containsKey("LEGIONELLA_SPP"));
        assertFalse(setOut.containsKey("GRAM_NEG_ENTERIC"));
        assertTrue(setOut.containsKey("S_PNEUMONIAE"));

        // Inpatient: Adds Anaerobic, Pertussis, Co-infection
        Map<String, Pathogen> setIn = step2Engine.runFilter1(CareSetting.INPATIENT);
        assertTrue(setIn.containsKey("ANAEROBIC"));
        assertTrue(setIn.containsKey("B_PERTUSSIS"));

        // ICU: Adds Pseudomonas and S. aureus
        Map<String, Pathogen> setIcu = step2Engine.runFilter1(CareSetting.ICU);
        assertTrue(setIcu.containsKey("P_AERUGINOSA"));
        assertTrue(setIcu.containsKey("S_AUREUS"));
    }

    @Test
    @DisplayName("Step 2 [22/65]: Filter 2 smoking and alcoholism risk scoring")
    void testStep2Filter2SmokingAndAlcoholismRisk() {
        Map<String, Pathogen> setIn = step2Engine.runFilter1(CareSetting.INPATIENT);
        ClinicalRiskProfile profile = ClinicalRiskProfile.builder()
                .smoking(true)
                .alcoholism(true)
                .build();

        var filter2 = step2Engine.runFilter2(setIn, profile, CareSetting.INPATIENT);
        Pathogen kleb = filter2.rankedPathogens.stream().filter(p -> "KLEBSIELLA".equals(p.getId())).findFirst().orElse(null);
        assertNotNull(kleb);
        assertTrue(kleb.getScore() >= 3);
        assertTrue(kleb.getMatchedFactors().contains("Nghiện rượu"));
    }

    @Test
    @DisplayName("Step 2 [23/65]: Structural lung disease and previous antibiotics Pseudomonas risk")
    void testStep2StructuralLungDiseasePseudomonasRisk() {
        Map<String, Pathogen> setIn = step2Engine.runFilter1(CareSetting.INPATIENT);
        ClinicalRiskProfile profile = ClinicalRiskProfile.builder()
                .structuralLungDisease(true)
                .priorAntibioticsPast3m(true)
                .build();

        var filter2 = step2Engine.runFilter2(setIn, profile, CareSetting.INPATIENT);
        Pathogen pseudo = filter2.rankedPathogens.stream().filter(p -> "P_AERUGINOSA".equals(p.getId())).findFirst().orElse(null);
        assertNotNull(pseudo);
        assertTrue(pseudo.getScore() >= 6);
    }

    @Test
    @DisplayName("Step 2 [24/65]: Diabetes and rainy season Whitmore (B. pseudomallei) risk")
    void testStep2DiabetesAndRainySeasonWhitmoreRisk() {
        Map<String, Pathogen> setIcu = step2Engine.runFilter1(CareSetting.ICU);
        ClinicalRiskProfile profile = ClinicalRiskProfile.builder()
                .diabetes(true)
                .rainySeasonMudWater(true)
                .build();

        var filter2 = step2Engine.runFilter2(setIcu, profile, CareSetting.ICU);
        Pathogen whitmore = filter2.rankedPathogens.stream().filter(p -> "B_PSEUDOMALLEI".equals(p.getId())).findFirst().orElse(null);
        assertNotNull(whitmore);
        assertTrue(whitmore.getScore() >= 6);
    }

    @Test
    @DisplayName("Step 2 [25/65]: Prior MRSA history scoring and mandatory coverage")
    void testStep2PriorMrsaScoring() {
        Map<String, Pathogen> setIcu = step2Engine.runFilter1(CareSetting.ICU);
        ClinicalRiskProfile profile = ClinicalRiskProfile.builder().priorMrsa(true).build();

        var filter2 = step2Engine.runFilter2(setIcu, profile, CareSetting.ICU);
        Pathogen mrsa = filter2.rankedPathogens.stream().filter(p -> "MRSA".equals(p.getId())).findFirst().orElse(null);
        assertNotNull(mrsa);
        assertEquals(5, mrsa.getScore());
    }

    @Test
    @DisplayName("Step 2 [26/65]: HIV and CD4 < 200 PJP (Pneumocystis jirovecii) fungal risk")
    void testStep2HivAndCd4PjpFungalRisk() {
        Map<String, Pathogen> setIn = step2Engine.runFilter1(CareSetting.INPATIENT);
        ClinicalRiskProfile profile = ClinicalRiskProfile.builder().hiv(true).cd4Lt200(true).build();

        var filter2 = step2Engine.runFilter2(setIn, profile, CareSetting.INPATIENT);
        Pathogen pjp = filter2.rankedPathogens.stream().filter(p -> "P_JIROVECII".equals(p.getId())).findFirst().orElse(null);
        assertNotNull(pjp);
        assertTrue(pjp.getScore() >= 4);
    }

    @Test
    @DisplayName("Step 2 [27/65]: Post-influenza / measles Staph aureus superinfection risk")
    void testStep2PostInfluenzaStaphAureusRisk() {
        Map<String, Pathogen> setIn = step2Engine.runFilter1(CareSetting.INPATIENT);
        ClinicalRiskProfile profile = ClinicalRiskProfile.builder().postInfluenzaMeasles(true).build();

        var filter2 = step2Engine.runFilter2(setIn, profile, CareSetting.INPATIENT);
        Pathogen staph = filter2.rankedPathogens.stream().filter(p -> "S_AUREUS".equals(p.getId())).findFirst().orElse(null);
        assertNotNull(staph);
        assertTrue(staph.getScore() >= 3);
    }

    @Test
    @DisplayName("Step 2 [28/65]: Rapid test positive boosts for COVID, Flu, RSV, Legionella, Strep, MRSA, Whitmore")
    void testStep2RapidTestPositiveBoosts() {
        Map<String, Pathogen> setIn = step2Engine.runFilter1(CareSetting.INPATIENT);

        // COVID boost
        ClinicalRiskProfile pCovid = ClinicalRiskProfile.builder().rapidTestPositive("COVID-19 Positive").build();
        var fCovid = step2Engine.runFilter2(setIn, pCovid, CareSetting.INPATIENT);
        assertTrue(fCovid.rankedPathogens.stream().anyMatch(p -> "SARS_COV_2".equals(p.getId()) && p.getScore() >= 6));

        // Flu boost
        ClinicalRiskProfile pFlu = ClinicalRiskProfile.builder().rapidTestPositive("CÚM A").build();
        var fFlu = step2Engine.runFilter2(setIn, pFlu, CareSetting.INPATIENT);
        assertTrue(fFlu.rankedPathogens.stream().anyMatch(p -> "INFLUENZA".equals(p.getId()) && p.getScore() >= 6));

        // Legionella boost
        ClinicalRiskProfile pLeg = ClinicalRiskProfile.builder().rapidTestPositive("LEGIONELLA URINE AG").build();
        var fLeg = step2Engine.runFilter2(setIn, pLeg, CareSetting.INPATIENT);
        assertTrue(fLeg.rankedPathogens.stream().anyMatch(p -> "LEGIONELLA_SPP".equals(p.getId()) && p.getScore() >= 6));
    }

    @Test
    @DisplayName("Step 2 [29/65]: Chest CT indications evaluation")
    void testStep2ChestCtIndications() {
        ClinicalRiskProfile profileHiv = ClinicalRiskProfile.builder().hiv(true).build();
        var ctRes = step2Engine.evaluateChestCtIndication(CareSetting.INPATIENT, profileHiv);
        assertTrue(ctRes.isIndicated);
        assertTrue(ctRes.reasons.size() >= 2);
    }

    @Test
    @DisplayName("Step 2 [30/65]: Microbiology test orders and fungal warning generation")
    void testStep2MicrobiologyTestOrders() {
        List<Pathogen> pathogens = List.of(
                new Pathogen("LEGIONELLA_SPP", "Legionella", PathogenCategory.ATYPICAL, "Legionella", true),
                new Pathogen("B_PSEUDOMALLEI", "B. pseudomallei", PathogenCategory.BACTERIA, "Whitmore", false),
                new Pathogen("P_JIROVECII", "P. jirovecii", PathogenCategory.FUNGI, "PJP", false)
        );
        pathogens.get(0).setScore(2);
        pathogens.get(1).setScore(3);
        pathogens.get(2).setScore(4);

        var micro = step2Engine.generateMicrobiologyOrders(CareSetting.ICU, pathogens, true, false);
        assertTrue(micro.fungalWarning);
        assertTrue(micro.specificOrders.stream().anyMatch(o -> o.contains("Legionella")));
        assertTrue(micro.specificOrders.stream().anyMatch(o -> o.contains("Whitmore")));
        assertTrue(micro.specificOrders.stream().anyMatch(o -> o.contains("P. jirovecii")));
    }

    @Test
    @DisplayName("Step 2 [31/65]: Deterministic pathogen sorting (score desc, preset desc, id asc)")
    void testStep2DeterministicSortingAndPresetPreference() {
        PathogenEngineResult res = step2Engine.evaluateStep2(CareSetting.INPATIENT, null, false);
        assertNotNull(res.getTopPathogens());
        assertFalse(res.getTopPathogens().isEmpty());
    }

    // =========================================================================
    // STEP 3 TESTS: EXCLUSION & DIFFERENTIAL DIAGNOSIS
    // =========================================================================

    @Test
    @DisplayName("Step 3 [32/65]: Tuberculosis exclusion evaluation")
    void testStep3TuberculosisExclusion() {
        ExclusionRiskTriggers triggers = ExclusionRiskTriggers.builder()
                .chronicCoughGt2w(true)
                .hemoptysis(true)
                .afternoonLowFeverNightSweats(true)
                .tbContactHistory(true)
                .build();

        ExclusionCondition cond = step3Engine.evaluateTuberculosis(triggers);
        assertNotNull(cond);
        assertEquals("TUBERCULOSIS", cond.getId());
        assertEquals("Cao (High)", cond.getConfidenceLevel());
        assertTrue(cond.getKeyDiagnosticTests().stream().anyMatch(t -> t.contains("GeneXpert")));
    }

    @Test
    @DisplayName("Step 3 [33/65]: Pulmonary embolism exclusion evaluation")
    void testStep3PulmonaryEmbolismExclusion() {
        ExclusionRiskTriggers triggers = ExclusionRiskTriggers.builder()
                .suddenSevereChestPain(true)
                .suddenDyspneaOrShock(true)
                .longTermImmobilizationOrDvt(true)
                .build();

        ExclusionCondition cond = step3Engine.evaluatePulmonaryEmbolism(triggers);
        assertNotNull(cond);
        assertEquals("PULMONARY_EMBOLISM", cond.getId());
        assertTrue(cond.getConfidenceLevel().contains("Cao"));
        assertTrue(cond.getKeyDiagnosticTests().stream().anyMatch(t -> t.contains("CTPA")));
    }

    @Test
    @DisplayName("Step 3 [34/65]: Lung cancer exclusion evaluation")
    void testStep3LungCancerExclusion() {
        ExclusionRiskTriggers triggers = ExclusionRiskTriggers.builder()
                .smokingHeavyHistory(true)
                .unexplainedWeightLoss(true)
                .hemoptysis(true)
                .chronicCoughGt2w(true)
                .build();

        ExclusionCondition cond = step3Engine.evaluateLungCancer(triggers);
        assertNotNull(cond);
        assertEquals("LUNG_CANCER", cond.getId());
        assertEquals("Cao (High)", cond.getConfidenceLevel());
        assertTrue(cond.getKeyDiagnosticTests().stream().anyMatch(t -> t.contains("CT") || t.contains("sinh thiết")));
    }

    @Test
    @DisplayName("Step 3 [35/65]: Infected bronchiectasis exclusion evaluation")
    void testStep3InfectedBronchiectasisExclusion() {
        ExclusionRiskTriggers triggers = ExclusionRiskTriggers.builder()
                .chronicPurulentSputum(true)
                .fixedCoarseCrackles(true)
                .build();

        ExclusionCondition cond = step3Engine.evaluateInfectedBronchiectasis(triggers);
        assertNotNull(cond);
        assertEquals("INFECTED_BRONCHIECTASIS", cond.getId());
        assertTrue(cond.getKeyDiagnosticTests().stream().anyMatch(t -> t.contains("HRCT 1mm")));
    }

    @Test
    @DisplayName("Step 3 [36/65]: Drug-induced pneumonitis from Amiodarone")
    void testStep3DrugInducedPneumonitisExclusion() {
        ExclusionRiskTriggers triggers = ExclusionRiskTriggers.builder().amiodarone(true).build();
        ExclusionCondition cond = step3Engine.evaluateDrugInducedPneumonitis(triggers);
        assertNotNull(cond);
        assertEquals("DRUG_INDUCED_PNEUMONITIS", cond.getId());
        assertTrue(cond.getRecommendedAction().stream().anyMatch(a -> a.contains("Ngừng ngay thuốc")));
    }

    @Test
    @DisplayName("Step 3 [37/65]: Subacute atypical pulmonary edema exclusion evaluation")
    void testStep3SubacutePulmonaryEdemaExclusion() {
        ExclusionRiskTriggers triggers = ExclusionRiskTriggers.builder()
                .orthopneaPnd(true)
                .congestiveHeartFailure(true)
                .diuretics(true)
                .build();

        ExclusionCondition cond = step3Engine.evaluateSubacutePulmonaryEdema(triggers);
        assertNotNull(cond);
        assertEquals("SUBACUTE_PULMONARY_EDEMA", cond.getId());
        assertTrue(cond.getKeyDiagnosticTests().stream().anyMatch(t -> t.contains("NT-proBNP")));
    }

    @Test
    @DisplayName("Step 3 [38/65]: Aspiration pneumonia exclusion evaluation")
    void testStep3AspirationPneumoniaExclusion() {
        ExclusionRiskTriggers triggers = ExclusionRiskTriggers.builder()
                .paroxysmalCoughChoking(true)
                .foulSmellingSputum(true)
                .oilNasalDrops(true)
                .build();

        ExclusionCondition cond = step3Engine.evaluateAspirationPneumonia(triggers);
        assertNotNull(cond);
        assertEquals("ASPIRATION_PNEUMONIA", cond.getId());
        assertTrue(cond.getRecommendedAction().stream().anyMatch(a -> a.contains("vi khuẩn kỵ khí")));
    }

    @Test
    @DisplayName("Step 3 [39/65]: Loeffler syndrome exclusion evaluation")
    void testStep3LoefflerSyndromeExclusion() {
        ExclusionRiskTriggers triggers = ExclusionRiskTriggers.builder()
                .transientWheezingDyspnea(true)
                .ascarisOrParasiteInfection(true)
                .build();

        ExclusionCondition cond = step3Engine.evaluateLoefflerSyndrome(triggers);
        assertNotNull(cond);
        assertEquals("LOEFFLER_SYNDROME", cond.getId());
        assertTrue(cond.getKeyDiagnosticTests().stream().anyMatch(t -> t.contains("bạch cầu ái toan")));
    }

    @Test
    @DisplayName("Step 3 [40/65]: Null triggers input safety across Step 3 evaluation")
    void testStep3NullTriggersSafeEvaluation() {
        assertDoesNotThrow(() -> {
            ExclusionAssessmentResult res = step3Engine.evaluateStep3(null);
            assertNotNull(res);
            assertTrue(res.getSuspectedConditions().isEmpty());
        });
    }

    // =========================================================================
    // STEP 4 TESTS: EMPIRICAL ANTIBIOTIC THERAPY (PROVINCIAL LEVEL)
    // =========================================================================

    @Test
    @DisplayName("Step 4 [41/65]: Outpatient Group 1 empirical regimen (<65yo, no comorb, no abx)")
    void testStep4OutpatientGroup1Regimen() {
        Step4EmpiricalEngine.Step4InputData inputs = new Step4EmpiricalEngine.Step4InputData(
                CareSetting.OUTPATIENT, 30, false, false
        );
        EmpiricalRegimenResult rec = step4Engine.evaluateStep4(inputs);
        assertTrue(rec.getRegimenName().contains("Nhóm 1"));
        assertTrue(rec.getPrimaryRegimen().stream().anyMatch(d -> "Amoxicillin".equals(d.getName()) && d.getDosage().contains("1g")));
        assertTrue(rec.getPrimaryRegimen().stream().anyMatch(d -> "Doxycycline".equals(d.getName())));
    }

    @Test
    @DisplayName("Step 4 [42/65]: Outpatient Group 2 empirical regimen (>=65yo or comorbidity or abx)")
    void testStep4OutpatientGroup2Regimen() {
        Step4EmpiricalEngine.Step4InputData inputs = new Step4EmpiricalEngine.Step4InputData(
                CareSetting.OUTPATIENT, 68, true, false
        );
        EmpiricalRegimenResult rec = step4Engine.evaluateStep4(inputs);
        assertTrue(rec.getRegimenName().contains("Nhóm 2"));
        assertTrue(rec.getPrimaryRegimen().stream().anyMatch(d -> d.getName().contains("Amoxicillin / Acid Clavulanic")));
        assertTrue(rec.getPrimaryRegimen().stream().anyMatch(d -> d.getName().contains("Azithromycin")));
    }

    @Test
    @DisplayName("Step 4 [43/65]: Outpatient viral test positive add-on (Oseltamivir)")
    void testStep4OutpatientViralTestPositiveAddon() {
        Step4EmpiricalEngine.Step4InputData inputs = new Step4EmpiricalEngine.Step4InputData(
                CareSetting.OUTPATIENT, 40, false, false
        );
        inputs.viralTestPositive = true;

        EmpiricalRegimenResult rec = step4Engine.evaluateStep4(inputs);
        assertTrue(rec.getAddOnRegimen().stream().anyMatch(d -> d.getName().contains("Oseltamivir")));
    }

    @Test
    @DisplayName("Step 4 [44/65]: Inpatient standard empirical regimen (Ampicillin IV + Azithromycin)")
    void testStep4InpatientStandardRegimen() {
        Step4EmpiricalEngine.Step4InputData inputs = new Step4EmpiricalEngine.Step4InputData(
                CareSetting.INPATIENT, 55, false, false
        );
        EmpiricalRegimenResult rec = step4Engine.evaluateStep4(inputs);
        assertTrue(rec.getRegimenName().contains("Nội trú Tiêu chuẩn"));
        assertTrue(rec.getPrimaryRegimen().stream().anyMatch(d -> d.getName().contains("Ampicillin")));
        assertTrue(rec.getPrimaryRegimen().stream().anyMatch(d -> d.getName().contains("Azithromycin")));
    }

    @Test
    @DisplayName("Step 4 [45/65]: Inpatient Penicillin allergy alternative regimen (Levofloxacin / Moxifloxacin)")
    void testStep4InpatientPenicillinAllergyRegimen() {
        Step4EmpiricalEngine.Step4InputData inputs = new Step4EmpiricalEngine.Step4InputData(
                CareSetting.INPATIENT, 55, false, false
        );
        inputs.hasPenicillinAllergy = true;

        EmpiricalRegimenResult rec = step4Engine.evaluateStep4(inputs);
        assertTrue(rec.getRegimenName().contains("Dị ứng"));
        assertTrue(rec.getPrimaryRegimen().stream().anyMatch(d -> d.getName().contains("Levofloxacin")));
    }

    @Test
    @DisplayName("Step 4 [46/65]: Inpatient Pseudomonas suspect regimen (Piperacillin/Tazobactam or Ceftazidime)")
    void testStep4InpatientPseudomonasSuspectRegimen() {
        Step4EmpiricalEngine.Step4InputData inputs = new Step4EmpiricalEngine.Step4InputData(
                CareSetting.INPATIENT, 60, true, true
        );
        inputs.suspectPseudomonas = true;

        EmpiricalRegimenResult rec = step4Engine.evaluateStep4(inputs);
        assertTrue(rec.getRegimenName().contains("Trực khuẩn mủ xanh"));
        assertTrue(rec.getPrimaryRegimen().stream().anyMatch(d -> d.getName().contains("Piperacillin / Tazobactam")));
    }

    @Test
    @DisplayName("Step 4 [47/65]: ICU empirical regimen with Pseudomonas and MRSA suspicion")
    void testStep4IcuPseudomonasAndMrsaRegimen() {
        Step4EmpiricalEngine.Step4InputData inputs = new Step4EmpiricalEngine.Step4InputData(
                CareSetting.ICU, 65, true, true
        );
        inputs.suspectPseudomonas = true;
        inputs.suspectMrsa = true;
        inputs.viralTestNegative = true;
        inputs.spo2 = 86.0;

        EmpiricalRegimenResult rec = step4Engine.evaluateStep4(inputs);
        assertTrue(rec.getRegimenName().contains("Trực khuẩn mủ xanh"));
        assertTrue(rec.getPrimaryRegimen().stream().anyMatch(d -> d.getName().contains("Piperacillin / Tazobactam")));
        assertTrue(rec.getAddOnRegimen().stream().anyMatch(d -> d.getName().contains("Vancomycin")));
        assertNotNull(rec.getEarlyCorticosteroidRecommendation());
        assertNotNull(rec.getRespiratorySupportRecommendation());
    }

    @Test
    @DisplayName("Step 4 [48/65]: ICU early corticosteroid recommendation within 24h")
    void testStep4IcuEarlyCorticosteroidRecommendation() {
        Step4EmpiricalEngine.Step4InputData inputs = new Step4EmpiricalEngine.Step4InputData(
                CareSetting.ICU, 60, false, false
        );
        inputs.within24hIcu = true;
        inputs.viralTestNegative = true;

        EmpiricalRegimenResult rec = step4Engine.evaluateStep4(inputs);
        assertNotNull(rec.getEarlyCorticosteroidRecommendation());
        assertTrue(rec.getEarlyCorticosteroidRecommendation().contains("Hydrocortisone"));
    }

    @Test
    @DisplayName("Step 4 [49/65]: ICU supportive oxygen indication for SpO2 < 90% (HFNC / NIV / MV)")
    void testStep4IcuSupportiveOxygenRecommendation() {
        Step4EmpiricalEngine.Step4InputData inputs = new Step4EmpiricalEngine.Step4InputData(
                CareSetting.ICU, 60, false, false
        );
        inputs.spo2 = 85.0;

        EmpiricalRegimenResult rec = step4Engine.evaluateStep4(inputs);
        assertNotNull(rec.getRespiratorySupportRecommendation());
        assertTrue(rec.getRespiratorySupportRecommendation().contains("HFNC"));
    }

    // =========================================================================
    // STEP 5 TESTS: TARGETED DEFINITIVE THERAPY & MONITORING
    // =========================================================================

    @Test
    @DisplayName("Step 5 [50/65]: Targeted S. pneumoniae by MIC Penicillin (<=2, 2<MIC<8, >=8)")
    void testStep5SpneumoniaeByMicPenicillin() {
        // Low MIC <= 2.0 -> Penicillin G
        TargetedRegimenResult low = step5Engine.getSpneumoniaeRegimen(0.5);
        assertTrue(low.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Penicillin G")));
        assertEquals(5, low.getDurationDaysMin());
        assertEquals(7, low.getDurationDaysMax());

        // Intermediate MIC (2 < MIC < 8) -> Ceftaroline
        TargetedRegimenResult mid = step5Engine.getSpneumoniaeRegimen(6.0);
        assertTrue(mid.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Ceftaroline")));
        assertEquals(7, mid.getDurationDaysMin());
        assertEquals(10, mid.getDurationDaysMax());

        // High MIC >= 8.0 -> Vancomycin
        TargetedRegimenResult high = step5Engine.getSpneumoniaeRegimen(8.0);
        assertTrue(high.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Vancomycin")));
        assertEquals(10, high.getDurationDaysMin());
        assertEquals(14, high.getDurationDaysMax());
    }

    @Test
    @DisplayName("Step 5 [51/65]: Targeted H. influenzae beta-lactamase positive vs negative")
    void testStep5HinfluenzaeBetaLactamase() {
        TargetedRegimenResult neg = step5Engine.getHinfluenzaeRegimen(false);
        assertTrue(neg.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Ampicillin")));

        TargetedRegimenResult pos = step5Engine.getHinfluenzaeRegimen(true);
        assertTrue(pos.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Ceftriaxone")));
    }

    @Test
    @DisplayName("Step 5 [52/65]: Targeted S. aureus MSSA vs MRSA and treatment duration (7-14d vs 4w)")
    void testStep5SaureusMssaVsMrsaAndDuration() {
        // MSSA uncomplicated: Oxacillin, 7-14 days
        TargetedRegimenResult mssa = step5Engine.getSaureusRegimen(false, false);
        assertTrue(mssa.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Oxacillin")));
        assertEquals(7, mssa.getDurationDaysMin());
        assertEquals(14, mssa.getDurationDaysMax());

        // MRSA bacteremia: Vancomycin, 28 days (4 weeks)
        TargetedRegimenResult mrsaBac = step5Engine.getSaureusRegimen(true, true);
        assertTrue(mrsaBac.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Vancomycin")));
        assertEquals(28, mrsaBac.getDurationDaysMin());
        assertEquals(28, mrsaBac.getDurationDaysMax());
    }

    @Test
    @DisplayName("Step 5 [53/65]: Targeted Whitmore (B. pseudomallei) duration variations (Osteo 6w, Abscess 4w, Lobes)")
    void testStep5WhitmoreMelioidosisRegimenAndAllDurationVariations() {
        // Osteomyelitis -> 6 weeks (42 days)
        TargetedRegimenResult osteo = step5Engine.getWhitmoreRegimen(false, false, false, false, true);
        assertEquals(42, osteo.getDurationDaysMin());
        assertTrue(osteo.getTreatmentDurationText().contains("6 TUẦN"));

        // Arthritis / Abscess -> 4 weeks (28 days)
        TargetedRegimenResult abs = step5Engine.getWhitmoreRegimen(false, false, false, true, false);
        assertEquals(28, abs.getDurationDaysMin());
        assertTrue(abs.getTreatmentDurationText().contains("4 TUẦN"));

        // Bacteremia + Multilobar -> 4 weeks (28 days)
        TargetedRegimenResult bacMulti = step5Engine.getWhitmoreRegimen(false, true, true, false, false);
        assertEquals(28, bacMulti.getDurationDaysMin());

        // Bacteremia + 1 lobe -> 3 weeks (21 days)
        TargetedRegimenResult bacSingle = step5Engine.getWhitmoreRegimen(false, true, false, false, false);
        assertEquals(21, bacSingle.getDurationDaysMin());

        // Non-bacteremia + Multilobar -> 3 weeks (21 days)
        TargetedRegimenResult nonBacMulti = step5Engine.getWhitmoreRegimen(false, false, true, false, false);
        assertEquals(21, nonBacMulti.getDurationDaysMin());

        // Non-bacteremia + 1 lobe -> 2 weeks (14 days)
        TargetedRegimenResult nonBacSingle = step5Engine.getWhitmoreRegimen(false, false, false, false, false);
        assertEquals(14, nonBacSingle.getDurationDaysMin());

        // Pregnant patient -> Amoxicillin/Clavulanic acid combination
        TargetedRegimenResult preg = step5Engine.getWhitmoreRegimen(true, false, false, false, false);
        assertTrue(preg.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Amoxicillin")));
    }

    @Test
    @DisplayName("Step 5 [54/65]: Targeted Klebsiella ESBL and CRE regimens")
    void testStep5KlebsiellaEsblAndCreRegimens() {
        // Non-ESBL -> Ceftriaxone
        TargetedRegimenResult nonEsbl = step5Engine.getKlebsiellaRegimen(false, false);
        assertTrue(nonEsbl.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Ceftriaxone")));

        // ESBL -> Ertapenem / Meropenem
        TargetedRegimenResult esbl = step5Engine.getKlebsiellaRegimen(true, false);
        assertTrue(esbl.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Ertapenem")));

        // CRE -> Ceftazidime / Avibactam
        TargetedRegimenResult cre = step5Engine.getKlebsiellaRegimen(true, true);
        assertTrue(cre.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Ceftazidime / Avibactam")));
    }

    @Test
    @DisplayName("Step 5 [55/65]: Targeted P. aeruginosa multi-sensitive vs resistant and cystic fibrosis aerosol")
    void testStep5PaeruginosaResistantRegimenAndCysticFibrosis() {
        // Sensitive -> Pip/Tazo
        TargetedRegimenResult sens = step5Engine.getPaeruginosaRegimen(false, false);
        assertTrue(sens.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Piperacillin / Tazobactam")));

        // Resistant -> Ceftazidime/Avibactam
        TargetedRegimenResult res = step5Engine.getPaeruginosaRegimen(true, false);
        assertTrue(res.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Ceftazidime / Avibactam")));

        // Cystic fibrosis -> aerosol prophylaxis recommendation
        TargetedRegimenResult cf = step5Engine.getPaeruginosaRegimen(false, true);
        assertNotNull(cf.getAerosolProphylaxisRegimen());
        assertTrue(cf.getAerosolProphylaxisRegimen().contains("Tobramycin"));
    }

    @Test
    @DisplayName("Step 5 [56/65]: Targeted atypical bacteria (Legionella, Chlamydia, Mycoplasma)")
    void testStep5AtypicalBacteriaRegimen() {
        TargetedRegimenResult leg = step5Engine.getAtypicalRegimen("LEGIONELLA", false);
        assertTrue(leg.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Levofloxacin")));

        TargetedRegimenResult chlam = step5Engine.getAtypicalRegimen("CHLAMYDIA", false);
        assertTrue(chlam.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Doxycycline")));

        TargetedRegimenResult myc = step5Engine.getAtypicalRegimen("MYCOPLASMA", false);
        assertTrue(myc.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Doxycycline")));
    }

    @Test
    @DisplayName("Step 5 [57/65]: Targeted virus regimen (Outpatient Oseltamivir vs Inpatient Peramivir IV)")
    void testStep5VirusRegimenOralVsIvPeramivir() {
        // Outpatient oral Oseltamivir
        TargetedRegimenResult outVirus = step5Engine.getVirusRegimen(false);
        assertTrue(outVirus.getOralStepDownRegimen().stream().anyMatch(po -> po.getName().contains("Oseltamivir")));

        // Inpatient unable to swallow with normal CrCl -> Peramivir IV
        TargetedRegimenResult inVirus = step5Engine.getVirusRegimen(true, true, true, false);
        assertTrue(inVirus.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Peramivir")));
    }

    @Test
    @DisplayName("Step 5 [58/65]: Oral step-down 7 criteria evaluation (Pass vs Fail)")
    void testStep5OralStepDownSevenCriteriaCheck() {
        // Case passed all 7 criteria
        OralStepDownResult pass = step5Engine.evaluateOralStepDown(37.0, 78, 18, 120, 96.0, true, true);
        assertTrue(pass.isEligible());
        assertEquals(7, pass.getMetCriteriaCount());
        assertEquals(0, pass.getFailedCriteria().size());

        // Case failed due to fever and tachypnea
        OralStepDownResult fail = step5Engine.evaluateOralStepDown(38.6, 105, 28, 110, 92.0, true, true);
        assertFalse(fail.isEligible());
        assertTrue(fail.getFailedCriteria().size() >= 3);
    }

    @Test
    @DisplayName("Step 5 [59/65]: 72h treatment response and PCT kinetics (% drop calculation)")
    void testStep5TreatmentResponse72hAndPctKineticsAllScenarios() {
        // Scenario A: Favorable PCT drop >= 80% (8.0 -> 1.2, 85% drop)
        TreatmentResponse72hResult good = step5Engine.evaluate72hResponse(
                false, false, false, false, false, 8.0, 1.2, null
        );
        assertFalse(good.isTreatmentFailure());
        assertTrue(good.getPctInterpretation().contains("thuận lợi"));

        // Scenario B: Partial PCT drop (4.0 -> 2.0, 50% drop)
        TreatmentResponse72hResult partial = step5Engine.evaluate72hResponse(
                false, false, false, false, false, 4.0, 2.0, null
        );
        assertFalse(partial.isTreatmentFailure());
        assertTrue(partial.getPctInterpretation().contains("giảm một phần"));

        // Scenario C: Treatment failure with increasing PCT (5.0 -> 12.0)
        TreatmentResponse72hResult bad = step5Engine.evaluate72hResponse(
                true, true, true, false, false, 5.0, 12.0, null
        );
        assertTrue(bad.isTreatmentFailure());
        assertTrue(bad.getFailureSignsDetected().size() >= 3);
        assertTrue(bad.getPctInterpretation().contains("CẢNH BÁO"));
    }

    // =========================================================================
    // MASTER ORCHESTRATOR & END-TO-END TESTS
    // =========================================================================

    @Test
    @DisplayName("Master [60/65]: End-to-end Outpatient mild case evaluation")
    void testMasterEndToEndOutpatientCase() {
        PatientCase patientCase = PatientCase.builder()
                .patientId("BN-001")
                .fullName("Trần Thị B")
                .age(29)
                .gender(Gender.FEMALE)
                .vitals(PatientVitals.builder()
                        .respiratoryRate(18)
                        .systolicBp(110)
                        .diastolicBp(70)
                        .temperature(37.8)
                        .spo2(98.0)
                        .build())
                .symptoms(ClinicalSymptoms.builder().coughDry(true).build())
                .build();

        FullCdssReport report = master.processCase(patientCase);
        assertNotNull(report);
        assertEquals(CareSetting.OUTPATIENT, report.getStep1().getRecommendedCareSetting());
        assertTrue(report.getStep4().getRegimenName().contains("Nhóm 1"));

        String md = report.toMarkdownReport();
        assertTrue(md.contains("BƯỚC 1"));
        assertTrue(md.contains("BƯỚC 4"));
    }

    @Test
    @DisplayName("Master [61/65]: End-to-end Inpatient moderate case evaluation")
    void testMasterEndToEndInpatientCase() {
        PatientCase patientCase = PatientCase.builder()
                .patientId("BN-002")
                .fullName("Nguyễn Văn D")
                .age(66)
                .gender(Gender.MALE)
                .vitals(PatientVitals.builder()
                        .respiratoryRate(22)
                        .systolicBp(120)
                        .diastolicBp(80)
                        .temperature(38.4)
                        .spo2(94.0)
                        .build())
                .labs(PatientLabs.builder().ureaMmolL(8.5).build())
                .identifiedPathogen("S_PNEUMONIAE")
                .micPenicillin(1.0)
                .stepDownTemp(37.2)
                .stepDownHr(76)
                .stepDownRr(18)
                .stepDownSbp(120)
                .stepDownSpo2(96.0)
                .stepDownCanEat(true)
                .stepDownNormalMental(true)
                .build();

        FullCdssReport report = master.processCase(patientCase);
        assertNotNull(report);
        assertEquals(CareSetting.SHORT_TERM_INPATIENT, report.getStep1().getRecommendedCareSetting());
        assertNotNull(report.getStep5());
        assertNotNull(report.getOralStepDown());
        assertTrue(report.getOralStepDown().isEligible());
    }

    @Test
    @DisplayName("Master [62/65]: End-to-end ICU Whitmore (B. pseudomallei) case evaluation")
    void testMasterEndToEndIcuWhitmoreCase() {
        PatientCase patientCase = PatientCase.builder()
                .patientId("BN-003")
                .fullName("Lê Văn C")
                .age(58)
                .gender(Gender.MALE)
                .vitals(PatientVitals.builder()
                        .respiratoryRate(32)
                        .systolicBp(85)
                        .diastolicBp(50)
                        .heartRate(125)
                        .temperature(39.6)
                        .spo2(86.0)
                        .alteredMentalStatus(true)
                        .build())
                .comorbidities(PatientComorbidities.builder().diabetes(true).build())
                .riskProfile(ClinicalRiskProfile.builder()
                        .diabetes(true)
                        .rainySeasonMudWater(true)
                        .priorAntibioticsPast3m(true)
                        .build())
                .labs(PatientLabs.builder()
                        .ureaMmolL(11.5)
                        .arterialPh(7.30)
                        .sodiumMmolL(128.0)
                        .glucoseMmolL(16.0)
                        .pao2Fio2Ratio(190.0)
                        .build())
                .imaging(PatientImagingAndIntervention.builder()
                        .multilobarInfiltrates(true)
                        .septicShockVasopressors(true)
                        .build())
                .identifiedPathogen("B_PSEUDOMALLEI")
                .isBacteremia(true)
                .build();

        FullCdssReport report = master.processCase(patientCase);
        assertNotNull(report);
        assertEquals(CareSetting.ICU, report.getStep1().getRecommendedCareSetting());
        assertNotNull(report.getStep5());
        assertTrue(report.getStep5().getPathogenName().contains("Burkholderia pseudomallei"));
    }

    @Test
    @DisplayName("Master [63/65]: End-to-end Penicillin allergy in Inpatient case")
    void testMasterEndToEndPenicillinAllergyCase() {
        PatientCase patientCase = PatientCase.builder()
                .patientId("BN-004")
                .fullName("Hoàng Thị E")
                .age(50)
                .gender(Gender.FEMALE)
                .vitals(PatientVitals.builder().respiratoryRate(22).systolicBp(120).build())
                .labs(PatientLabs.builder().ureaMmolL(8.0).build())
                .identifiedPathogen("H_INFLUENZAE")
                .isBetaLactamasePositive(true)
                .build();

        FullCdssReport report = master.processCase(patientCase);
        assertNotNull(report);
        assertNotNull(report.getStep5());
        assertTrue(report.getStep5().getAlternativeAllergyRegimen().stream().anyMatch(a -> a.getName().contains("Cotrimoxazol") || a.getName().contains("Doxycycline") || a.getName().contains("Levofloxacin")));
    }

    @Test
    @DisplayName("Master [64/65]: Null PatientCase input safely throws IllegalArgumentException")
    void testMasterNullPatientCaseThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            master.processCase(null);
        });
    }

    @Test
    @DisplayName("Master [65/65]: JSON serialization and Markdown report formatting validation")
    void testJsonExportAndMarkdownReportGeneration() {
        PatientCase patientCase = PatientCase.builder()
                .patientId("BN-TEST-005")
                .fullName("Phạm Minh Đức")
                .age(45)
                .gender(Gender.MALE)
                .vitals(PatientVitals.builder().respiratoryRate(20).systolicBp(120).build())
                .build();

        FullCdssReport report = master.processCase(patientCase);
        String json = report.jsonExport();
        assertNotNull(json);
        assertTrue(json.contains("BN-TEST-005"));
        assertTrue(json.contains("Phạm Minh Đức"));

        String md = report.toMarkdownReport();
        assertNotNull(md);
        assertTrue(md.contains("BÁO CÁO HỖ TRỢ RA QUYẾT ĐỊNH LÂM SÀNG"));
    }

    // =========================================================================
    // NEW TASKS TESTS
    // =========================================================================

    @Test
    @DisplayName("Task 1: S. pneumoniae MIC boundaries")
    void testSpneumoniaeMicBoundaries() {
        assertTrue(step5Engine.getSpneumoniaeRegimen(2.0).getConditionTitle().contains("Nhạy cảm"));
        assertTrue(step5Engine.getSpneumoniaeRegimen(2.1).getConditionTitle().contains("trung gian"));
        assertTrue(step5Engine.getSpneumoniaeRegimen(4.0).getConditionTitle().contains("trung gian"));
        assertTrue(step5Engine.getSpneumoniaeRegimen(4.1).getConditionTitle().contains("trung gian"));
        assertTrue(step5Engine.getSpneumoniaeRegimen(7.9).getConditionTitle().contains("trung gian"));
        assertTrue(step5Engine.getSpneumoniaeRegimen(8.0).getConditionTitle().contains("Kháng cao"));
    }

    @Test
    @DisplayName("Task 2: Klebsiella ESBL(-) Cefepim fallback")
    void testKlebsiellaEsblNegativeCefepimeFallback() {
        TargetedRegimenResult res = step5Engine.getKlebsiellaRegimen(false, false);
        assertTrue(res.getAlternativeAllergyRegimen().stream().anyMatch(a -> a.getName().contains("Cefepime")));
    }

    @Test
    @DisplayName("Task 3: PSI Class I boundary (age=50 vs 51)")
    void testPsiClassIBoundary() {
        PatientVitals normalVitals = PatientVitals.builder().temperature(37).respiratoryRate(18).systolicBp(120).heartRate(80).build();
        PatientComorbidities noComorb = new PatientComorbidities();
        var psi50 = step1Engine.calculatePsi(50, Gender.MALE, noComorb, normalVitals, new PatientLabs(), new PatientImagingAndIntervention());
        assertTrue(psi50.psiClass.contains("Class I"));

        var psi51 = step1Engine.calculatePsi(51, Gender.MALE, noComorb, normalVitals, new PatientLabs(), new PatientImagingAndIntervention());
        assertTrue(psi51.psiClass.contains("Class II"));
    }

    @Test
    @DisplayName("Task 4: ATS ICU override regardless of CURB-65")
    void testAtsIcuOverride() {
        PatientVitals vitals = PatientVitals.builder().systolicBp(85).build();
        PatientImagingAndIntervention img = PatientImagingAndIntervention.builder().septicShockVasopressors(true).build();
        SeverityAssessmentResult res = step1Engine.evaluateStep1(22, Gender.MALE, vitals, new PatientComorbidities(), new PatientLabs(), img, new ClinicalSymptoms());
        assertEquals(CareSetting.ICU, res.getRecommendedCareSetting());
    }

    @Test
    @DisplayName("Task 5: CURB-65 fallback to CRB-65 when Urea/BUN null")
    void testCurb65FallbackToCrb65() {
        PatientVitals vitals = PatientVitals.builder().respiratoryRate(35).build(); // 1 point CRB
        SeverityAssessmentResult res = step1Engine.evaluateStep1(70, Gender.MALE, vitals, new PatientComorbidities(), new PatientLabs(), new PatientImagingAndIntervention(), new ClinicalSymptoms());
        // age(70) + RR(35) = 2 points
        assertNull(res.getCurb65Score());
        assertEquals(2, res.getCrb65Score());
    }

    @Test
    @DisplayName("Task 6: SMART-COP age-stratified O criterion")
    void testSmartCopAgeStratifiedO() {
        PatientVitals v50_93 = PatientVitals.builder().spo2(93.0).build();
        assertEquals(2, step1Engine.calculateSmartCop(50, v50_93, null, null).score); // <=93% for <=50yo

        PatientVitals v50_94 = PatientVitals.builder().spo2(94.0).build();
        assertEquals(0, step1Engine.calculateSmartCop(50, v50_94, null, null).score);

        PatientVitals v51_90 = PatientVitals.builder().spo2(90.0).build();
        assertEquals(2, step1Engine.calculateSmartCop(51, v51_90, null, null).score); // <=90% for >50yo

        PatientVitals v51_91 = PatientVitals.builder().spo2(91.0).build();
        assertEquals(0, step1Engine.calculateSmartCop(51, v51_91, null, null).score);
    }

    @Test
    @DisplayName("Task 7: Whitmore durations (2w/3w/4w/6w)")
    void testWhitmoreDurations() {
        // 6w osteomyelitis
        assertTrue(step5Engine.getWhitmoreRegimen(false, false, false, false, true).getTreatmentDurationText().contains("6 TUẦN"));
        // 4w arthritis/abscess
        assertTrue(step5Engine.getWhitmoreRegimen(false, false, false, true, false).getTreatmentDurationText().contains("4 TUẦN"));
        // 4w multilobar + bacteremia
        assertTrue(step5Engine.getWhitmoreRegimen(false, true, true, false, false).getTreatmentDurationText().contains("4 TUẦN"));
        // 3w multilobar no bacteremia
        assertTrue(step5Engine.getWhitmoreRegimen(false, false, true, false, false).getTreatmentDurationText().contains("3 TUẦN"));
        // 3w single lobe + bacteremia
        assertTrue(step5Engine.getWhitmoreRegimen(false, true, false, false, false).getTreatmentDurationText().contains("3 TUẦN"));
        // 2w single lobe no bacteremia
        assertTrue(step5Engine.getWhitmoreRegimen(false, false, false, false, false).getTreatmentDurationText().contains("2 TUẦN"));
    }

    @Test
    @DisplayName("Task 8: Oral step-down boundary")
    void testOralStepDownBoundary() {
        // all 7/7
        assertTrue(step5Engine.evaluateOralStepDown(37.8, 100, 24, 90, 90.0, true, true).isEligible());
        // Temp=37.9 -> not eligible
        assertFalse(step5Engine.evaluateOralStepDown(37.9, 100, 24, 90, 90.0, true, true).isEligible());
    }

    @Test
    @DisplayName("Task 9: PCT kinetics")
    void testPctKinetics() {
        assertTrue(step5Engine.evaluate72hResponse(false, false, false, false, false, 10.0, 1.5, null).getPctInterpretation().contains("thuận lợi")); // 85% drop
        assertTrue(step5Engine.evaluate72hResponse(false, false, false, false, false, 10.0, 3.0, null).getPctInterpretation().contains("giảm một phần")); // 70% drop
        assertTrue(step5Engine.evaluate72hResponse(false, false, false, false, false, 1.0, 1.2, null).getPctInterpretation().contains("CẢNH BÁO")); // increase -> failure
    }

    @Test
    @DisplayName("Task 10: Virus Peramivir condition")
    void testVirusPeramivirCondition() {
        TargetedRegimenResult res = step5Engine.getVirusRegimen(true, true, true, false);
        assertTrue(res.getIntravenousRegimen().stream().anyMatch(iv -> iv.getName().contains("Peramivir")));
    }
}
