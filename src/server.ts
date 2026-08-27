import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PecomedCdssMaster } from './engine/PecomedCdssMaster.js';
import { PatientCase } from './models/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const master = new PecomedCdssMaster();

// -------------------------------------------------------------
// 1. Health Check Endpoint
// -------------------------------------------------------------
app.get('/api/cdss/health', (_req: Request, res: Response) => {
  res.json({
    service: 'PECOMED CAP CDSS',
    version: '1.0.0',
    status: 'UP',
    runtime: 'Node.js / TypeScript'
  });
});

// -------------------------------------------------------------
// 2. Full 5-Step Pipeline Evaluation
// -------------------------------------------------------------
app.post('/api/cdss/evaluate', (req: Request, res: Response) => {
  try {
    const patientCase: PatientCase = req.body;
    const report = master.evaluateCase(patientCase);
    res.json(report);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. Step 1: Severity Assessment
// -------------------------------------------------------------
app.post('/api/cdss/step1/severity', (req: Request, res: Response) => {
  try {
    const { age = 50, gender = 'MALE', vitals, comorbidities, labs, imaging, symptoms } = req.body;
    const result = master.step1.evaluate(age, gender, vitals, comorbidities, labs, imaging, symptoms);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. Step 2: Pathogen Risk & Indicated Diagnostics
// -------------------------------------------------------------
app.post('/api/cdss/step2/pathogen', (req: Request, res: Response) => {
  try {
    const { careSetting = 'OUTPATIENT', riskProfile, pleuralEffusion = false, comorbidities, imaging, severityLevel } = req.body;
    const result = master.step2.evaluate(careSetting, riskProfile, pleuralEffusion, comorbidities, imaging, severityLevel);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. Step 3: Exclusion, Safety & Differential Diagnosis
// -------------------------------------------------------------
app.post('/api/cdss/step3/exclusion', (req: Request, res: Response) => {
  try {
    const { exclusionTriggers, symptoms, comorbidities, imaging, age, gender } = req.body;
    // Support either flat payload or nested triggers
    const triggers = exclusionTriggers || req.body;
    const result = master.step3.evaluate(triggers, symptoms, comorbidities, imaging, age, gender);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. Step 4: Empirical Antibiotic Regimen
// -------------------------------------------------------------
app.post('/api/cdss/step4/empirical', (req: Request, res: Response) => {
  try {
    const result = master.step4.evaluate(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. Step 5: Targeted Regimen
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 8. Step 5: Oral Step-Down Eligibility
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 9. Step 5: 72h Treatment Response & PCT Kinetics
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// Static Frontend Serving (SPA fallback)
// -------------------------------------------------------------
const staticDirs = [
  path.resolve(__dirname, '../src/main/resources/static'),
  path.resolve(__dirname, '../../src/main/resources/static'),
  path.resolve(__dirname, '../frontend/dist'),
  path.resolve(__dirname, '../../frontend/dist')
];

let foundStaticDir: string | null = null;
for (const dir of staticDirs) {
  if (fs.existsSync(dir) && fs.existsSync(path.join(dir, 'index.html'))) {
    foundStaticDir = dir;
    break;
  }
}

if (foundStaticDir) {
  console.log(`[PECOMED] Serving static frontend from: ${foundStaticDir}`);
  app.use(express.static(foundStaticDir));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(foundStaticDir!, 'index.html'));
  });
} else {
  console.warn('[PECOMED] No static frontend bundle found. API-only mode active.');
  app.get('/', (_req: Request, res: Response) => {
    res.send('<h1>🩺 PECOMED CAP CDSS REST API Server is running</h1><p>Visit <a href="/api/cdss/health">/api/cdss/health</a></p>');
  });
}

// -------------------------------------------------------------
// Server Start
// -------------------------------------------------------------
app.listen(PORT, () => {
  console.log('========================================================');
  console.log(' 🩺 PECOMED CAP CDSS (100% TypeScript Server)');
  console.log(` 🚀 Listening at: http://localhost:${PORT}`);
  console.log(` 🌐 Health Check: http://localhost:${PORT}/api/cdss/health`);
  console.log('========================================================');
});
