import { useEffect, useMemo, useState } from "react";
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

  const setUser = (nextUser) => {
    setUserState(nextUser);
    storeUser(nextUser);
  };

  const clearSessionMessage = () => {
    setSessionMessage("");
    sessionStorage.removeItem(SESSION_MESSAGE_KEY);
  };

  const expireSession = () => {
    clearAuthStorage();
    setUserState(null);
    setSessionMessage("Session expired. Please log in again.");
    sessionStorage.setItem(SESSION_MESSAGE_KEY, "Session expired. Please log in again.");
  };

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
  }, []);

  const value = useMemo(() => ({
    user,
    authReady,
    sessionMessage,
    isAuthenticated: Boolean(user && tokenStore.get()),
    login: async (payload) => {
      clearSessionMessage();
      const data = await authApi.login(payload);
      setUser(data.user);
      return data;
    },
    logout: () => {
      authApi.logout();
      setUser(null);
      clearSessionMessage();
    },
    updateUser: (payload) => setUser({ ...user, ...payload }),
    refreshUser: async () => {
      const data = await dashboardApi.profile();
      setUser(data.user);
      return data;
    },
    clearSessionMessage,
  }), [authReady, sessionMessage, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
