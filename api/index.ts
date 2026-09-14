import express, { Request, Response } from 'express';
import cors from 'cors';
import { PecomedCdssMaster } from '../src/engine/PecomedCdssMaster.js';
import { PatientCase } from '../src/models/types.js';

const app = express();
app.use(cors());
app.use(express.json());

const master = new PecomedCdssMaster();

// 1. Health Check
app.get('/api/cdss/health', (_req: Request, res: Response) => {
  res.json({
    service: 'PECOMED CAP CDSS',
    version: '1.0.0',
    status: 'UP',
    runtime: 'Node.js / TypeScript (Vercel Serverless)'
  });
});

// 2. Full 5-Step Pipeline Evaluation
app.post('/api/cdss/evaluate', (req: Request, res: Response) => {
  try {
    const patientCase: PatientCase = req.body;
    const report = master.evaluateCase(patientCase);
    res.json(report);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Step 1: Severity Assessment
app.post('/api/cdss/step1/severity', (req: Request, res: Response) => {
  try {
    const { age = 50, gender = 'MALE', vitals, comorbidities, labs, imaging, symptoms } = req.body;
    const result = master.step1.evaluate(age, gender, vitals, comorbidities, labs, imaging, symptoms);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Step 2: Pathogen Risk & Indicated Diagnostics
app.post('/api/cdss/step2/pathogen', (req: Request, res: Response) => {
  try {
    const { careSetting = 'OUTPATIENT', riskProfile, pleuralEffusion = false, comorbidities, imaging, severityLevel, age } = req.body;
    const result = master.step2.evaluate(careSetting, riskProfile, pleuralEffusion, comorbidities, imaging, severityLevel, age);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Step 3: Exclusion, Safety & Differential Diagnosis
app.post('/api/cdss/step3/exclusion', (req: Request, res: Response) => {
  try {
    const { exclusionTriggers, symptoms, comorbidities, imaging, age, gender } = req.body;
    const triggers = exclusionTriggers || req.body;
    const result = master.step3.evaluate(triggers, symptoms, comorbidities, imaging, age, gender);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Step 4: Empirical Antibiotic Regimen
app.post('/api/cdss/step4/empirical', (req: Request, res: Response) => {
  try {
    const result = master.step4.evaluate(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 7. Step 5: Targeted Regimen
app.post('/api/cdss/step5/targeted', (req: Request, res: Response) => {
  try {
    const {
      pathogenId,
      micPenicillin,
      isMrsa = false,
      isEsbl = false,
      isCarbapenemResistant = false,
      isBacteremia = false,
      hasArthritisAbscess = false,
      hasOsteomyelitis = false,
      cannotSwallow = false,
      crclGt60 = true,
      multilobar = false,
      isPregnant = false,
      isCysticFibrosis = false,
      isBetaLactamasePositive = false,
      hasBetaLactamAllergy = false
    } = req.body;

    const result = master.resolveStep5Targeted(
      pathogenId,
      micPenicillin,
      isMrsa,
      isEsbl,
      isCarbapenemResistant,
      isBacteremia,
      hasArthritisAbscess,
      hasOsteomyelitis,
      cannotSwallow,
      crclGt60,
      multilobar,
      isPregnant,
      isCysticFibrosis,
      isBetaLactamasePositive,
      hasBetaLactamAllergy
    );
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 8. Step 5: Oral Step-Down Eligibility
app.post('/api/cdss/step5/oral-step-down', (req: Request, res: Response) => {
  try {
    const {
      temp = 37.0,
      hr = 80,
      rr = 18,
      sbp = 120,
      spo2 = 98.0,
      canEatAndSwallow = true,
      normalMentalStatus = true
    } = req.body;

    const result = master.step5.evaluateOralStepDown(temp, hr, rr, sbp, spo2, canEatAndSwallow, normalMentalStatus);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Step 5: 72h Treatment Response & PCT Kinetics
app.post('/api/cdss/step5/72h-response', (req: Request, res: Response) => {
  try {
    const {
      hrGt125OrRrGt33 = false,
      bpLt9060 = false,
      imagingWorsening = false,
      atsScoreIncreased = false,
      respFailureWorsening = false,
      pctD0,
      pctD3,
      pctD5D7
    } = req.body;

    const result = master.step5.evaluate72hResponse(
      hrGt125OrRrGt33,
      bpLt9060,
      imagingWorsening,
      atsScoreIncreased,
      respFailureWorsening,
      pctD0,
      pctD3,
      pctD5D7
    );
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default app;
