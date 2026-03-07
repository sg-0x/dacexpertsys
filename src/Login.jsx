import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from './firebase/auth';

// SVG Icons as inline components
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 20 16" fill="none">
    <rect x="0.5" y="0.5" width="19" height="15" rx="1.5" stroke="#94A3B8" strokeWidth="1.5"/>
    <path d="M1 1L10 9L19 1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
    <rect x="0.75" y="7.75" width="12.5" height="9.5" rx="1.25" stroke="#94A3B8" strokeWidth="1.5"/>
    <path d="M3.5 7.5V5C3.5 2.79086 5.29086 1 7.5 1V1C9.70914 1 11.5 2.79086 11.5 5V7.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7.5" cy="13" r="1.25" fill="#94A3B8"/>
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 20 14" fill="none">
    <path d="M1 7C1 7 4 1 10 1C16 1 19 7 19 7C19 7 16 13 10 13C4 13 1 7 1 7Z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="7" r="2.5" stroke="#94A3B8" strokeWidth="1.5"/>
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 20 14" fill="none">
    <path d="M1 7C1 7 4 1 10 1C16 1 19 7 19 7C19 7 16 13 10 13C4 13 1 7 1 7Z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="7" r="2.5" stroke="#94A3B8" strokeWidth="1.5"/>
    <path d="M3 3L17 11" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="5" r="3.25" stroke="#94A3B8" strokeWidth="1.5"/>
    <path d="M1 17C1 13.134 4.13401 10 8 10H10C13.866 10 17 13.134 17 17" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 12 7" fill="none">
    <path d="M1 1L6 6L11 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DACLogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 23" fill="none" className="w-full h-full">
    <path d="M3 22L14 2L25 22" stroke="#1f3a89" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 16H21" stroke="#1f3a89" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// The campus background image (from Figma asset server)
const campusImage = "http://localhost:3845/assets/4a61bd9be8ff5bfa6d8cf17566b963cc4266944e.png";
// DAC emblem / scales of justice icon (white)
const dacEmblem = "http://localhost:3845/assets/49c8ea20f9d122fa96ed5a1c712fd1c6563ba023.svg";

const ROLES = ['Student', 'Faculty', 'Dean / HOD', 'Admin', 'Committee Member'];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole]               = useState('');
  const [roleOpen, setRoleOpen]       = useState(false);
  const [authError, setAuthError]     = useState('');
  const [loading, setLoading]         = useState(false);

  const toFirebaseError = (code) => {
    switch (code) {
      case 'auth/user-not-found':     return 'No account found with this email.';
      case 'auth/wrong-password':     return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':      return 'Invalid email address.';
      case 'auth/too-many-requests':  return 'Too many attempts. Try again later.';
      case 'auth/invalid-credential': return 'Invalid email or password.';
      default:                        return 'Sign-in failed. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
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
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setAuthError(toFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] font-inter flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#e2e8f0] h-[65px] flex items-center justify-between px-10 shrink-0">
        {/* Logo + Name */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <DACLogoIcon />
          </div>
          <span className="text-[#0f121a] text-[20px] font-bold tracking-[-0.3px] leading-none">
            DAC System
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-6">
          <a href="#" className="text-[#0f121a] text-sm font-medium hover:text-[#1f3a89] transition-colors">
            Rules &amp; Regulations
          </a>
          <a href="#" className="text-[#0f121a] text-sm font-medium hover:text-[#1f3a89] transition-colors">
            Contact Support
          </a>
        </nav>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-[49px]">
        <div className="w-full max-w-[1024px]">
          {/* Card */}
          <div className="bg-white border border-[#f1f5f9] rounded-xl shadow-card flex overflow-hidden">

            {/* Left Column – Branding */}
            <div className="relative w-[422px] shrink-0 overflow-hidden bg-[#f1f5f9]">
              {/* Campus photo */}
              <img
                src={campusImage}
                alt="BML Munjal University campus"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* Navy overlay */}
              <div className="absolute inset-0 bg-[#1f3a89] opacity-80 mix-blend-multiply" />

              {/* Branding content — centered vertically */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                {/* Emblem / icon */}
                <div className="mb-4">
                  <img
                    src={dacEmblem}
                    alt="DAC emblem"
                    className="w-[45px] h-[47.5px] object-contain"
                    onError={(e) => {
                      // Fallback SVG scales icon
                      e.target.replaceWith((() => {
                        const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        s.setAttribute('viewBox', '0 0 45 48');
                        s.setAttribute('fill', 'none');
                        s.setAttribute('width', '45');
                        s.setAttribute('height', '47.5');
                        s.innerHTML = `
                          <line x1="22.5" y1="4" x2="22.5" y2="44" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                          <line x1="6" y1="12" x2="39" y2="12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                          <polyline points="6,12 13,28 6,12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M6 28 Q9.5 22 13 28" stroke="white" stroke-width="2" fill="rgba(255,255,255,0.15)" stroke-linecap="round"/>
                          <polyline points="39,12 32,28 39,12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M32 28 Q35.5 22 39 28" stroke="white" stroke-width="2" fill="rgba(255,255,255,0.15)" stroke-linecap="round"/>
                          <line x1="14" y1="44" x2="31" y2="44" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                        `;
                        return s;
                      })());
                    }}
                  />
                </div>

                {/* Title */}
                <h1 className="text-white text-[30px] font-bold leading-[36px] mb-2">
                  Disciplinary Action<br />Committee
                </h1>

                {/* Subtitle */}
                <p className="text-[#dbeafe] text-base leading-6 max-w-[306px]">
                  Rule-Based Expert System for managing student conduct and recommendations.
                </p>
              </div>
            </div>

            {/* Right Column – Login Form */}
            <div className="flex-1 flex flex-col justify-center p-12">
              {/* Heading */}
              <div className="mb-8">
                <h2 className="text-[#0f172a] text-2xl font-bold leading-8 mb-2">Welcome Back</h2>
                <p className="text-[#64748b] text-base leading-6">
                  Please enter your credentials to access the portal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#334155] text-sm font-medium leading-5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <MailIcon />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="university@edu.com"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-10 pr-3 py-[14px] text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1f3a89] focus:ring-1 focus:ring-[#1f3a89] transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#334155] text-sm font-medium leading-5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <LockIcon />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-10 pr-10 py-[14px] text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1f3a89] focus:ring-1 focus:ring-[#1f3a89] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {/* Forgot password */}
                  <div className="flex justify-end">
                    <a
                      href="#"
                      className="text-[#1f3a89] text-xs font-medium leading-4 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#334155] text-sm font-medium leading-5">
                    Select Role
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <PersonIcon />
                    </span>
                    <button
                      id="role-select"
                      type="button"
                      onClick={() => setRoleOpen((v) => !v)}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-10 pr-3 py-[13px] text-sm text-left focus:outline-none focus:border-[#1f3a89] focus:ring-1 focus:ring-[#1f3a89] transition-colors flex items-center justify-between"
                    >
                      <span className={role ? 'text-[#0f172a]' : 'text-[#94a3b8]'}>
                        {role || 'Choose your role...'}
                      </span>
                      <span className={`transition-transform duration-200 ${roleOpen ? 'rotate-180' : ''}`}>
                        <ChevronIcon />
                      </span>
                    </button>

                    {/* Dropdown */}
                    {roleOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-lg shadow-card z-20 overflow-hidden">
                        {ROLES.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => { setRole(r); setRoleOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#f1f5f9] ${
                              role === r ? 'text-[#1f3a89] font-medium bg-[#f1f5f9]' : 'text-[#0f172a]'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Error banner */}
                {authError && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                    {authError}
                  </div>
                )}

                {/* Submit */}
                <button
                  id="sign-in-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1f3a89] text-white text-sm font-bold py-[13px] rounded-lg shadow-btn hover:bg-[#162d6b] active:bg-[#112260] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#e2e8f0]" />
                <span className="text-xs text-[#94a3b8] font-medium">or continue with</span>
                <div className="flex-1 h-px bg-[#e2e8f0]" />
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white border border-[#e2e8f0] rounded-lg py-[11px] text-sm font-medium text-[#0f172a] hover:bg-[#f8fafc] transition-colors disabled:opacity-60 shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>

              {/* Footer note */}
              <p className="text-[#94a3b8] text-xs text-center leading-4 mt-6">
                By signing in, you agree to the University's{' '}
                <a href="#" className="underline hover:text-[#64748b] transition-colors">Privacy Policy</a>
                {' '}and{' '}
                <a href="#" className="underline hover:text-[#64748b] transition-colors">Terms of Service</a>.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="py-6 flex items-center justify-center shrink-0">
        <p className="text-[#94a3b8] text-sm text-center leading-5">
          © 2026 BML Munjal University Disciplinary Action Committee. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
