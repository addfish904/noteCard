"use client";
import { createContext, useContext, useState } from "react";

type SelectedTagContextType = {
  selectedTagId: string | null;
  setSelectedTagId: (id: string | null) => void;
};

const SelectedTagContext = createContext<SelectedTagContextType | undefined>(undefined);

export const SelectedTagProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  return (
    <SelectedTagContext.Provider value={{ selectedTagId, setSelectedTagId }}>
      {children}
    </SelectedTagContext.Provider>
  );
};

export const useSelectedTag = () => {
  const context = useContext(SelectedTagContext);
  if (!context) throw new Error("useSelectedTag must be used within SelectedTagProvider");
  return context;
};
