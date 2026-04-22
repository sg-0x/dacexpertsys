import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

function readAuthState() {
  const token = localStorage.getItem('authToken');
  const userRaw = localStorage.getItem('authUser');
  const role = localStorage.getItem('authRole');

  if (!token || !userRaw || !role) return { token: null, user: null };
  if (isTokenExpired(token)) return { token: null, user: null };

  try {
    const user = JSON.parse(userRaw);
    return {
      token,
      user: {
        ...user,
        displayName: user.name,
      },
    };
  } catch {
    return { token: null, user: null };
  }
}

function clearStoredAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authRole');
  localStorage.removeItem('authUser');
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Wrap your app tree with <AuthProvider> to expose auth state everywhere.
 */
export function AuthProvider({ children }) {
  const initial = readAuthState();
  const [currentUser, setCurrentUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const snapshot = readAuthState();
    setCurrentUser(snapshot.user);
    setToken(snapshot.token);
    setLoading(false);
  }, []);

  const login = ({ token: authToken, user }) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authRole', user.role);
    localStorage.setItem('authUser', JSON.stringify(user));
    setToken(authToken);
    setCurrentUser({ ...user, displayName: user.name });
  };

  const logout = async () => {
    clearStoredAuth();
    setToken(null);
    setCurrentUser(null);
  };

  const value = useMemo(() => ({
    currentUser,
    loading,
    token,
    role: currentUser?.role || null,
    login,
    logout,
    isAuthenticated: Boolean(token && currentUser),
  }), [currentUser, loading, token]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Use this hook in any component to access auth state.
 *
 * @returns {{ currentUser: object|null, loading: boolean, token: string|null, role: string|null, login: (payload: {token:string, user:object}) => void, logout: () => Promise<void>, isAuthenticated: boolean }}
 *
 * @example
 *   const { currentUser, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}
