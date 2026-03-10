/**
 * seedFirestore.js
 * ─────────────────────────────────────────────────────────────────────────────
 * One-time seed utility for the DAC Expert System.
 *
 * Call seedFirestore() from AdminSettings → System Configuration,
 * or directly from the browser console:
 *   import('./services/seedFirestore.js').then(m => m.seedFirestore())
 *
 * Idempotent: skips seeding if data already exists (checked per collection).
 */

import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// ─── Seed Data Definitions ────────────────────────────────────────────────────

/** DAC Policy Levels */
const OFFENSES = [
  { id: 'level-1', level: 1, label: 'Minor',    fine: 1000,  penaltyPoints: 10  },
  { id: 'level-2', level: 2, label: 'Moderate', fine: 2500,  penaltyPoints: 25  },
  { id: 'level-3', level: 3, label: 'Serious',  fine: 5000,  penaltyPoints: 50  },
  { id: 'level-4', level: 4, label: 'Critical', fine: 10000, penaltyPoints: 100 },
];

/**
 * Questionnaire items used during case assessment.
 *
 * For boolean questions: `weight` is added when value === true.
 * For select/number questions (Q3): `options` each carry their own weight.
 * The `weight` field on a select question is a baseline (0 for first offense).
 */
const QUESTIONS = [
  {
    id:     'Q1',
    text:   'Was the student intoxicated?',
    hint:   'Evidence of alcohol consumption, breathalyzer results, or failed field sobriety test.',
    type:   'boolean',
    weight: 30,
    order:  1,
  },
  {
    id:     'Q2',
    text:   'Did the student cooperate with officials?',
    hint:   'Refers to compliance with campus security or faculty requests during the incident.',
    type:   'boolean',
    weight: -15,   // Mitigating — reduces severity when true (cooperated)
    order:  2,
  },
  {
    id:    'Q3',
    text:  'How many prior related offenses has the student committed?',
    hint:  'Select the number of previous disciplinary incidents of a similar nature.',
    type:  'select',
    order: 3,
    weight: 0,     // Weight applied to total via recidivism multiplier in ruleEngine
    options: [
      { label: '1st Offense',  value: 1, weight: 0  },
      { label: '2nd Offense',  value: 2, weight: 25 },
      { label: '3rd+ Offense', value: 3, weight: 50 },
    ],
  },
  {
    id:     'Q4',
    text:   'Was physical violence involved?',
    hint:   'Any physical altercation, assault, or threat of bodily harm.',
    type:   'boolean',
    weight: 40,
    order:  4,
  },
  {
    id:     'Q5',
    text:   'Was university property damaged?',
    hint:   'Vandalism, destruction, or unauthorized modification of university assets.',
    type:   'boolean',
    weight: 25,
    order:  5,
  },
  {
    id:     'Q6',
    text:   'Were academic records falsified?',
    hint:   'Includes forged documents, transcript manipulation, or impersonation in academic contexts.',
    type:   'boolean',
    weight: 35,
    order:  6,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Check whether a collection already has documents.
 * @param {string} collectionName
 * @returns {Promise<boolean>}
 */
async function collectionExists(collectionName) {
  const snap = await getDocs(collection(db, collectionName));
  return !snap.empty;
}

// ─── Main Seed Function ───────────────────────────────────────────────────────

/**
 * Seeds `offenses` and `questions` collections. Skips any collection that
 * already has documents to remain idempotent.
 *
 * @returns {Promise<{ offensesSeeded: boolean, questionsSeeded: boolean }>}
 */
export async function seedFirestore() {
  const results = { offensesSeeded: false, questionsSeeded: false };

  // ── Seed offenses ──────────────────────────────────────────────────────────
  if (await collectionExists('offenses')) {
    console.info('[seedFirestore] offenses collection already exists, skipping.');
  } else {
    const batch = writeBatch(db);
    for (const offense of OFFENSES) {
      const { id, ...data } = offense;
      batch.set(doc(db, 'offenses', id), data);
    }
    await batch.commit();
    results.offensesSeeded = true;
    console.info('[seedFirestore] offenses seeded ✓');
  }

  // ── Seed questions ─────────────────────────────────────────────────────────
  if (await collectionExists('questions')) {
    console.info('[seedFirestore] questions collection already exists, skipping.');
  } else {
    const batch = writeBatch(db);
    for (const question of QUESTIONS) {
      const { id, ...data } = question;
      batch.set(doc(db, 'questions', id), data);
    }
    await batch.commit();
    results.questionsSeeded = true;
    console.info('[seedFirestore] questions seeded ✓');
  }

  return results;
}

// ─── Force Re-seed (destructive) ─────────────────────────────────────────────

/**
 * Force-overwrites all offense and question documents regardless of
 * whether the collections already exist. Use with caution!
 *
 * @returns {Promise<void>}
 */
export async function forceSeedFirestore() {
  const offenseBatch  = writeBatch(db);
  const questionBatch = writeBatch(db);

  for (const offense of OFFENSES) {
    const { id, ...data } = offense;
    offenseBatch.set(doc(db, 'offenses', id), data);
  }

  for (const question of QUESTIONS) {
    const { id, ...data } = question;
    questionBatch.set(doc(db, 'questions', id), data);
  }

  await offenseBatch.commit();
  await questionBatch.commit();

  console.info('[seedFirestore] Force seed complete ✓ (offenses + questions overwritten)');
}
