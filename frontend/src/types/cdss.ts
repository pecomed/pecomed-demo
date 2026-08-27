export type Gender = 'MALE' | 'FEMALE';
export type CareSetting = 'OUTPATIENT' | 'INPATIENT_WARD' | 'ICU';
export type SeverityLevel = 'MILD' | 'MODERATE' | 'SEVERE';

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
  arterialPh?: number;
  sodiumMmolL?: number;
  glucoseMmolL?: number;
  hematocritPct?: number;
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

export interface Step1Request {
  age: number;
  gender: Gender;
  vitals?: PatientVitals;
  comorbidities?: PatientComorbidities;
  labs?: PatientLabs;
  imaging?: PatientImagingAndIntervention;
  symptoms?: ClinicalSymptoms;
}

export interface SeverityAssessmentResult {
  curb65Score: number;
  curb65Details?: string[];
  crb65Score: number;
  crb65Details?: string[];
  psiScore: number;
  psiClass: string;
  psiDetails?: string[];
  smartCopScore: number;
  smartCopRisk: string;
  smartCopDetails?: string[];
  atsSevereCap: boolean;
  atsMajorCount: number;
  atsMinorCount: number;
  atsMajorCriteriaMet?: string[];
  atsMinorCriteriaMet?: string[];
  severityLevel: string;
  recommendedCareSetting: string;
  syndromeSummary?: string[];
  routineLabOrders?: string[];
  clinicalNotes?: string[];
}

export interface Step2Request {
  careSetting: CareSetting;
  riskProfile?: ClinicalRiskProfile;
  pleuralEffusion?: boolean;
}

export interface PathogenEngineResult {
  likelyPathogens?: string[];
  pseudomonasRisk: boolean;
  mrsaRisk: boolean;
  esblRisk: boolean;
  atypicalRisk: boolean;
  anaerobeRisk: boolean;
  melioidosisRisk: boolean;
  indicatedDiagnosticTests?: string[];
  riskWarnings?: string[];
}

export interface ExclusionAssessmentResult {
  contraindicatedDrugs?: string[];
  cautionDrugs?: string[];
  renalDoseAdjustmentRequired: boolean;
  crclMlMin?: number;
  warnings?: string[];
}

export interface AntibioticRegimen {
  primaryRegimen: string;
  alternativeRegimen?: string;
  dosageDetails?: string;
  administrationRoute?: string;
  recommendedDurationDays?: string;
  clinicalNotes?: string[];
  allergySafeAlternative?: string;
}

export interface EmpiricalRegimenResult {
  careSetting: string;
  selectedRegimen: AntibioticRegimen;
  hasPseudomonasCoverage: boolean;
  hasMrsaCoverage: boolean;
  hasAtypicalCoverage: boolean;
  hasEsblCoverage: boolean;
  hasAnaerobeCoverage: boolean;
  hasMelioidosisCoverage: boolean;
  specialConsiderations?: string[];
}

export interface Step5TargetedRequest {
  pathogenId: string;
  micPenicillin?: number;
  isMrsa?: boolean;
  isEsbl?: boolean;
  isCarbapenemResistant?: boolean;
  isBacteremia?: boolean;
  isPregnant?: boolean;
  multilobar?: boolean;
  hasArthritisAbscess?: boolean;
  hasOsteomyelitis?: boolean;
  isCysticFibrosis?: boolean;
  atypicalAgent?: string;
  cannotSwallow?: boolean;
  crclGt60?: boolean;
  isSevereOrImmunocompromised?: boolean;
  isPseudomonasResistant?: boolean;
}

export interface TargetedRegimenResult {
  pathogenName: string;
  targetedAntibiotics?: string[];
  dosageAndAdministration?: string;
  duration?: string;
  monitoringAndWarnings?: string[];
}

export interface OralStepDownRequest {
  temp: number;
  hr: number;
  rr: number;
  sbp: number;
  spo2: number;
  canEatAndSwallow: boolean;
  normalMentalStatus: boolean;
}

export interface OralStepDownResult {
  eligible: boolean;
  metCriteriaCount: number;
  totalCriteriaCount: number;
  criteriaDetails?: string[];
  suggestedOralRegimens?: string[];
  clinicalGuidance?: string;
}

export interface Response72hRequest {
  hrGt125OrRrGt33?: boolean;
  bpLt9060?: boolean;
  imagingWorsening?: boolean;
  atsScoreIncreased?: boolean;
  respFailureWorsening?: boolean;
  pctD0?: number;
  pctD3?: number;
  pctD5D7?: number;
}

export interface TreatmentResponse72hResult {
  responseStatus: string;
  pctKineticsInterpretation?: string;
  isTreatmentFailure: boolean;
  recommendedActions?: string[];
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
