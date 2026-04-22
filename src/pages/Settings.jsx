import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import WardenSidebar from '../components/WardenSidebar';
import ChiefWardenSidebar from '../components/ChiefWardenSidebar';
import StudentSidebar from '../components/StudentSidebar';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/api';
import { pageVariants, itemVariants } from '../lib/motion';

function getShellForRole(role) {
  if (role === 'warden') return { title: 'Warden Settings', SidebarComponent: WardenSidebar };
  if (role === 'chief_warden') return { title: 'Chief Warden Settings', SidebarComponent: ChiefWardenSidebar };
  if (role === 'student') return { title: 'Student Settings', SidebarComponent: StudentSidebar };
  return { title: 'Account Settings', SidebarComponent: Sidebar };
}

export default function Settings() {
  const { currentUser, role } = useAuth();
  const { title, SidebarComponent } = useMemo(() => getShellForRole(role), [role]);

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const set = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.currentPassword) nextErrors.currentPassword = 'Current password is required';
    if (!form.newPassword) nextErrors.newPassword = 'New password is required';
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirm password is required';

    if (form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword) {
      nextErrors.confirmPassword = 'New password and confirm password must match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      await changePassword({
        userId: currentUser?.id,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccessMessage('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setErrorMessage(error?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => (
    `w-full bg-[#f8fafc] border rounded-xl px-3 py-2.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
        : 'border-[#e2e8f0] focus:border-[#4f46e5] focus:ring-[#4f46e5]/15'
    }`
  );

  return (
    <div className="min-h-screen bg-[#f0f2ff] font-sans antialiased">
      <SidebarComponent />

      <main className="pt-14 md:pt-0 md:pl-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-4 md:px-6 py-3">
          <h1 className="text-[#0f172a] text-xl font-bold">{title}</h1>
        </header>

        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-4 md:p-6"
        >
          <motion.div variants={itemVariants} className="max-w-2xl bg-white rounded-2xl border border-[#e2e8f0] p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#0f172a]">Change Password</h2>
              <p className="text-sm text-[#64748b] mt-1">Update your account password securely.</p>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#334155]" htmlFor="currentPassword">Current Password *</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={form.currentPassword}
                  onChange={set('currentPassword')}
                  className={inputClass('currentPassword')}
                />
                {errors.currentPassword ? <p className="text-xs text-red-600">{errors.currentPassword}</p> : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#334155]" htmlFor="newPassword">New Password *</label>
                <input
                  id="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={set('newPassword')}
                  className={inputClass('newPassword')}
                />
                {errors.newPassword ? <p className="text-xs text-red-600">{errors.newPassword}</p> : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#334155]" htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  className={inputClass('confirmPassword')}
                />
                {errors.confirmPassword ? <p className="text-xs text-red-600">{errors.confirmPassword}</p> : null}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center bg-[#4f46e5] text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-[#4338ca] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
