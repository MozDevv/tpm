"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const SelectedItemContext = createContext();

export const useSelectedItem = () => useContext(SelectedItemContext);

export const SelectedItemProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null); // Initialize with null
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedItem = localStorage.getItem("selectedItem");
      setSelectedItem(savedItem || "Dashboard");
      setIsLoading(false); // Set loading to false once state is updated
    }
  }, []); // This effect will run only once on mount

  const setSelectedItemValue = (newItem) => {
    setSelectedItem(newItem);
  };

  useEffect(() => {
    if (selectedItem !== null) {
      localStorage.setItem("selectedItem", selectedItem);
    }
  }, [selectedItem]);

  if (isLoading) {
    // Render nothing or a loading state until selectedItem is set
    return null; // Alternatively, you can render a loading spinner or placeholder
  }

  return (
    <SelectedItemContext.Provider
      value={{ selectedItem, setSelectedItem: setSelectedItemValue }}
    >
      {children}
    </SelectedItemContext.Provider>
  );
};
