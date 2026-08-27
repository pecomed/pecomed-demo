export type Gender = 'MALE' | 'FEMALE' | 'Nam' | 'Nữ';
export type CareSetting = 'OUTPATIENT' | 'INPATIENT_WARD' | 'ICU' | 'Ngoại trú (Nhẹ)' | 'Nội trú (Trung bình)' | 'ICU (Rất nặng / Nguy kịch)';
export type SeverityLevel = 'MILD' | 'MODERATE' | 'SEVERE' | 'Nhẹ (Mild)' | 'Trung bình (Moderate)' | 'Nặng (Severe) / Nguy kịch';
export type AdminRoute = 'ORAL' | 'IV' | 'IM' | 'INHALATION';

export interface PatientVitals {
  respiratoryRate?: number;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  temperature?: number;
  spo2?: number;
  alteredMentalStatus?: boolean;
  onAggressiveFluidResuscitation?: boolean;
}

export interface PatientLabs {
  ureaMmolL?: number;
  bunMgDl?: number;
  arterialPh?: number;
  sodiumMmolL?: number;
  glucoseMmolL?: number;
  hematocritPct?: number;
  pao2Mmhg?: number;
  wbcGL?: number;
  plateletsGL?: number;
  pao2Fio2Ratio?: number;
  albuminGDl?: number;
}

export interface PatientComorbidities {
  neoplasm?: boolean;
  liverDisease?: boolean;
  congestiveHeartFailure?: boolean;
  cerebrovascularDisease?: boolean;
  renalDisease?: boolean;
  copdChronicLung?: boolean;
  diabetes?: boolean;
  immunocompromised?: boolean;
  nursingHomeResident?: boolean;
}

export interface PatientImagingAndIntervention {
  multilobarInfiltrates?: boolean;
  pleuralEffusion?: boolean;
  mechanicalVentilation?: boolean;
  septicShockVasopressors?: boolean;
}

export interface ClinicalSymptoms {
  fever?: number;
  hypothermia?: boolean;
  coughWithSputum?: boolean;
  pleuriticChestPain?: boolean;
  dyspnea?: boolean;
  cracklesRales?: boolean;
}

export interface ClinicalRiskProfile {
  priorPseudomonasIsolation?: boolean;
  recentHospitalization90d?: boolean;
  recentIvAntibiotics90d?: boolean;
  structuralLungDiseaseBronchiectasis?: boolean;
  frequentCopdExacerbationsSteroids?: boolean;
  priorMrsaIsolation?: boolean;
  recentMrsaContact?: boolean;
  skinInfectionsWounds?: boolean;
  esblRiskColonization?: boolean;
  immunosuppressiveTherapy?: boolean;
  poorDentalHygieneAspiration?: boolean;
  lossOfConsciousnessAlcoholism?: boolean;
  severeDysphagia?: boolean;
  diabetesMellitusChronicLiverRenal?: boolean;
  exposureSoilWaterFlooding?: boolean;
  recentTravelEndemicMelioidosis?: boolean;
  atypicalEpidemicContext?: boolean;
  birdBatExposurePsittacosis?: boolean;
}

export interface ExclusionRiskTriggers {
  hasSevereRenalFailure?: boolean;
  crclMlMin?: number;
  hasLongQtSyndrome?: boolean;
  hasMyastheniaGravis?: boolean;
  hasTendinitisOrFluoroquinoloneAllergy?: boolean;
  hasSevereHepaticImpairment?: boolean;
  isPregnantOrNursing?: boolean;
  hasKnownPenicillinAnaphylaxis?: boolean;
  hasKnownCephalosporinAnaphylaxis?: boolean;
  hasKnownCarbapenemAnaphylaxis?: boolean;
  hasKnownMacrolideAllergy?: boolean;
  hasKnownDoxycyclineAllergy?: boolean;
  hasKnownAminoglycosideAllergy?: boolean;
  hasKnownVancomycinAllergy?: boolean;
  hasKnownCotrimoxazoleAllergy?: boolean;
  hasG6pdDeficiency?: boolean;
}

export interface SeverityAssessmentResult {
  curb65Score: number | null;
  curb65Details: string[];
  crb65Score: number;
  crb65Details: string[];
  psiScore: number;
  psiClass: string;
  psiDetails: string[];
  smartCopScore: number;
  smartCopRisk: string;
  smartCopDetails: string[];
  atsSevereCap: boolean;
  atsMajorCount: number;
  atsMinorCount: number;
  atsMajorCriteriaMet: string[];
  atsMinorCriteriaMet: string[];
  severityLevel: string;
  recommendedCareSetting: string;
  syndromeSummary: string[];
  routineLabOrders: string[];
  clinicalNotes: string[];
}

export interface PathogenEngineResult {
  likelyPathogens: string[];
  pseudomonasRisk: boolean;
  mrsaRisk: boolean;
  esblRisk: boolean;
  atypicalRisk: boolean;
  anaerobeRisk: boolean;
  melioidosisRisk: boolean;
  indicatedDiagnosticTests: string[];
  riskWarnings: string[];
}

export interface ExclusionAssessmentResult {
  contraindicatedDrugs: string[];
  cautionDrugs: string[];
  renalDoseAdjustmentRequired: boolean;
  crclMlMin?: number;
  warnings: string[];
}

export interface AntibioticInfo {
  name: string;
  dose: string;
  route: string;
  role: string;
  drugClass?: string;
  note?: string;
}

export interface EmpiricalRegimenResult {
  careSetting: string;
  regimenTitle: string;
  targetPatientGroup: string;
  primaryRegimen: AntibioticInfo[];
  alternativeRegimen: AntibioticInfo[];
  addOns: AntibioticInfo[];
  stepDownRegimen: AntibioticInfo[];
  corticosteroidRecommendation?: string;
  respiratorySupport?: string;
  monitoringPlan: string[];
}

export interface TargetedRegimenResult {
  pathogenName: string;
  targetedAntibiotics: string[];
  dosageAndAdministration: string;
  duration: string;
  monitoringAndWarnings: string[];
}

export interface OralStepDownResult {
  eligible: boolean;
  metCriteriaCount: number;
  totalCriteriaCount: number;
  criteriaDetails: string[];
  suggestedOralRegimens: string[];
  clinicalGuidance: string;
}

export interface TreatmentResponse72hResult {
  responseStatus: string;
  pctKineticsInterpretation: string;
  isTreatmentFailure: boolean;
  recommendedActions: string[];
}

export interface PatientCase {
  patientId?: string;
  age: number;
  gender: Gender;
  vitals?: PatientVitals;
  labs?: PatientLabs;
  comorbidities?: PatientComorbidities;
  imaging?: PatientImagingAndIntervention;
  symptoms?: ClinicalSymptoms;
  riskProfile?: ClinicalRiskProfile;
  exclusionTriggers?: ExclusionRiskTriggers;
}

export interface FullCdssReport {
  timestamp: string;
  patientId?: string;
  severityAssessment: SeverityAssessmentResult;
  pathogenRiskAssessment: PathogenEngineResult;
  exclusionAssessment: ExclusionAssessmentResult;
  empiricalRegimen: EmpiricalRegimenResult;
  targetedRegimen?: TargetedRegimenResult;
  oralStepDownEligibility?: OralStepDownResult;
  treatmentResponse72h?: TreatmentResponse72hResult;
}
