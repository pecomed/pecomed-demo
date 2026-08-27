import { describe, it, expect } from 'vitest';
import { PecomedCdssMaster } from '../src/engine/PecomedCdssMaster.js';
import { Step1SeverityEngine } from '../src/engine/Step1SeverityEngine.js';
import { Step2PathogenEngine } from '../src/engine/Step2PathogenEngine.js';
import { Step3ExclusionEngine } from '../src/engine/Step3ExclusionEngine.js';
import { Step4EmpiricalEngine } from '../src/engine/Step4EmpiricalEngine.js';
import { Step5TargetedEngine } from '../src/engine/Step5TargetedEngine.js';
import { PatientCase } from '../src/models/types.js';

describe('PECOMED CAP CDSS - Complete Clinical Engine Test Suite', () => {
  const master = new PecomedCdssMaster();
  const step1 = new Step1SeverityEngine();
  const step2 = new Step2PathogenEngine();
  const step3 = new Step3ExclusionEngine();
  const step4 = new Step4EmpiricalEngine();
  const step5 = new Step5TargetedEngine();

  // TEST 1: S. pneumoniae MIC boundaries
  it('1. S. pneumoniae MIC boundaries (<=2 sensitive, 2.1-7.9 intermediate, >=8 resistant)', () => {
    const sens = step5.getSpneumoniaeRegimen(2.0);
    expect(sens.pathogenName).toContain('nhạy cảm');
    expect(sens.targetedAntibiotics.some(a => a.includes('Penicillin G'))).toBe(true);

    const inter1 = step5.getSpneumoniaeRegimen(2.1);
    expect(inter1.pathogenName).toContain('Trung gian');
    expect(inter1.targetedAntibiotics.some(a => a.includes('Ceftaroline'))).toBe(true);

    const inter2 = step5.getSpneumoniaeRegimen(4.0);
    expect(inter2.pathogenName).toContain('Trung gian');

    const inter3 = step5.getSpneumoniaeRegimen(7.9);
    expect(inter3.pathogenName).toContain('Trung gian');

    const res = step5.getSpneumoniaeRegimen(8.0);
    expect(res.pathogenName).toContain('Kháng');
    expect(res.targetedAntibiotics.some(a => a.includes('Vancomycin'))).toBe(true);
  });

  // TEST 2: H. influenzae & M. catarrhalis
  it('2. H. influenzae & M. catarrhalis targeted regimens', () => {
    const nonBl = step5.getHInfluenzaeMCatarrhalisRegimen(false, false);
    expect(nonBl.targetedAntibiotics.some(a => a.includes('Ampicillin 2g'))).toBe(true);

    const blPos = step5.getHInfluenzaeMCatarrhalisRegimen(true, false);
    expect(blPos.targetedAntibiotics.some(a => a.includes('Ceftriaxone'))).toBe(true);

    const allergy = step5.getHInfluenzaeMCatarrhalisRegimen(false, true);
    expect(allergy.targetedAntibiotics.some(a => a.includes('Cotrimoxazole'))).toBe(true);
  });

  // TEST 3: Klebsiella ESBL(-) fallback & ESBL(+) Carbapenem-R
  it('3. Klebsiella ESBL(-) vs ESBL(+) Carbapenem Resistant', () => {
    const nonEsbl = step5.getKlebsiellaRegimen(false, false);
    expect(nonEsbl.pathogenName).toContain('Không sinh ESBL');
    expect(nonEsbl.dosageAndAdministration).toContain('Cefepime');

    const esblSens = step5.getKlebsiellaRegimen(true, false);
    expect(esblSens.targetedAntibiotics.some(a => a.includes('Meropenem'))).toBe(true);

    const cre = step5.getKlebsiellaRegimen(true, true);
    expect(cre.targetedAntibiotics.some(a => a.includes('Ceftazidime / Avibactam'))).toBe(true);
  });

  // TEST 4: ATS 2007 Major vs Minor Criteria Bug Fix
  it('4. ATS 2007: Fluid resuscitation alone is minor criterion, does not trigger ICU by itself', () => {
    // Patient has ONLY fluid resuscitation (minor #9) and no other criteria
    const ats1Minor = step1.calculateAtsIdsa({ systolicBp: 88, onAggressiveFluidResuscitation: true }, {}, {});
    expect(ats1Minor.majorCount).toBe(0);
    expect(ats1Minor.minorCount).toBe(1);
    expect(ats1Minor.isSevereCap).toBe(false);

    // Patient with vasopressors triggers Major criterion
    const atsMajor = step1.calculateAtsIdsa({}, {}, { septicShockVasopressors: true });
    expect(atsMajor.majorCount).toBe(1);
    expect(atsMajor.isSevereCap).toBe(true);
  });

  // TEST 5: CURB-65 Triage Alignment
  it('5. CURB-65 = 3 is Inpatient High Risk, CURB-65 >= 4 is ICU', () => {
    // CURB-65 = 3 (Age 65, Ure 8.0, RR 32)
    const p3 = step1.evaluate(65, 'MALE', { respiratoryRate: 32 }, {}, { ureaMmolL: 8.0 });
    expect(p3.curb65Score).toBe(3);
    expect(p3.recommendedCareSetting).toContain('Nội trú (Trung bình - Nguy cơ cao)');

    // CURB-65 = 4 (Age 65, Ure 8.0, RR 32, SBP 80)
    const p4 = step1.evaluate(65, 'MALE', { respiratoryRate: 32, systolicBp: 80 }, {}, { ureaMmolL: 8.0 });
    expect(p4.curb65Score).toBe(4);
    expect(p4.recommendedCareSetting).toContain('ICU');
  });

  // TEST 6: SMART-COP age-stratified Oxygenation cutoff
  it('6. SMART-COP age-stratified Oxygenation cutoff', () => {
    // Age <= 50, SpO2 <= 93% -> +2 pts
    const youngLow = step1.calculateSmartCop(50, { spo2: 93 });
    expect(youngLow.score).toBe(2);

    const youngNormal = step1.calculateSmartCop(50, { spo2: 94 });
    expect(youngNormal.score).toBe(0);

    // Age > 50, SpO2 <= 90% -> +2 pts
    const olderLow = step1.calculateSmartCop(55, { spo2: 90 });
    expect(olderLow.score).toBe(2);

    const olderNormal = step1.calculateSmartCop(55, { spo2: 91 });
    expect(olderNormal.score).toBe(0);
  });

  // TEST 7: Whitmore (Burkholderia pseudomallei) 6 duration pathways & pregnancy
  it('7. Whitmore duration pathways and pregnancy regimen', () => {
    const std = step5.getWhitmoreRegimen(false, false, false, false);
    expect(std.duration).toContain('Tối thiểu 2 tuần');

    const multi = step5.getWhitmoreRegimen(false, true, false, false);
    expect(multi.duration).toContain('Tối thiểu 3 tuần');

    const bacteremic = step5.getWhitmoreRegimen(true, false, false, false);
    expect(bacteremic.duration).toContain('Tối thiểu 3 tuần');

    const bacteremicMulti = step5.getWhitmoreRegimen(true, true, false, false);
    expect(bacteremicMulti.duration).toContain('Tối thiểu 4 tuần');

    const arthritis = step5.getWhitmoreRegimen(false, false, true, false);
    expect(arthritis.duration).toContain('Tối thiểu 4 tuần');

    const osteo = step5.getWhitmoreRegimen(false, false, false, true);
    expect(osteo.duration).toContain('Tối thiểu 6 tuần');

    const preg = step5.getWhitmoreRegimen(false, false, false, false, true);
    expect(preg.targetedAntibiotics.some(a => a.includes('Augmentin') || a.includes('Amoxicillin'))).toBe(true);
  });

  // TEST 8: Oral Step-down 7 criteria inclusive boundary cutoffs
  it('8. Oral Step-down: HR=100 and RR=24 are INCLUSIVE passing boundaries', () => {
    // Exactly at thresholds (HR=100, RR=24, Temp=37.8) -> All 7/7 pass!
    const exactThreshold = step5.evaluateOralStepDown(37.8, 100, 24, 90, 90, true, true);
    expect(exactThreshold.eligible).toBe(true);
    expect(exactThreshold.metCriteriaCount).toBe(7);

    // HR=101 fails
    const hrFail = step5.evaluateOralStepDown(37.8, 101, 24, 90, 90, true, true);
    expect(hrFail.eligible).toBe(false);
    expect(hrFail.metCriteriaCount).toBe(6);

    // RR=25 fails
    const rrFail = step5.evaluateOralStepDown(37.8, 100, 25, 90, 90, true, true);
    expect(rrFail.eligible).toBe(false);
    expect(rrFail.metCriteriaCount).toBe(6);
  });

  // TEST 9: Procalcitonin (PCT) Kinetics Evaluation
  it('9. Procalcitonin (PCT) kinetics evaluation', () => {
    // 85% drop (10.0 -> 1.5)
    const favorable = step5.evaluate72hResponse(false, false, false, false, false, 10.0, 1.5);
    expect(favorable.isTreatmentFailure).toBe(false);
    expect(favorable.pctKineticsInterpretation).toContain('RẤT TỐT');

    // 70% drop (10.0 -> 3.0)
    const partial = step5.evaluate72hResponse(false, false, false, false, false, 10.0, 3.0);
    expect(partial.pctKineticsInterpretation).toContain('MỘT PHẦN');

    // Increase / no drop (1.0 -> 1.2)
    const failure = step5.evaluate72hResponse(false, false, false, false, false, 1.0, 1.2);
    expect(failure.pctKineticsInterpretation).toContain('THẤT BẠI');
  });

  // TEST 10: Cockcroft-Gault CrCl & Renal Adjustments
  it('10. Cockcroft-Gault CrCl calculation and renal dose adjustments', () => {
    // Male 70yo, 60kg, SCr = 1.8 mg/dL
    const crclMale = step3.calculateCrCl(70, 'MALE', 60, 1.8);
    expect(crclMale).toBeCloseTo(32.4, 1);

    const adj = step3.generateRenalAdjustments(32.4);
    expect(adj.some(a => a.drugName === 'Levofloxacin')).toBe(true);
    expect(adj.some(a => a.drugName === 'Cefepime')).toBe(true);
    expect(adj.some(a => a.drugName === 'Meropenem')).toBe(true);
  });

  // TEST 11: 8 Differential Diagnoses evaluation
  it('11. Differential diagnoses for non-infectious mimicking conditions', () => {
    // Patient with hemoptysis and weight loss -> TB and Cancer
    const diffsTb = step3.evaluateDifferentialDiagnoses({ hemoptysis: true, weightLossNightSweats: true }, { smoking: true }, {}, 60);
    expect(diffsTb.some(d => d.condition.includes('Lao'))).toBe(true);
    expect(diffsTb.some(d => d.condition.includes('Ung thư'))).toBe(true);

    // Patient with sharp chest pain and DVT -> Pulmonary Embolism
    const diffsPe = step3.evaluateDifferentialDiagnoses({ suddenSharpChestPainDyspnea: true, immobilizationOrDvtOrOralContraceptives: true });
    expect(diffsPe.some(d => d.condition.includes('Thuyên tắc'))).toBe(true);
  });

  // TEST 12: Virus subtype prediction based on risk factors (spec lines 80-93)
  it('12. Virus subtype prediction: winter=Influenza, immunosuppressed=CMV+RSV+Parainfluenza, marrow transplant=RSV, age>65=HMPV', () => {
    // Winter season -> Influenza
    const r1 = step2.evaluate('INPATIENT_WARD', { winterSeason: true }, false, {}, {}, undefined, 45);
    expect(r1.predictedVirusSubtypes).toBeDefined();
    expect(r1.predictedVirusSubtypes!.some(v => v.includes('Influenza'))).toBe(true);

    // Immunosuppressive therapy -> CMV
    const r2 = step2.evaluate('ICU', { immunosuppressiveTherapy: true }, false, { immunocompromised: true }, {}, undefined, 50);
    expect(r2.predictedVirusSubtypes!.some(v => v.includes('CMV'))).toBe(true);
    expect(r2.predictedVirusSubtypes!.some(v => v.includes('Parainfluenza'))).toBe(true);

    // Bone marrow transplant -> RSV
    const r3 = step2.evaluate('INPATIENT_WARD', { boneMarrowTransplant: true }, false, {}, {}, undefined, 40);
    expect(r3.predictedVirusSubtypes!.some(v => v.includes('RSV'))).toBe(true);

    // Age >65 -> HMPV
    const r4 = step2.evaluate('OUTPATIENT', {}, false, {}, {}, undefined, 70);
    expect(r4.predictedVirusSubtypes!.some(v => v.includes('HMPV'))).toBe(true);

    // Age <10 -> HMPV
    const r5 = step2.evaluate('OUTPATIENT', {}, false, {}, {}, undefined, 5);
    expect(r5.predictedVirusSubtypes!.some(v => v.includes('HMPV'))).toBe(true);
  });

  // TEST 13: Fungal fallback when no specific risk factors
  it('13. Fungal fallback warning when no bacterial risk factors found', () => {
    // Patient with no special risk factors -> fungal fallback should trigger
    const r = step2.evaluate('OUTPATIENT', {}, false, {}, {}, undefined, 45);
    expect(r.fungalFallback).toBe(true);
    expect(r.riskWarnings.some(w => w.includes('NẤM'))).toBe(true);

    // Patient WITH risk factors -> no fungal fallback
    const r2 = step2.evaluate('ICU', { priorPseudomonasIsolation: true }, false, {}, {}, undefined, 45);
    expect(r2.fungalFallback).toBe(false);
  });

  // TEST 14: Minocycline in Mycoplasma atypical regimen
  it('14. Minocycline included in Mycoplasma pneumoniae targeted regimen', () => {
    const r = step5.getAtypicalRegimen('Mycoplasma pneumoniae');
    expect(r.targetedAntibiotics.some(a => a.includes('Minocycline'))).toBe(true);
    expect(r.targetedAntibiotics.some(a => a.includes('200mg'))).toBe(true);

    // Legionella should NOT have Minocycline
    const rL = step5.getAtypicalRegimen('Legionella pneumophila');
    expect(rL.targetedAntibiotics.some(a => a.includes('Minocycline'))).toBe(false);
  });

  // TEST 15: Psychiatric illness -> Klebsiella risk mapping (spec line 29)
  it('15. Psychiatric illness maps to Klebsiella pneumoniae risk', () => {
    // Outpatient: Klebsiella not in default list, so psychiatric adds it explicitly
    const r = step2.evaluate('OUTPATIENT', {}, false, { psychiatricIllness: true }, {}, undefined, 50);
    expect(r.likelyPathogens.some(p => p.includes('Klebsiella') && p.includes('tâm thần'))).toBe(true);
    expect(r.esblRisk).toBe(true);

    // Inpatient: Klebsiella already in default list, esblRisk still elevated
    const r2 = step2.evaluate('INPATIENT_WARD', {}, false, { psychiatricIllness: true }, {}, undefined, 50);
    expect(r2.esblRisk).toBe(true);
    expect(r2.likelyPathogens.some(p => p.includes('Klebsiella'))).toBe(true);
  });

  // TEST 16: Gamma globulin deficiency -> S. pneumoniae + H. influenzae (spec line 46-47)
  it('16. Gamma globulin deficiency maps to S. pneumoniae + H. influenzae', () => {
    const r = step2.evaluate('INPATIENT_WARD', {}, false, { gammaGlobulinDeficiency: true }, {}, undefined, 45);
    expect(r.likelyPathogens.some(p => p.includes('Gamma globulin'))).toBe(true);
  });

  // TEST 17: Drug-induced pneumonitis with expanded triggers (spec lines 5-10)
  it('17. Drug-induced pneumonitis triggers: diuretic, corticoid, nasal oil drops', () => {
    // Diuretic use -> drug-induced pneumonitis differential
    const d1 = step3.evaluateDifferentialDiagnoses({ diureticUse: true });
    expect(d1.some(d => d.condition.includes('thuốc') || d.condition.includes('Drug'))).toBe(true);
    expect(d1[0].keyClues.some(c => c.includes('lợi tiểu'))).toBe(true);

    // Nasal oil drops -> lipoid pneumonia
    const d2 = step3.evaluateDifferentialDiagnoses({ nasalOilDropUse: true });
    expect(d2.some(d => d.condition.includes('lipoid') || d.condition.includes('Drug'))).toBe(true);
    expect(d2[0].keyClues.some(c => c.includes('tinh dầu'))).toBe(true);

    // Corticoid use -> drug-induced
    const d3 = step3.evaluateDifferentialDiagnoses({ corticoidUse: true });
    expect(d3.some(d => d.condition.includes('Drug') || d.condition.includes('thuốc'))).toBe(true);
  });
});
