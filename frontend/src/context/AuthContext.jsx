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
            logout();
          }
        }
      } else {
        logout();
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
      const jwtToken = response.data?.token;

      if (jwtToken) {
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);
      }

      // Fetch the actual database profile
      const profileResponse = await authApi.getCurrentUser();
      const dbUser = profileResponse.data;

      setUser(dbUser);
      localStorage.setItem("user", JSON.stringify(dbUser));
      setIsLoading(false);
      return { success: true, user: dbUser };
    } catch (error) {
      setIsLoading(false);
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (email, password, username, otp) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(email, password, username, otp);
      const jwtToken = response.data?.token;

      if (jwtToken) {
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);
      }

      // Fetch the actual database profile
      const profileResponse = await authApi.getCurrentUser();
      const newUser = profileResponse.data;

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (error) {
      setIsLoading(false);
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getCurrentUser();
      if (res?.data) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
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