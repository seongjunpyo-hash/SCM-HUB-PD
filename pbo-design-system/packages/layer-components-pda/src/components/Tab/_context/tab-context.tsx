import { createContext, useContext } from 'react';

import type { PropsWithChildren } from 'react';

type TabContextType = {
  widthMode: 'hug' | 'fill';
};

const TabContext = createContext<TabContextType | null>(null);

export const useTabContext = (): TabContextType => {
  const context = useContext(TabContext);

  if (!context) {
    throw new Error('TabContext must be used within a TabContextProvider');
  }

  return context;
};

type TabContextProviderProps = PropsWithChildren & TabContextType;

export const TabContextProvider = ({ widthMode, children }: TabContextProviderProps) => {
  return <TabContext.Provider value={{ widthMode }}>{children}</TabContext.Provider>;
};
