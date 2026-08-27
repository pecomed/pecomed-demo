import { Step1SeverityEngine } from './Step1SeverityEngine.js';
import { Step2PathogenEngine } from './Step2PathogenEngine.js';
import { Step3ExclusionEngine } from './Step3ExclusionEngine.js';
import { Step4EmpiricalEngine, Step4InputData } from './Step4EmpiricalEngine.js';
import { Step5TargetedEngine } from './Step5TargetedEngine.js';

import {
  PatientCase,
  FullCdssReport,
  CareSetting,
  TargetedRegimenResult
} from '../models/types.js';

export class PecomedCdssMaster {
  public readonly step1: Step1SeverityEngine;
  public readonly step2: Step2PathogenEngine;
  public readonly step3: Step3ExclusionEngine;
  public readonly step4: Step4EmpiricalEngine;
  public readonly step5: Step5TargetedEngine;

  constructor() {
    this.step1 = new Step1SeverityEngine();
    this.step2 = new Step2PathogenEngine();
    this.step3 = new Step3ExclusionEngine();
    this.step4 = new Step4EmpiricalEngine();
    this.step5 = new Step5TargetedEngine();
  }

  public evaluateCase(patient: PatientCase): FullCdssReport {
    // 1. Step 1: Severity Assessment
    const step1Result = this.step1.evaluate(
      patient.age,
      patient.gender,
      patient.vitals,
      patient.comorbidities,
      patient.labs,
      patient.imaging,
      patient.symptoms
    );

    // Derive CareSetting
    let careSetting: CareSetting = 'OUTPATIENT';
    if (step1Result.recommendedCareSetting.includes('ICU')) {
      careSetting = 'ICU';
    } else if (step1Result.recommendedCareSetting.includes('Nội trú')) {
      careSetting = 'INPATIENT_WARD';
    }

    // 2. Step 2: Pathogen & Risk Profile
    const step2Result = this.step2.evaluate(
      careSetting,
      patient.riskProfile,
      !!patient.imaging?.pleuralEffusion,
      patient.comorbidities,
      patient.imaging,
      step1Result.severityLevel
    );

    // 3. Step 3: Exclusion, Differential Diagnoses & Renal Safety
    const step3Result = this.step3.evaluate(
      patient.exclusionTriggers,
      patient.symptoms,
      patient.comorbidities,
      patient.imaging,
      patient.age,
      patient.gender
    );

    // 4. Step 4: Empirical Antibiotic Regimen
    const step4Input: Step4InputData = {
      careSetting,
      age: patient.age,
      hasComorbidities: !!(
        patient.comorbidities?.copdChronicLung ||
        patient.comorbidities?.diabetes ||
        patient.comorbidities?.congestiveHeartFailure ||
        patient.comorbidities?.renalDisease ||
        patient.comorbidities?.liverDisease ||
        patient.comorbidities?.neoplasm ||
        patient.comorbidities?.immunocompromised ||
        patient.comorbidities?.alcoholism
      ),
      antibioticsInPast3m: !!patient.riskProfile?.recentIvAntibiotics90d,
      suspectPseudomonas: step2Result.pseudomonasRisk,
      suspectMrsa: step2Result.mrsaRisk,
      spo2: patient.vitals?.spo2 ?? 98.0,
      within24hIcu: true,
      viralTestPositive: false,
      hasPenicillinAllergy: !!patient.exclusionTriggers?.hasKnownPenicillinAnaphylaxis
    };

    const step4Result = this.step4.evaluate(step4Input);

    // 5. Assemble Full Report
    return {
      timestamp: new Date().toISOString(),
      patientId: patient.patientId,
      severityAssessment: step1Result,
      pathogenRiskAssessment: step2Result,
      exclusionAssessment: step3Result,
      empiricalRegimen: step4Result
    };
  }

  public resolveStep5Targeted(
    pathogenId: string,
    micPenicillin?: number,
    isMrsa: boolean = false,
    isEsbl: boolean = false,
    isCarbapenemResistant: boolean = false,
    isBacteremia: boolean = false,
    hasArthritisAbscess: boolean = false,
    hasOsteomyelitis: boolean = false,
    cannotSwallow: boolean = false,
    crclGt60: boolean = true,
    multilobar: boolean = false,
    isPregnant: boolean = false,
    isCysticFibrosis: boolean = false,
    isBetaLactamasePositive: boolean = false,
    hasBetaLactamAllergy: boolean = false
  ): TargetedRegimenResult {
    const pId = (pathogenId || '').toLowerCase();

    if (pId.includes('influenzae') || pId.includes('catarrhalis') || pId.includes('haemophilus') || pId.includes('moraxella')) {
      return this.step5.getHInfluenzaeMCatarrhalisRegimen(isBetaLactamasePositive, hasBetaLactamAllergy);
    } else if (pId.includes('pneumoniae') && !pId.includes('klebsiella')) {
      return this.step5.getSpneumoniaeRegimen(micPenicillin ?? 1.0);
    } else if (pId.includes('aureus')) {
      return this.step5.getStaphAureusRegimen(isMrsa, isBacteremia);
    } else if (pId.includes('klebsiella')) {
      return this.step5.getKlebsiellaRegimen(isEsbl, isCarbapenemResistant);
    } else if (pId.includes('pseudomonas')) {
      return this.step5.getPseudomonasRegimen(isCarbapenemResistant, isCysticFibrosis);
    } else if (pId.includes('pseudomallei') || pId.includes('whitmore')) {
      return this.step5.getWhitmoreRegimen(isBacteremia, multilobar, hasArthritisAbscess, hasOsteomyelitis, isPregnant);
    } else if (pId.includes('virus') || pId.includes('influenza') || pId.includes('cúm')) {
      return this.step5.getVirusRegimen(cannotSwallow, crclGt60);
    } else {
      return this.step5.getAtypicalRegimen(pathogenId);
    }
  }
}
