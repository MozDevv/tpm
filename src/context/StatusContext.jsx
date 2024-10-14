'use client';
import { createContext, useContext, useState } from 'react';

const StatusContext = createContext();

export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }) => {
  const [workFlowChange, setWorkFlowChange] = useState(false);

  const setWorkFlowChangeValue = (alert) => {
    setWorkFlowChange(alert);
  };

  return (
    <StatusContext.Provider
      value={{ workFlowChange, setWorkFlowChange: setWorkFlowChangeValue }}
    >
      {children}
    </StatusContext.Provider>
  );
};
