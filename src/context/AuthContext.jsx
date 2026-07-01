import { useMemo, useState } from "react";
import { AuthContext } from "./authContextObject";

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ name: "Demo Client", email: "client@zmhusacorp.com", company: "Home Service Co.", role: "user" });

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: (payload) => setUser({ name: payload.name || payload.email?.split("@")[0] || "Client", email: payload.email, company: payload.company || "New Client", role: payload.role || "user" }),
    logout: () => setUser(null),
    updateUser: (payload) => setUser((current) => ({ ...current, ...payload })),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
