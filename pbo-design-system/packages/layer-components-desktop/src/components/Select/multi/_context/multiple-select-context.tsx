import { createContext, useContext } from 'react';

import { usePopoverInputContext } from '@/components/PopoverInput';

import type { PropsWithChildren } from 'react';

type MultipleSelectContextType = {
  value: string[];
  onValueChange: (value: string[]) => void;
  options: { value: string; label: string }[];
};

export const MultipleSelectContext = createContext<MultipleSelectContextType | null>(null);

export const useMultipleSelectContext = (): MultipleSelectContextType & ReturnType<typeof usePopoverInputContext> => {
  const context = useContext(MultipleSelectContext);
  const popoverInputContext = usePopoverInputContext();

  if (!context) {
    throw new Error('useMultipleSelectContext must be used within a MultipleSelectContextProvider');
  }

  return { ...context, ...popoverInputContext };
};

type MultipleSelectContextProviderProps = PropsWithChildren & MultipleSelectContextType;

export const MultipleSelectContextProvider = ({ children, ...contextValue }: MultipleSelectContextProviderProps) => {
  return <MultipleSelectContext.Provider value={contextValue}>{children}</MultipleSelectContext.Provider>;
};
