// RetireeIdContext.js
"use client";
import React, { createContext, useState, useContext } from "react";

// Create the context
const RetireeIdContext = createContext();

// Create a provider component
export const RetireeIdProvider = ({ children }) => {
  const [retireeId, setRetireeId] = useState(null);

  return (
    <RetireeIdContext.Provider value={{ retireeId, setRetireeId }}>
      {children}
    </RetireeIdContext.Provider>
  );
};

// Create a custom hook to use the RetireeIdContext
export const useRetireeId = () => {
  return useContext(RetireeIdContext);
};
