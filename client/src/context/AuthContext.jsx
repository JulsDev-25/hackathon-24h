import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios.get("/api/me/", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUser(res.data))
        .catch(() => {
          setUser(null);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    axios.get("/api/me/", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUser(res.data));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
