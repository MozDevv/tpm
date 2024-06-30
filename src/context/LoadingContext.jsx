"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const LoadingContext = createContext();

export const useIsLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setIsLoadingValue = (bool) => {
    setIsLoading(bool);
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading: isLoading, setIsLoading: setIsLoadingValue }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
