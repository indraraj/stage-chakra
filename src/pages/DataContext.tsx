/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode, FC, useMemo } from "react";
import { Destination, Source } from "../utils/apis";

interface DataContextType {
  source: Source | null;
  setSource: React.Dispatch<React.SetStateAction<Source | null>>;
  destination: Destination | null;
  setDestination: React.Dispatch<React.SetStateAction<Destination | null>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [source, setSource] = useState<Source | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);

  const value = useMemo(() => ({
    source,
    setSource,
    destination,
    setDestination,
  }), [source, setSource, destination, setDestination]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
