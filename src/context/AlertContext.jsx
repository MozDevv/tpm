"use client";
import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const setAlertValue = (alert) => {
    setAlert(alert);
  };

  return (
    <AlertContext.Provider value={{ alert, setAlert: setAlertValue }}>
      {children}
    </AlertContext.Provider>
  );
};
