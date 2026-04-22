import { useEffect, useMemo, useState } from 'react';
import { getUsers, updateUserRole, resetUserPassword } from '../../services/api';

const ROLE_OPTIONS = ['student', 'warden', 'chief_warden', 'dsw', 'admin'];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingRoleId, setUpdatingRoleId] = useState(null);
  const [resettingPasswordId, setResettingPasswordId] = useState(null);
  const [tempPasswordModal, setTempPasswordModal] = useState({
    open: false,
    userName: '',
    tempPassword: '',
  });

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      try {
        setLoading(true);
        setError('');
        const payload = await getUsers();
        if (!mounted) return;
        setUsers(payload);
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError?.message || 'Failed to fetch users');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => (
      String(user.name || '').toLowerCase().includes(query) ||
      String(user.email || '').toLowerCase().includes(query)
    ));
  }, [users, search]);

  const handleRoleChange = async (userId, nextRole) => {
    try {
      setUpdatingRoleId(userId);
      setError('');
      setSuccess('');
      const result = await updateUserRole(userId, nextRole);

      setUsers((prev) => prev.map((user) => (
        user.id === userId ? { ...user, role: result?.user?.role || nextRole } : user
      )));

      setSuccess('Role updated successfully.');
    } catch (roleError) {
      setError(roleError?.message || 'Failed to update role.');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleResetPassword = async (userId, userName) => {
    try {
      setResettingPasswordId(userId);
      setError('');
      setSuccess('');

      const result = await resetUserPassword(userId);
      setTempPasswordModal({
        open: true,
        userName,
        tempPassword: result?.tempPassword || '',
      });
      setSuccess('Password reset successfully.');
    } catch (resetError) {
      setError(resetError?.message || 'Failed to reset password.');
    } finally {
      setResettingPasswordId(null);
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0f172a]">User Management</h3>
          <p className="text-sm text-[#64748b] mt-0.5">Manage user roles and password resets securely.</p>
        </div>

        <div className="w-full md:w-80">
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <input
            id="user-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
          />
        </div>
      </div>

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                {['Name', 'Email', 'Role', 'Hostel', 'Room', 'Actions'].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#64748b]">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#64748b]">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-[#0f172a]">{user.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-[#334155]">{user.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-[#334155]">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#334155]">{user.hostel || '—'}</td>
                    <td className="px-4 py-3 text-sm text-[#334155]">{user.room || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={user.role}
                          disabled={updatingRoleId === user.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-white border border-[#e2e8f0] rounded-lg px-2.5 py-2 text-xs text-[#334155] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>

                        <button
                          type="button"
                          disabled={resettingPasswordId === user.id}
                          onClick={() => handleResetPassword(user.id, user.name || 'User')}
                          className="inline-flex items-center justify-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-slate-100 transition-colors disabled:opacity-60"
                        >
                          {resettingPasswordId === user.id ? 'Resetting...' : 'Reset Password'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {tempPasswordModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#e2e8f0] p-6 space-y-4">
            <div>
              <h4 className="text-[#0f172a] text-lg font-bold">Temporary Password Generated</h4>
              <p className="text-sm text-[#64748b] mt-1">
                Share this temporary password with {tempPasswordModal.userName}.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold">Temporary Password</p>
              <p className="text-base font-bold text-amber-900 mt-1" style={{ fontFamily: 'Liberation Mono, monospace' }}>
                {tempPasswordModal.tempPassword}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setTempPasswordModal({ open: false, userName: '', tempPassword: '' })}
                className="inline-flex items-center justify-center bg-[#4f46e5] text-white text-sm font-semibold rounded-lg px-4 py-2.5 hover:bg-[#4338ca] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
