import { createContext, useContext } from 'react';

import { usePopoverInputContext } from '@/components/PopoverInput';

import type { PropsWithChildren } from 'react';

type SelectContextType = {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
};

export const SelectContext = createContext<SelectContextType | null>(null);

export const useSelectContext = (): SelectContextType & ReturnType<typeof usePopoverInputContext> => {
  const context = useContext(SelectContext);
  const popoverInputContext = usePopoverInputContext();

  if (!context) {
    throw new Error('useSelectContext must be used within a SelectContextProvider');
  }

  return { ...context, ...popoverInputContext };
};

type SelectContextProviderProps = PropsWithChildren & SelectContextType;

export const SelectContextProvider = ({ children, ...contextValue }: SelectContextProviderProps) => {
  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
};
