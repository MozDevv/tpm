"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const SelectedItemContext = createContext();

export const useSelectedItem = () => useContext(SelectedItemContext);

export const SelectedItemProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const savedItem = localStorage.getItem("selectedItem");
    if (savedItem) {
      setSelectedItem(savedItem);
    } else {
      setSelectedItem("Dashboard");
    }
  }, []); // This effect will run only once on mount

  const setSelectedItemValue = (newItem) => {
    setSelectedItem(newItem);
  };

  useEffect(() => {
    localStorage.setItem("selectedItem", selectedItem);
  }, [selectedItem]);

  return (
    <SelectedItemContext.Provider
      value={{ selectedItem, setSelectedItem: setSelectedItemValue }}
    >
      {children}
    </SelectedItemContext.Provider>
  );
};
