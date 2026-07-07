import { useCallback, useEffect, useMemo, useState } from "react";
import { authApi, clearAuthStorage, dashboardApi, setUnauthorizedHandler, tokenStore } from "../services/api";
import { AuthContext } from "./authContextObject";

const USER_KEY = "zmh_auth_user";
const SESSION_MESSAGE_KEY = "zmh_session_message";

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
  const [sessionMessage, setSessionMessage] = useState(() => sessionStorage.getItem(SESSION_MESSAGE_KEY) || "");

  const setUser = useCallback((nextUser) => {
    setUserState(nextUser);
    storeUser(nextUser);
  }, []);

  const clearSessionMessage = useCallback(() => {
    setSessionMessage("");
    sessionStorage.removeItem(SESSION_MESSAGE_KEY);
  }, []);

  const expireSession = useCallback(() => {
    clearAuthStorage();
    setUserState(null);
    setSessionMessage("Session expired. Please log in again.");
    sessionStorage.setItem(SESSION_MESSAGE_KEY, "Session expired. Please log in again.");
  }, []);

  useEffect(() => {
    let active = true;
    setUnauthorizedHandler(() => {
      if (active) expireSession();
    });

    const loadProfile = async () => {
      if (!tokenStore.get()) {
        storeUser(null);
        setAuthReady(true);
        return;
      }

      try {
        const data = await dashboardApi.profile();
        if (active) {
          setUser(data.user);
          clearSessionMessage();
        }
      } catch (error) {
        if (!active) return;
        if (error.status === 401 || error.status === 403) expireSession();
      } finally {
        if (active) setAuthReady(true);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [clearSessionMessage, expireSession, setUser]);

  const login = useCallback(async (payload) => {
    clearSessionMessage();
    const data = await authApi.login(payload);
    setUser(data.user);
    return data;
  }, [clearSessionMessage, setUser]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    clearSessionMessage();
  }, [clearSessionMessage, setUser]);

  const updateUser = useCallback((payload) => {
    setUserState((currentUser) => {
      const nextUser = { ...currentUser, ...payload };
      storeUser(nextUser);
      return nextUser;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await dashboardApi.profile();
    setUser(data.user);
    return data;
  }, [setUser]);

  const value = useMemo(() => ({
    user,
    authReady,
    sessionMessage,
    isAuthenticated: Boolean(user && tokenStore.get()),
    login,
    logout,
    updateUser,
    refreshUser,
    clearSessionMessage,
  }), [authReady, clearSessionMessage, login, logout, refreshUser, sessionMessage, updateUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
