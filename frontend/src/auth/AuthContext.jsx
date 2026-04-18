import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem("authCredentials");
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState(() => {
    return localStorage.getItem("authMode") || null; // "basic" or "oauth2"
  });
  const [loading, setLoading] = useState(true);

  const buildBasicAuthHeader = (email, password) => {
    return "Basic " + btoa(`${email}:${password}`);
  };

  const fetchMeBasic = async (email, password) => {
    const authHeader = buildBasicAuthHeader(email, password);

    const response = await axiosClient.get("/api/auth/me", {
      headers: {
        Authorization: authHeader,
      },
    });

    return response.data;
  };

  const fetchMeOAuth2 = async () => {
    const response = await axiosClient.get("/api/auth/oauth2/me");
    return response.data;
  };

  const login = async (email, password) => {
    await axiosClient.post("/api/auth/login", {
      email,
      password,
    });

    const me = await fetchMeBasic(email, password);

    const authData = { email, password };

    setCredentials(authData);
    setAuthMode("basic");
    setUser(me);

    localStorage.setItem("authCredentials", JSON.stringify(authData));
    localStorage.setItem("authMode", "basic");
  };

  const register = async (name, email, password) => {
    await axiosClient.post("/api/auth/register", {
      name,
      email,
      password,
    });
  };

  const completeGoogleLogin = async () => {
    const me = await fetchMeOAuth2();

    setUser(me);
    setCredentials(null);
    setAuthMode("oauth2");

    localStorage.removeItem("authCredentials");
    localStorage.setItem("authMode", "oauth2");
  };

  const updateAuthSession = ({ name, password }) => {
    if (authMode !== "basic" || !credentials) {
      if (user) {
        setUser({
          ...user,
          name: name && name.trim() ? name : user.name,
        });
      }
      return;
    }

    const updatedCredentials = {
      ...credentials,
      password: password && password.trim() ? password : credentials.password,
    };

    const updatedUser = user
      ? {
          ...user,
          name: name && name.trim() ? name : user.name,
        }
      : user;

    setCredentials(updatedCredentials);
    setUser(updatedUser);

    localStorage.setItem("authCredentials", JSON.stringify(updatedCredentials));
    localStorage.setItem("authMode", "basic");
  };

  const logout = async () => {
    try {
      if (authMode === "oauth2") {
        await axiosClient.post("/logout");
      }
    } catch {
      // ignore logout cleanup errors
    }

    setUser(null);
    setCredentials(null);
    setAuthMode(null);

    localStorage.removeItem("authCredentials");
    localStorage.removeItem("authMode");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authMode === "basic" && credentials) {
          const me = await fetchMeBasic(credentials.email, credentials.password);
          setUser(me);
        } else if (authMode === "oauth2") {
          const me = await fetchMeOAuth2();
          setUser(me);
        }
      } catch (error) {
        setUser(null);
        setCredentials(null);
        setAuthMode(null);
        localStorage.removeItem("authCredentials");
        localStorage.removeItem("authMode");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        credentials,
        authMode,
        loading,
        login,
        register,
        logout,
        completeGoogleLogin,
        updateAuthSession,
        buildBasicAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}