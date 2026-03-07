import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ─── Add ──────────────────────────────────────────────────────────────────────

/**
 * Add a new document to a Firestore collection.
 * Automatically includes `createdAt` and `updatedAt` server timestamps.
 *
 * @param {string} collectionPath - e.g. "cases"
 * @param {object} data           - Fields to store
 * @returns {Promise<string>}     - The new document ID
 */
export const addDocument = async (collectionPath, data) => {
  const ref = await addDoc(collection(db, collectionPath), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

// ─── Fetch ────────────────────────────────────────────────────────────────────

/**
 * Fetch a single document by ID.
 *
 * @param {string} collectionPath
 * @param {string} docId
 * @returns {Promise<object|null>} - Document data or null if not found
 */
export const getDocument = async (collectionPath, docId) => {
  const snap = await getDoc(doc(db, collectionPath, docId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Fetch all documents in a collection (optional filter + sort).
 *
 * @param {string} collectionPath
 * @param {{ field: string, op: import('firebase/firestore').WhereFilterOp, value: any }[]} [filters]
 * @param {{ field: string, direction?: 'asc'|'desc' }} [sortBy]
 * @returns {Promise<object[]>}
 */
export const getDocuments = async (collectionPath, filters = [], sortBy = null) => {
  let q = collection(db, collectionPath);

  const constraints = [
    ...filters.map(({ field, op, value }) => where(field, op, value)),
    ...(sortBy ? [orderBy(sortBy.field, sortBy.direction ?? 'asc')] : []),
  ];

  q = constraints.length ? query(q, ...constraints) : q;

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Update specific fields of an existing document.
 * Automatically refreshes `updatedAt` timestamp.
 *
 * @param {string} collectionPath
 * @param {string} docId
 * @param {object} data - Partial fields to update (merged, not replaced)
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionPath, docId, data) =>
  updateDoc(doc(db, collectionPath, docId), {
    ...data,
    updatedAt: serverTimestamp(),
  });

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Delete a document by ID.
 *
 * @param {string} collectionPath
 * @param {string} docId
 * @returns {Promise<void>}
 */
export const deleteDocument = (collectionPath, docId) =>
  deleteDoc(doc(db, collectionPath, docId));
