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
  serumCreatinineMgDl?: number;
  serumCreatinineUmolL?: number;
  weightKg?: number;
  ureaMmolL?: number;
  bunMgDl?: number;
  arterialPh?: number;
  sodiumMmolL?: number;
  glucoseMmolL?: number;
  hematocritPct?: number;
  pao2Mmhg?: number;
  wbcGL?: number;
  neutrophilsPct?: number;
  plateletsGL?: number;
  pao2Fio2Ratio?: number;
  albuminGDl?: number;
  pctD0?: number;
  pctD3?: number;
  pctD5D7?: number;
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
  alcoholism?: boolean;
  smoking?: boolean;
  hivCd4Under200?: boolean;
  neutropenia?: boolean;
  recentInfluenzaOrMeasles?: boolean;
}

export interface PatientImagingAndIntervention {
  multilobarInfiltrates?: boolean;
  pleuralEffusion?: boolean;
  mechanicalVentilation?: boolean;
  septicShockVasopressors?: boolean;
  lungCavityOrNecrosis?: boolean;
  recurrentPneumonia?: boolean;
  unclearInfiltrateHighSuspicion?: boolean;
  suspectUnderlyingMassOrTb?: boolean;
}

export interface ClinicalSymptoms {
  fever?: number;
  hypothermia?: boolean;
  coughWithSputum?: boolean;
  pleuriticChestPain?: boolean;
  dyspnea?: boolean;
  cracklesRales?: boolean;
  hemoptysis?: boolean;
  weightLossNightSweats?: boolean;
  suddenSharpChestPainDyspnea?: boolean;
  immobilizationOrDvtOrOralContraceptives?: boolean;
  chronicCopiousPurulentSputum?: boolean;
  amiodaroneOrMethotrexateUse?: boolean;
  swallowingDifficultyOrSedation?: boolean;
  asthmaHistoryOrParasiteExposure?: boolean;
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
  postInfluenzaSuperinfection?: boolean;
  neutropeniaRisk?: boolean;
}

export interface ExclusionRiskTriggers {
  hasSevereRenalFailure?: boolean;
  crclMlMin?: number;
  serumCreatinineMgDl?: number;
  serumCreatinineUmolL?: number;
  weightKg?: number;
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
  curb65Score: number | null;
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
  comorbidities?: PatientComorbidities;
  imaging?: PatientImagingAndIntervention;
  severityLevel?: string;
}

export interface PathogenEngineResult {
  likelyPathogens?: string[];
  pseudomonasRisk: boolean;
  mrsaRisk: boolean;
  esblRisk: boolean;
  atypicalRisk: boolean;
  anaerobeRisk: boolean;
  melioidosisRisk: boolean;
  pjpRisk: boolean;
  indicatedDiagnosticTests?: string[];
  chestCtScanIndications?: string[];
  riskWarnings?: string[];
}

export interface DifferentialDiagnosisItem {
  condition: string;
  probability: 'Cao (High)' | 'Nghi ngờ (Moderate)' | 'Thấp (Low)';
  keyClues: string[];
  suggestedExclusionTests: string[];
  clinicalAction: string;
}

export interface RenalDoseAdjustmentItem {
  drugName: string;
  normalDose: string;
  adjustedDose: string;
  monitoringNote: string;
}

export interface ExclusionAssessmentResult {
  contraindicatedDrugs?: string[];
  cautionDrugs?: string[];
  renalDoseAdjustmentRequired: boolean;
  calculatedCrCl?: number;
  crclMlMin?: number;
  renalDoseAdjustments?: RenalDoseAdjustmentItem[];
  differentialDiagnoses?: DifferentialDiagnosisItem[];
  warnings?: string[];
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
  monitoringPlan?: string[];
}

export interface Step4Request {
  careSetting?: CareSetting;
  age?: number;
  hasComorbidities?: boolean;
  antibioticsInPast3m?: boolean;
  suspectPseudomonas?: boolean;
  suspectMrsa?: boolean;
  viralTestPositive?: boolean;
  viralTestNegative?: boolean;
  spo2?: number;
  within24hIcu?: boolean;
  hasPenicillinAllergy?: boolean;
}

export interface TargetedTherapyRequest {
  pathogenId: string;
  micPenicillin?: number;
  isMrsa?: boolean;
  isEsbl?: boolean;
  isCarbapenemResistant?: boolean;
  isBacteremia?: boolean;
  hasArthritisAbscess?: boolean;
  hasOsteomyelitis?: boolean;
  cannotSwallow?: boolean;
  crclGt60?: boolean;
  multilobar?: boolean;
  isPregnant?: boolean;
  isCysticFibrosis?: boolean;
  isBetaLactamasePositive?: boolean;
  hasBetaLactamAllergy?: boolean;
}

export type Step5TargetedRequest = TargetedTherapyRequest;

export interface TargetedRegimenResult {
  pathogenName: string;
  targetedAntibiotics?: string[];
  dosageAndAdministration?: string;
  duration?: string;
  monitoringAndWarnings?: string[];
  aerosolProphylaxis?: string[];
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
