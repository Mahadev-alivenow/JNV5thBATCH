import React, { createContext, useContext, useState, useCallback } from "react";
import { Spinner } from "../components/Spinner";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Spinner className="mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
