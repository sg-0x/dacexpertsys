import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from './firebaseConfig';

/**
 * Register a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const registerWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

/**
 * Sign in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

/**
 * Sign in with Google via a popup window.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const loginWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

/**
 * Sign out the currently authenticated user.
 * @returns {Promise<void>}
 */
export const logout = () => signOut(auth);

/**
 * Get the currently signed-in user (synchronous snapshot).
 * For reactive updates, use onAuthStateChanged via AuthContext.
 * @returns {import('firebase/auth').User | null}
 */
export const getCurrentUser = () => auth.currentUser;
