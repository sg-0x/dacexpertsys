/**
 * caseService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Case management functions for the DAC Expert System.
 *
 * Exports:
 *   createCase(formData, answers)   → Promise<{ id, token, offenseLevel, severityScore, fine, penaltyPoints }>
 *   getCases(filters?, sortBy?)     → Promise<Case[]>
 *   getCaseByToken(token)           → Promise<Case|null>
 *   updateCaseStatus(caseId, status)→ Promise<void>
 */

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { addDocument, getDocuments, updateDocument } from '../firebase/firestore';
import {
  generateToken,
  calculateSeverity,
  determineOffenseLevel,
  applyPenalty,
} from './ruleEngine';

// ─── Default case status ──────────────────────────────────────────────────────
export const CASE_STATUS = {
  PENDING:      'Pending',
  UNDER_REVIEW: 'Under Review',
  RESOLVED:     'Resolved',
  DISMISSED:    'Dismissed',
};

// ─── Create Case ──────────────────────────────────────────────────────────────

/**
 * Creates a new disciplinary case.
 *
 * Orchestrates:
 *   1. Generate a unique token
 *   2. Calculate severity score from answers
 *   3. Determine offense level (1–4)
 *   4. Look up fine & penaltyPoints
 *   5. Write everything to Firestore `cases` collection
 *
 * @param {object} formData
 *   @param {string} formData.studentName
 *   @param {string} formData.rollNumber
 *   @param {string} formData.department
 *   @param {string} formData.hostelBlock
 *   @param {string} formData.offenseType
 *   @param {string} formData.description
 *   @param {string} [formData.notes]
 *
 * @param {Array<{ questionId: string, weight: number, value: boolean|number, offenseCount?: number }>} answers
 *   Weighted question answers from the questionnaire engine.
 *
 * @returns {Promise<{ id: string, token: string, offenseLevel: number, severityScore: number, fine: number, penaltyPoints: number }>}
 */
export async function createCase(formData, answers = []) {
  // Step 1 – Token
  const token = await generateToken();

  // Step 2 – Severity score
  const severityScore = calculateSeverity(answers);

  // Step 3 – Offense level
  const offenseLevel = determineOffenseLevel(severityScore);

  // Step 4 – Penalty
  const { fine, penaltyPoints } = await applyPenalty(offenseLevel);

  // Step 5 – Write to Firestore
  const caseData = {
    token,
    studentName:  formData.studentName  ?? '',
    rollNumber:   formData.rollNumber   ?? '',
    department:   formData.department   ?? '',
    hostelBlock:  formData.hostelBlock  ?? '',
    offenseType:  formData.offenseType  ?? '',
    description:  formData.description  ?? '',
    notes:        formData.notes        ?? '',
    offenseLevel,
    severityScore,
    fine,
    penaltyPoints,
    status:       CASE_STATUS.PENDING,
    answers,
  };

  const id = await addDocument('cases', caseData);

  return { id, token, offenseLevel, severityScore, fine, penaltyPoints };
}

// ─── Get Cases ────────────────────────────────────────────────────────────────

/**
 * Fetch all cases (with optional filters and sort).
 *
 * @param {Array<{ field: string, op: import('firebase/firestore').WhereFilterOp, value: any }>} [filters]
 * @param {{ field: string, direction?: 'asc'|'desc' }} [sortBy]  default: createdAt desc
 * @returns {Promise<object[]>}
 *
 * @example
 * // All pending cases, newest first
 * getCases([{ field: 'status', op: '==', value: 'Pending' }], { field: 'createdAt', direction: 'desc' })
 */
export async function getCases(filters = [], sortBy = { field: 'createdAt', direction: 'desc' }) {
  return getDocuments('cases', filters, sortBy);
}

// ─── Get Case By Token ────────────────────────────────────────────────────────

/**
 * Look up a single case by its token string.
 *
 * @param {string} token  e.g. "DAC-2026-1001"
 * @returns {Promise<object|null>}  Case document or null if not found
 */
export async function getCaseByToken(token) {
  const q    = query(collection(db, 'cases'), where('token', '==', token));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

// ─── Update Case Status ───────────────────────────────────────────────────────

/**
 * Update the status of an existing case.
 *
 * @param {string} caseId  Firestore document ID
 * @param {string} status  One of CASE_STATUS values
 * @returns {Promise<void>}
 */
export async function updateCaseStatus(caseId, status) {
  return updateDocument('cases', caseId, { status });
}
