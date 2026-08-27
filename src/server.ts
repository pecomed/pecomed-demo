import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PecomedCdssMaster } from './engine/PecomedCdssMaster.js';
import { PatientCase, CareSetting } from './models/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const master = new PecomedCdssMaster();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------------
// CDSS REST API Endpoints
// -------------------------------------------------------------

// 1. Health Check
app.get('/api/cdss/health', (_req: Request, res: Response) => {
  res.json({
    service: 'PECOMED CAP CDSS',
    version: '1.0.0',
    status: 'UP',
    runtime: 'Node.js / TypeScript'
  });
});

// 2. Full 5-Step Pipeline Evaluation
app.post('/api/cdss/evaluate', (req: Request, res: Response) => {
  try {
    const patient: PatientCase = req.body;
    const report = master.evaluateCase(patient);
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

// 4. Step 2: Pathogen Risk Assessment
app.post('/api/cdss/step2/pathogen', (req: Request, res: Response) => {
  try {
    const { careSetting = 'OUTPATIENT', riskProfile, pleuralEffusion = false } = req.body;
    const result = master.step2.evaluate(careSetting, riskProfile, pleuralEffusion);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Step 3: Exclusion Assessment
app.post('/api/cdss/step3/exclusion', (req: Request, res: Response) => {
  try {
    const result = master.step3.evaluate(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Step 4: Empirical Regimen
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
      crclGt60 = true
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
      crclGt60
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

// 9. Step 5: 72h Treatment Response
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
// Static Frontend File Serving
// -------------------------------------------------------------
const possibleStaticDirs = [
  path.join(__dirname, '../src/main/resources/static'),
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, './static'),
  path.join(process.cwd(), 'src/main/resources/static'),
  path.join(process.cwd(), 'static')
];

let staticDir = possibleStaticDirs.find(d => fs.existsSync(d) && fs.existsSync(path.join(d, 'index.html')));

if (staticDir) {
  console.log(`[PECOMED] Serving static frontend from: ${staticDir}`);
  app.use(express.static(staticDir));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(staticDir!, 'index.html'));
  });
}

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(` 🩺 PECOMED CAP CDSS (100% TypeScript Server)`);
    console.log(` 🚀 Listening at: http://localhost:${PORT}`);
    console.log(` 🌐 Health Check: http://localhost:${PORT}/api/cdss/health`);
    console.log(`========================================================`);
  });
}

export default app;
