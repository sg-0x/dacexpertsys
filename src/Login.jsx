import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginWithEmail, loginWithGoogle } from './firebase/auth';
import { db } from './firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// ── SVG Icons ────────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 20 16" fill="none">
    <rect x="0.5" y="0.5" width="19" height="15" rx="1.5" stroke="#94A3B8" strokeWidth="1.5" />
    <path d="M1 1L10 9L19 1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
    <rect x="0.75" y="7.75" width="12.5" height="9.5" rx="1.25" stroke="#94A3B8" strokeWidth="1.5" />
    <path d="M3.5 7.5V5C3.5 2.79086 5.29086 1 7.5 1V1C9.70914 1 11.5 2.79086 11.5 5V7.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="7.5" cy="13" r="1.25" fill="#94A3B8" />
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 20 14" fill="none">
    <path d="M1 7C1 7 4 1 10 1C16 1 19 7 19 7C19 7 16 13 10 13C4 13 1 7 1 7Z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="7" r="2.5" stroke="#94A3B8" strokeWidth="1.5" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 20 14" fill="none">
    <path d="M1 7C1 7 4 1 10 1C16 1 19 7 19 7C19 7 16 13 10 13C4 13 1 7 1 7Z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="7" r="2.5" stroke="#94A3B8" strokeWidth="1.5" />
    <path d="M3 3L17 11" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const toFirebaseError = (code) => {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password. Please try again.';
      case 'auth/invalid-email': return 'Invalid email address.';
      case 'auth/too-many-requests': return 'Too many attempts. Try again later.';
      case 'auth/invalid-credential': return 'Invalid email or password.';
      default: return 'Sign-in failed. Please try again.';
    }
  };

  const handleUserRouting = async (userCredential) => {
    try {
      const uid = userCredential.user?.uid || userCredential?.uid;
      if (!uid) {
        console.error("UID missing from credentials", userCredential);
        return navigate("/dashboard");
      }
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role?.toLowerCase?.();
        if (role === "student") navigate("/student");
        else if (role === "warden") navigate("/warden");
        else if (role === "dsw") navigate("/dsw");
        else if (role === "admin") navigate("/dashboard");
        else navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const userCredential = await loginWithEmail(email, password);
      await handleUserRouting(userCredential);
    } catch (err) {
      setAuthError(toFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setLoading(true);
    try {
      const userCredential = await loginWithGoogle();
      await handleUserRouting(userCredential);
    } catch (err) {
      setAuthError(toFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-[#286dbf]">

      {/* ── LEFT PANEL: Campus Image ── */}
      <div
        className="hidden lg:flex lg:w-[35%] xl:w-[45%] relative flex-col justify-between"
        style={{
          background: 'url(./bg.png) left/cover no-repeat',
          backgroundColor: '#1a2a4a',
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b3e]/80 via-[#0d1b3e]/20 to-transparent" />

        {/* Logo top-center */}
        <div className="relative z-10 flex flex-col items-center pt-[130px] w-full">
          <div className="flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="./logo.png"
              alt="DAC emblem"
              className="object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Bottom text */}
        {/* <div className="relative z-10 p-8 pb-10 w-full flex flex-col items-start">
          <h2 className="text-white text-3xl font-bold leading-tight">
            Disciplinary Action<br />Committee Portal
          </h2>
        </div> */}
      </div>

      {/* ── RIGHT PANEL: Login Form ── */}
      <div
        className="flex-1 bg-white flex flex-col justify-center items-center px-8 sm:px-14 lg:px-16 xl:px-20 overflow-y-auto lg:rounded-tl-[90px]"
      >
        <div className="w-full max-w-[420px]">

          {/* ── Heading ── */}
          <h1 className="text-[#0f172a] text-3xl font-bold mb-1 tracking-tight">
            Sign In
          </h1>
          <p className="text-[#64748b] text-sm mb-8">
            Access the DAC Expert System portal
          </p>

          {/* ── Google Sign-In ── */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#dde1ea] rounded-xl py-3 text-sm font-semibold text-[#0f172a] hover:bg-[#f8fafc] hover:border-[#c5cfe8] transition-all disabled:opacity-60 shadow-sm mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#e2e8f0]" />
            <span className="text-xs text-[#94a3b8] font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-[#e2e8f0]" />
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <MailIcon />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <LockIcon />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-11 pr-12 py-3.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {/* Error banner */}
            {authError && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <span className="material-symbols-outlined text-[17px] shrink-0">error</span>
                {authError}
              </div>
            )}

            {/* Submit */}
            <button
              id="sign-in-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#5c56e9] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#01000b] active:bg-[#0f1c3a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#4f46e5]/20 mt-1"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          {/* ── Footer note ── */}
          <p className="text-[#94a3b8] text-xs text-center leading-5 mt-6">
            By signing in, you agree to the University's{' '}
            <a href="#" className="text-[#4f46e5] hover:underline transition-colors">Privacy Policy</a>
            {' '}and{' '}
            <a href="#" className="text-[#4f46e5] hover:underline transition-colors">Terms of Service</a>.
          </p>
        </div>
      </div>
    </div>
  );
}