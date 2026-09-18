import { useNavigate, useRouterState } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { currentUser } from "@/lib/talab-data";
const STORAGE_KEY = "talab.session";
const AuthContext = createContext(null);
function baseSessionUser() {
  return {
    ...currentUser,
    email: currentUser.email ?? "sarah.benali@talab.tn",
    phone: currentUser.phone ?? "+216 22 145 987",
    username: currentUser.username ?? "sarahba",
  };
}
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setIsLoading(false);
  }, []);
  const persist = useCallback((next) => {
    setUser(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login: (email) => persist({ ...baseSessionUser(), email }),
      register: ({ name, email, location }) =>
        persist({
          ...baseSessionUser(),
          name,
          email,
          location,
          username: email.split("@")[0] ?? "member",
          initials: name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase(),
        }),
      logout: () => persist(null),
      updateUser: (patch) => persist(user ? { ...user, ...patch } : user),
    }),
    [user, isLoading, persist],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const href = useRouterState({ select: (s) => s.location.href });
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: href }, replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, href]);
  return { isAuthenticated, isLoading };
}
export { AuthProvider, useAuth, useRequireAuth };
