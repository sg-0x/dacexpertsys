/**
 * questionService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Questionnaire engine for the DAC Expert System.
 *
 * Exports:
 *   getQuestions()               → Promise<Question[]>
 *   submitAnswers(caseId, answers) → Promise<string>  (answersDoc ID)
 *   calculateSeverity            (re-export from ruleEngine)
 *
 * Question shape (Firestore `questions` collection):
 *   {
 *     id:       string   ("Q1" … "Q6")
 *     text:     string
 *     hint:     string
 *     weight:   number   (added to score when applicable)
 *     type:     'boolean' | 'select' | 'number'
 *     options?: { label: string, value: number|boolean, weight: number }[]
 *     order:    number   (sort order for rendering)
 *   }
 */

import { getDocuments, addDocument } from '../firebase/firestore';
export { calculateSeverity } from './ruleEngine';

// ─── Get Questions ────────────────────────────────────────────────────────────

/**
 * Fetches all questionnaire items from Firestore, sorted by their `order` field.
 *
 * @returns {Promise<object[]>}
 */
export async function getQuestions() {
  return getDocuments('questions', [], { field: 'order', direction: 'asc' });
}

// ─── Submit Answers ───────────────────────────────────────────────────────────

/**
 * Persists the answered questionnaire for a given case as a sub-collection document.
 *
 * Path: cases/{caseId}/answers/{answersDocId}
 *
 * @param {string} caseId   Firestore document ID of the parent case
 * @param {Array<{ questionId: string, weight: number, value: boolean|number }>} answers
 * @returns {Promise<string>}  ID of the newly created answers document
 */
export async function submitAnswers(caseId, answers) {
  return addDocument(`cases/${caseId}/answers`, {
    answers,
    submittedAt: new Date().toISOString(),
  });
}
