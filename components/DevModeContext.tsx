import React, { createContext, useContext, useState, useEffect } from 'react';

interface DevModeContextType {
  isDevMode: boolean;
  enableDevMode: (password: string) => boolean;
  disableDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType | null>(null);

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (!context) throw new Error('useDevMode must be used within DevModeProvider');
  return context;
};

export const DevModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gifty_dev_mode');
    if (saved === 'true') setIsDevMode(true);
  }, []);

  const enableDevMode = (password: string) => {
    // 1. Check Vite env
    // 2. Check Process env
    // 3. Fallback
    let correctPassword = 'dev'; // Default fallback

    // Use type assertion to avoid TS error if ImportMeta is not fully typed in this environment
    const meta = import.meta as any;

    if (typeof meta !== 'undefined' && meta.env && meta.env.VITE_DEV_PASSWORD) {
        correctPassword = meta.env.VITE_DEV_PASSWORD;
    } else if (typeof process !== 'undefined' && process.env && process.env.DEV_MODE_PASSWORD) {
        correctPassword = process.env.DEV_MODE_PASSWORD;
    }

    if (password === correctPassword) {
      setIsDevMode(true);
      localStorage.setItem('gifty_dev_mode', 'true');
      return true;
    }
    return false;
  };

  const disableDevMode = () => {
    setIsDevMode(false);
    localStorage.removeItem('gifty_dev_mode');
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, enableDevMode, disableDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
};