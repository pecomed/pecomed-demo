import { PecomedCdssMaster } from './engine/PecomedCdssMaster.js';
import { PatientCase } from './models/types.js';

const master = new PecomedCdssMaster();

console.log('===============================================================');
console.log('  🩺 PECOMED CAP CDSS - CLI DEMONSTRATION (TypeScript)');
console.log('===============================================================');

const sampleCase: PatientCase = {
  patientId: 'CLI-DEMO-PATIENT-01',
  age: 68,
  gender: 'MALE',
  vitals: {
    respiratoryRate: 32,
    systolicBp: 85,
    diastolicBp: 55,
    heartRate: 128,
    temperature: 39.4,
    spo2: 86,
    alteredMentalStatus: true,
    onAggressiveFluidResuscitation: true
  },
  comorbidities: {
    copdChronicLung: true,
    diabetes: true,
    renalDisease: true
  },
  labs: {
    ureaMmolL: 14.5,
    wbcGL: 18.5,
    arterialPh: 7.28,
    pao2Fio2Ratio: 165,
    albuminGDl: 2.8
  },
  imaging: {
    multilobarInfiltrates: true,
    pleuralEffusion: true,
    septicShockVasopressors: true,
    mechanicalVentilation: true
  },
  riskProfile: {
    priorPseudomonasIsolation: true,
    recentHospitalization90d: true,
    priorMrsaIsolation: true
  },
  exclusionTriggers: {
    hasSevereRenalFailure: true,
    crclMlMin: 28
  }
};

console.log('\n--- 1. Evaluating Sample Patient Case ---');
const report = master.evaluateCase(sampleCase);

console.log(`\n[BƯỚC 1: PHÂN TẦNG MỨC ĐỘ NẶNG]`);
console.log(`  - CURB-65: ${report.severityAssessment.curb65Score}/5`);
console.log(`  - PSI Score: ${report.severityAssessment.psiScore} (${report.severityAssessment.psiClass})`);
console.log(`  - SMART-COP: ${report.severityAssessment.smartCopScore} điểm (${report.severityAssessment.smartCopRisk})`);
console.log(`  - ATS 2007 Viêm phổi nặng: ${report.severityAssessment.atsSevereCap ? 'DƯƠNG TÍNH' : 'ÂM TÍNH'}`);
console.log(`  👉 Khuyến nghị nơi điều trị: ${report.severityAssessment.recommendedCareSetting}`);

console.log(`\n[BƯỚC 2: NGUY CƠ VI KHUẨN ĐA KHÁNG]`);
console.log(`  - Pseudomonas aeruginosa: ${report.pathogenRiskAssessment.pseudomonasRisk ? 'CÓ NGUY CƠ' : 'Không'}`);
console.log(`  - MRSA: ${report.pathogenRiskAssessment.mrsaRisk ? 'CÓ NGUY CƠ' : 'Không'}`);

console.log(`\n[BƯỚC 3: AN TOÀN & HIỆU CHỈNH LIỀU]`);
console.log(`  - Hiệu chỉnh liều theo thận: ${report.exclusionAssessment.renalDoseAdjustmentRequired ? 'BẮT BUỘC (CrCl = 28 mL/phút)' : 'Không'}`);

console.log(`\n[BƯỚC 4: PHÁC ĐỒ KHÁNG SINH KINH NGHIỆM]`);
console.log(`  - Tiêu đề: ${report.empiricalRegimen.regimenTitle}`);
report.empiricalRegimen.primaryRegimen.forEach((ab, i) => {
  console.log(`  ${i + 1}. ${ab.name}: ${ab.dose} (${ab.route})`);
});
if (report.empiricalRegimen.addOns.length > 0) {
  console.log(`  * Bổ sung MRSA:`);
  report.empiricalRegimen.addOns.forEach((ab) => {
    console.log(`    + ${ab.name}: ${ab.dose}`);
  });
}

console.log('\n===============================================================');
console.log('  ✅ CLI Evaluation Completed Successfully!');
console.log('===============================================================');
