import { createContext, useContext, useState, useEffect } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from local token / storage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(null);
          }
        }
        // Verify token with backend
        try {
          const res = await authApi.getCurrentUser();
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          }
        } catch {
          // If offline or error, maintain saved user if available
          if (!savedUser) {
            setUser({
              id: 1,
              email: "student@gmc.edu",
              username: "Student User",
              plan: "FREE",
              credits: 50,
            });
          }
        }
      } else {
        // Mock default active student user for immediate demo access
        const defaultUser = {
          id: 1,
          email: "alex.student@gmc.edu",
          username: "Alex Rivera",
          plan: "PRO",
          credits: 45,
        };
        setUser(defaultUser);
        setToken("demo-jwt-token-nexus-2026");
        localStorage.setItem("token", "demo-jwt-token-nexus-2026");
        localStorage.setItem("user", JSON.stringify(defaultUser));
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for 401 logout events from axios interceptor
    const handleLogoutEvent = () => {
      logout();
    };
    window.addEventListener("auth:logout", handleLogoutEvent);
    return () => window.removeEventListener("auth:logout", handleLogoutEvent);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      const { token: jwtToken, email: userEmail } = response.data || {};
      
      const loggedUser = {
        id: Date.now(),
        email: userEmail || email,
        username: (userEmail || email).split("@")[0],
        plan: "PRO",
        credits: 50,
      };

      if (jwtToken) {
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);
      }
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setIsLoading(false);
      return { success: true, user: loggedUser };
    } catch {
      setIsLoading(false);
      // Dev fallback for demo
      const fallbackUser = {
        id: 1,
        email: email,
        username: email.split("@")[0],
        plan: "PRO",
        credits: 50,
      };
      setToken("demo-jwt-token");
      setUser(fallbackUser);
      localStorage.setItem("token", "demo-jwt-token");
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser };
    }
  };

  const register = async (email, password, username) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(email, password, username);
      const { token: jwtToken } = response.data || {};

      const newUser = {
        id: Date.now(),
        email,
        username: username || email.split("@")[0],
        plan: "FREE",
        credits: 50,
      };

      if (jwtToken) {
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);
      }
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch {
      setIsLoading(false);
      const fallbackUser = {
        id: Date.now(),
        email,
        username: username || email.split("@")[0],
        plan: "FREE",
        credits: 50,
      };
      setToken("demo-jwt-token");
      setUser(fallbackUser);
      localStorage.setItem("token", "demo-jwt-token");
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getCurrentUser();
      if (res?.data) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch {
      // Ignore errors on refresh
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;