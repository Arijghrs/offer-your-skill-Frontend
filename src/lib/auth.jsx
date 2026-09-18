import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already authenticated
  // when the application starts.
  const fetchCurrentUser = useCallback(async () => {
    try {
      const data = await api("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = useCallback(async ({ email, password }) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    setUser(data.user);

    return data;
  }, []);

  const register = useCallback(
    async ({ fullName, email, password, username }) => {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          password,
          username,
        }),
      });

      setUser(data.user);

      return data;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api("/auth/logout", {
        method: "POST",
      });
    } catch {
      // Even if the backend request fails,
      // clear the local authentication state.
    }

    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((currentUser) =>
      currentUser ? { ...currentUser, ...patch } : currentUser,
    );
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, isLoading, login, register, logout, updateUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}

function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const href = useRouterState({
    select: (s) => s.location.href,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: "/login",
        search: { redirect: href },
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, navigate, href]);

  return { isAuthenticated, isLoading };
}

export { AuthProvider, useAuth, useRequireAuth };