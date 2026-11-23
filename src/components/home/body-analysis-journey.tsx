"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const Journey = createContext<{
  service: string;
  selectService: (service: string) => void;
} | null>(null);
export function BodyAnalysisJourney({
  initialService,
  children,
}: {
  initialService: string;
  children: ReactNode;
}) {
  const [service, selectService] = useState(initialService);
  return (
    <Journey.Provider value={{ service, selectService }}>
      {children}
    </Journey.Provider>
  );
}
export function useAnalysisJourney() {
  return useContext(Journey);
}
