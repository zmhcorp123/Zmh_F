import { useEffect, useMemo, useState } from "react";
import { authApi, dashboardApi, tokenStore } from "../services/api";
import { AuthContext } from "./authContextObject";

const USER_KEY = "zmh_auth_user";

function readStoredUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function storeUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(readStoredUser);
  const [authReady, setAuthReady] = useState(false);

  const setUser = (nextUser) => {
    setUserState(nextUser);
    storeUser(nextUser);
  };

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!tokenStore.get()) {
        setAuthReady(true);
        return;
      }

      try {
        const data = await dashboardApi.profile();
        if (active) setUser(data.user);
      } catch {
        tokenStore.clear();
        if (active) setUser(null);
      } finally {
        if (active) setAuthReady(true);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({
    user,
    authReady,
    isAuthenticated: Boolean(user && tokenStore.get()),
    login: async (payload) => {
      const data = await authApi.login(payload);
      setUser(data.user);
      return data;
    },
    logout: () => {
      authApi.logout();
      setUser(null);
    },
    updateUser: (payload) => setUser({ ...user, ...payload }),
  }), [authReady, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
