import express, { Request, Response } from 'express';
import cors from 'cors';
import { PecomedCdssMaster } from '../dist/engine/PecomedCdssMaster.js';

const app = express();
app.use(cors());
app.use(express.json());

const master = new PecomedCdssMaster();

// Health
app.get('/api/cdss/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', engine: 'PECOMED CAP CDSS (Vercel Serverless)', timestamp: new Date().toISOString() });
});

// Full 5-step evaluation
app.post('/api/cdss/evaluate', (req: Request, res: Response) => {
  try {
    const report = master.evaluateFullCase(req.body);
    res.json(report);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Step 1
app.post('/api/cdss/step1/severity', (req: Request, res: Response) => {
  try {
    const { age = 50, gender = 'MALE', vitals, comorbidities, labs, imaging, symptoms } = req.body;
    const result = master.step1.evaluate(age, gender, vitals, comorbidities, labs, imaging, symptoms);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Step 2
app.post('/api/cdss/step2/pathogen', (req: Request, res: Response) => {
  try {
    const { careSetting = 'OUTPATIENT', riskProfile, pleuralEffusion = false, comorbidities, imaging, severityLevel, age } = req.body;
    const result = master.step2.evaluate(careSetting, riskProfile, pleuralEffusion, comorbidities, imaging, severityLevel, age);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Step 3
app.post('/api/cdss/step3/exclusion', (req: Request, res: Response) => {
  try {
    const { triggers, symptoms, comorbidities, imaging, age, gender = 'MALE' } = req.body;
    const result = master.step3.evaluate(triggers, symptoms, comorbidities, imaging, age, gender);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Step 4
app.post('/api/cdss/step4/empirical', (req: Request, res: Response) => {
  try {
    const result = master.step4.evaluate(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Step 5 targeted
app.post('/api/cdss/step5/targeted', (req: Request, res: Response) => {
  try {
    const b = req.body;
    let result;
    const pid = (b.pathogenId || '').toLowerCase();
    if (pid.includes('pneumoniae') && !pid.includes('klebsiella') && !pid.includes('pseudo')) {
      result = master.step5.getSpneumoniaeRegimen(b.micPenicillin ?? 1.0);
    } else if (pid.includes('staph') || pid.includes('aureus')) {
      result = master.step5.getStaphAureusRegimen(!!b.isMrsa, !!b.isBacteremia);
    } else if (pid.includes('klebsiella')) {
      result = master.step5.getKlebsiellaRegimen(!!b.isEsbl, !!b.isCarbapenemResistant);
    } else if (pid.includes('pseudo')) {
      result = master.step5.getPseudomonasRegimen(!!b.isPseudomonasResistant, !!b.isCysticFibrosis);
    } else if (pid.includes('whitmore') || pid.includes('burkholderia') || pid.includes('melioid')) {
      result = master.step5.getWhitmoreRegimen(!!b.isBacteremia, !!b.multilobar, !!b.hasArthritisAbscess, !!b.hasOsteomyelitis, !!b.isPregnant);
    } else if (pid.includes('influenza') && pid.includes('h.')) {
      result = master.step5.getHInfluenzaeMCatarrhalisRegimen(!!b.isBetaLactamasePositive, !!b.hasBetaLactamAllergy);
    } else if (pid.includes('virus') || pid.includes('cúm') || pid.includes('flu')) {
      result = master.step5.getVirusRegimen(!!b.cannotSwallow, b.crclGt60 !== false, !!b.isOutpatient);
    } else {
      result = master.step5.getAtypicalRegimen(b.atypicalAgent || b.pathogenId || 'Mycoplasma / Legionella / Chlamydia');
    }
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Step 5 oral step-down
app.post('/api/cdss/step5/oral-step-down', (req: Request, res: Response) => {
  try {
    const { temp, hr, rr, sbp, spo2, canEatAndSwallow, normalMentalStatus } = req.body;
    const result = master.step5.evaluateOralStepDown(temp, hr, rr, sbp, spo2, !!canEatAndSwallow, !!normalMentalStatus);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Step 5 72h response
app.post('/api/cdss/step5/72h-response', (req: Request, res: Response) => {
  try {
    const { hrGt125OrRrGt33, bpLt9060, imagingWorsening, atsScoreIncreased, respFailureWorsening, pctD0, pctD3, pctD5D7 } = req.body;
    const result = master.step5.evaluate72hResponse(!!hrGt125OrRrGt33, !!bpLt9060, !!imagingWorsening, !!atsScoreIncreased, !!respFailureWorsening, pctD0, pctD3, pctD5D7);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default app;
