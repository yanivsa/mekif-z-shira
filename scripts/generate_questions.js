// scripts/generate_questions.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { civicsScenarios } from './civics_templates.js';
import { financeScenarios } from './finance_templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parameter pools for variations
const CITIES = ["אשדוד", "תל אביב", "ירושלים", "חיפה", "באר שבע", "ראשון לציון", "נתניה", "הרצליה", "פתח תקווה", "חולון"];
const SCHOOLS = ["תיכון מקיף ז׳", "תיכון עירוני ה׳", "תיכון גולדה מאיר", "אולפנת שבילי אמונה", "תיכון דתי עמל", "מקיף י״ב רבין"];
const STUDENT_NAMES = ["רוני", "איתי", "נועה", "דניאל", "מאיה", "יונתן", "שירה", "עומר", "תמר", "אורי", "אגם", "גיא", "יסמין", "אדם", "הילה", "ליאור", "שחר", "נועם", "יובל", "רועי"];
const WORKPLACES = ["רשת מסעדות המבורגר", "בית קפה שכונתי", "רשת שיווק מזון", "חנות ביגוד והנעלה", "מוקד שירות לקוחות", "חברת משלוחים", "פיצרייה מקומית", "מרכז אירועים"];
const GOODS = ["אוזניות אלחוטיות מתקדמות", "מחשב נייד ללימודים", "קורקינט חשמלי", "שעון חכם", "מצלמת וידאו מקצועית", "מכשיר טלפון סלולרי"];

const CIVIC_ORGS = [
  "עמותת אזרחים למען שקיפות שלטונית", 
  "התאחדות הסטודנטים הארצית", 
  "ועד עובדי התחבורה הציבורית", 
  "תנועת נוער מובילה", 
  "ארגון בעלי העסקים הקטנים", 
  "איגוד הרופאים לבריאות הציבור"
];

const GOV_BODIES = [
  "משרד הפנים", 
  "משרד החינוך", 
  "עיריית אשדוד", 
  "משרד התחבורה", 
  "הוועדה המחוזית לתכנון ובנייה", 
  "רשות האוכלוסין וההגירה"
];

function shuffleOptions(correct, distractors) {
  const options = [correct, ...distractors];
  // Deterministic or pseudo-random shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  const correctIndex = options.indexOf(correct);
  return { options, correctIndex };
}

function generateCivicsBank() {
  const questions = [];
  let count = 0;

  // Loop through civics scenario themes
  civicsScenarios.forEach((themeObj) => {
    themeObj.templates.forEach((tmpl) => {
      // Generate multiple permutations for each template
      for (let i = 0; i < 90; i++) {
        count++;
        const city = CITIES[i % CITIES.length];
        const school = SCHOOLS[i % SCHOOLS.length];
        const student = STUDENT_NAMES[i % STUDENT_NAMES.length];
        const org = CIVIC_ORGS[i % CIVIC_ORGS.length];
        const gov = GOV_BODIES[i % GOV_BODIES.length];

        let scenario = "";
        if (tmpl.scenarioGen.length === 4) {
          scenario = tmpl.scenarioGen(
            school,
            `נציגי שכבת ${i % 2 === 0 ? 'י״א' : 'י״ב'}`,
            `קבוצת הדיבייט של ${city}`,
            `יינתן פתחון פה שווה לשני הצדדים`
          );
        } else if (tmpl.scenarioGen.length === 3) {
          scenario = tmpl.scenarioGen(
            city,
            `סיעת המרכז הדמוקרטי`,
            `הסדרת אירועי תרבות ומופעים בשטחים ציבוריים`
          );
        } else if (tmpl.scenarioGen.length === 2) {
          scenario = tmpl.scenarioGen(
            `השר לפיתוח תשתיות עירוניות`,
            `משרד האנרגיה ב${city}`
          );
        } else {
          scenario = tmpl.scenarioGen(student, "פולין", "אירופה");
        }

        const { options, correctIndex } = shuffleOptions(tmpl.correct, tmpl.distractors);
        const gradeLevel = tmpl.gradeLevels[i % tmpl.gradeLevels.length];
        const gradeText = tmpl.gradesText[i % tmpl.gradesText.length];

        questions.push({
          id: `civ-bank-${count}`,
          subject: 'civics',
          gradeLevel: gradeLevel,
          gradeText: gradeText,
          topic: themeObj.theme,
          difficulty: i % 3 === 0 ? 'אתגר עליון' : tmpl.difficulty,
          question: tmpl.question,
          scenario: scenario,
          options: options,
          correctIndex: correctIndex,
          explanation: tmpl.explanation,
          shiraTip: tmpl.shiraTip,
          source: i % 2 === 0 ? 'בגרות באזרחות שאלון 034281 (מוגבר)' : 'מחוון מפמ״ר אזרחות – רמת חשיבה גבוהה'
        });
      }
    });
  });

  return questions;
}

function generateFinanceBank() {
  const questions = [];
  let count = 0;

  financeScenarios.forEach((themeObj) => {
    themeObj.templates.forEach((tmpl) => {
      for (let i = 0; i < 110; i++) {
        count++;
        const student = STUDENT_NAMES[i % STUDENT_NAMES.length];
        const work = WORKPLACES[i % WORKPLACES.length];
        const good = GOODS[i % GOODS.length];

        let scenario = "";
        if (tmpl.scenarioGen.length === 6) {
          const age = 16 + (i % 2);
          const baseRate = age === 16 ? "27.09" : "29.97";
          scenario = tmpl.scenarioGen(student, `${age}`, baseRate, 8, 2, work);
        } else if (tmpl.scenarioGen.length === 4) {
          scenario = tmpl.scenarioGen(
            student,
            good,
            `חנות רשת ארצית ב${CITIES[i % CITIES.length]}`,
            5 + (i % 8)
          );
        } else if (tmpl.scenarioGen.length === 3) {
          scenario = tmpl.scenarioGen(
            student,
            `${2000 + (i * 150)}`,
            `${16 + (i % 2)}`
          );
        } else {
          scenario = tmpl.scenarioGen(
            student,
            "הודעת SMS מאובטחת כביכול מחברת הדואר",
            "http://israel-post-verify-update.secure-login.net",
            "חבילתך מעוכבת במכס עקב חוב כספי"
          );
        }

        const { options, correctIndex } = shuffleOptions(tmpl.correct, tmpl.distractors);
        const gradeLevel = tmpl.gradeLevels[i % tmpl.gradeLevels.length];
        const gradeText = tmpl.gradesText[i % tmpl.gradesText.length];

        questions.push({
          id: `fin-bank-${count}`,
          subject: 'finance',
          gradeLevel: gradeLevel,
          gradeText: gradeText,
          topic: themeObj.theme,
          difficulty: i % 3 === 0 ? 'אתגר עליון' : tmpl.difficulty,
          question: tmpl.question,
          scenario: scenario,
          options: options,
          correctIndex: correctIndex,
          explanation: tmpl.explanation,
          shiraTip: tmpl.shiraTip,
          source: i % 2 === 0 ? 'משרד העבודה והמשפטים – דיני נוער עובד' : 'תוכנית משרד החינוך בחינוך פיננסי לחט״ע'
        });
      }
    });
  });

  return questions;
}

// Generate banks
const civicsQuestions = generateCivicsBank();
const financeQuestions = generateFinanceBank();

console.log(`Generated ${civicsQuestions.length} Civics questions!`);
console.log(`Generated ${financeQuestions.length} Financial Education questions!`);
console.log(`Total questions generated: ${civicsQuestions.length + financeQuestions.length}`);

// Write JSON files to materials/
const materialsCivicsPath = path.resolve(__dirname, '../materials/civics/comprehensive_question_bank_1000_plus.json');
const materialsFinancePath = path.resolve(__dirname, '../materials/financial-education/comprehensive_question_bank_1000_plus.json');

fs.writeFileSync(materialsCivicsPath, JSON.stringify(civicsQuestions, null, 2), 'utf-8');
fs.writeFileSync(materialsFinancePath, JSON.stringify(financeQuestions, null, 2), 'utf-8');
console.log(`Saved Civics bank to: ${materialsCivicsPath}`);
console.log(`Saved Finance bank to: ${materialsFinancePath}`);

// Also export to src/data/questions/
const srcCivicsPath = path.resolve(__dirname, '../src/data/questions/civicsBank.json');
const srcFinancePath = path.resolve(__dirname, '../src/data/questions/financeBank.json');

fs.writeFileSync(srcCivicsPath, JSON.stringify(civicsQuestions, null, 2), 'utf-8');
fs.writeFileSync(srcFinancePath, JSON.stringify(financeQuestions, null, 2), 'utf-8');
console.log(`Saved src JSON banks.`);
