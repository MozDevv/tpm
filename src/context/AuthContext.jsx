"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create AuthContext
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  // Function to handle login
  const login = (token) => {
    localStorage.setItem("token", token);

    try {
      const decoded = jwtDecode(token);
      setAuth({
        isAuthenticated: true,
        user: {
          email:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ],
          name: decoded.Name,
          userId:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ],
          permissions: decoded.Permissions,
          roles:
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],

          username: decoded.UserName,
          exp: decoded.exp,
          iss: decoded.iss,
          aud: decoded.aud,
        },
      });
    } catch (error) {
      console.error("Invalid token:", error);
      setAuth({
        isAuthenticated: false,
        user: null,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login(token);
    }
  }, []);

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
