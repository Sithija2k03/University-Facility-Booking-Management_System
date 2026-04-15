import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem("authCredentials");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const buildBasicAuthHeader = (email, password) => {
    return "Basic " + btoa(`${email}:${password}`);
  };

  const fetchMe = async (email, password) => {
    const authHeader = buildBasicAuthHeader(email, password);

    const response = await axiosClient.get("/api/auth/me", {
      headers: {
        Authorization: authHeader,
      },
    });

    return response.data;
  };

  const login = async (email, password) => {
    await axiosClient.post("/api/auth/login", {
      email,
      password,
    });

    const me = await fetchMe(email, password);

    const authData = { email, password };

    setCredentials(authData);
    setUser(me);
    localStorage.setItem("authCredentials", JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    setCredentials(null);
    localStorage.removeItem("authCredentials");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (!credentials) {
        setLoading(false);
        return;
      }

      try {
        const me = await fetchMe(credentials.email, credentials.password);
        setUser(me);
      } catch (error) {
        logout();
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
        loading,
        login,
        logout,
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