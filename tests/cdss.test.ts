import { describe, it, expect } from 'vitest';
import { PecomedCdssMaster } from '../src/engine/PecomedCdssMaster.js';
import { Step1SeverityEngine } from '../src/engine/Step1SeverityEngine.js';
import { Step2PathogenEngine } from '../src/engine/Step2PathogenEngine.js';
import { Step3ExclusionEngine } from '../src/engine/Step3ExclusionEngine.js';
import { Step4EmpiricalEngine } from '../src/engine/Step4EmpiricalEngine.js';
import { Step5TargetedEngine } from '../src/engine/Step5TargetedEngine.js';
import { PatientCase } from '../src/models/types.js';

describe('PECOMED CAP CDSS - TypeScript Engine Test Suite', () => {
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

  // TEST 2: Klebsiella ESBL(-) fallback & ESBL(+) Carbapenem-R
  it('2. Klebsiella ESBL(-) vs ESBL(+) Carbapenem Resistant', () => {
    const nonEsbl = step5.getKlebsiellaRegimen(false, false);
    expect(nonEsbl.pathogenName).toContain('Không sinh ESBL');
    expect(nonEsbl.dosageAndAdministration).toContain('Cefepime');

    const esblSens = step5.getKlebsiellaRegimen(true, false);
    expect(esblSens.targetedAntibiotics.some(a => a.includes('Meropenem'))).toBe(true);

    const cre = step5.getKlebsiellaRegimen(true, true);
    expect(cre.targetedAntibiotics.some(a => a.includes('Ceftazidime / Avibactam'))).toBe(true);
  });

  // TEST 3: PSI Class I Boundary
  it('3. PSI Class I age and comorbidity boundary', () => {
    const youngHealthy = step1.calculatePsi(50, 'MALE', {}, { spo2: 98 }, {}, {});
    expect(youngHealthy.psiClass).toContain('Class I');

    const olderHealthy = step1.calculatePsi(51, 'MALE', {}, { spo2: 98 }, {}, {});
    expect(olderHealthy.psiClass).toContain('Class II');
  });

  // TEST 4: ATS ICU Override (Septic shock in young patient)
  it('4. ATS ICU Override: septic shock vasopressors triggers ICU regardless of age', () => {
    const patient: PatientCase = {
      age: 22,
      gender: 'MALE',
      vitals: { respiratoryRate: 20, systolicBp: 75, diastolicBp: 45, onAggressiveFluidResuscitation: true },
      imaging: { septicShockVasopressors: true }
    };
    const report = master.evaluateCase(patient);
    expect(report.severityAssessment.atsSevereCap).toBe(true);
    expect(report.severityAssessment.recommendedCareSetting).toContain('ICU');
  });

  // TEST 5: CURB-65 vs CRB-65 Fallback when Urea is missing
  it('5. CURB-65 vs CRB-65 Fallback when Urea is null', () => {
    const curbMissing = step1.calculateCurb65(70, { respiratoryRate: 32 });
    expect(curbMissing.score).toBeNull();

    const crbCalculated = step1.calculateCrb65(70, { respiratoryRate: 32 });
    expect(crbCalculated.score).toBe(2); // Age >= 65 (+1) and RR >= 30 (+1)
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

  // TEST 7: Whitmore duration pathways
  it('7. Whitmore (Burkholderia pseudomallei) duration pathways', () => {
    const std = step5.getWhitmoreRegimen(false, false, false);
    expect(std.duration).toContain('Tối thiểu 2 tuần');

    const bacteremic = step5.getWhitmoreRegimen(true, false, false);
    expect(bacteremic.duration).toContain('Tối thiểu 3 tuần');

    const arthritis = step5.getWhitmoreRegimen(false, true, false);
    expect(arthritis.duration).toContain('Tối thiểu 4 tuần');

    const osteo = step5.getWhitmoreRegimen(false, false, true);
    expect(osteo.duration).toContain('Tối thiểu 6 tuần');
  });

  // TEST 8: Oral Step-down 7 criteria
  it('8. Oral Step-down 7 criteria evaluator', () => {
    const eligible = step5.evaluateOralStepDown(37.2, 80, 18, 120, 96, true, true);
    expect(eligible.eligible).toBe(true);
    expect(eligible.metCriteriaCount).toBe(7);

    const feverFails = step5.evaluateOralStepDown(37.9, 80, 18, 120, 96, true, true);
    expect(feverFails.eligible).toBe(false);
    expect(feverFails.metCriteriaCount).toBe(6);
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

  // TEST 10: Virus Peramivir condition
  it('10. Influenza Peramivir condition (cannot swallow & CrCl > 60)', () => {
    const peramivirIncluded = step5.getVirusRegimen(true, true);
    expect(peramivirIncluded.targetedAntibiotics.some(a => a.includes('Peramivir'))).toBe(true);

    const oralOnly = step5.getVirusRegimen(false, true);
    expect(oralOnly.targetedAntibiotics.some(a => a.includes('Peramivir'))).toBe(false);
  });
});
