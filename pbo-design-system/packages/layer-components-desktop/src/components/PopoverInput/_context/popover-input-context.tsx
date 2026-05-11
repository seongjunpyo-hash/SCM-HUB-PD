import { createContext, useContext } from 'react';

import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';

type PopoverInputContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const PopoverInputContext = createContext<PopoverInputContextType | null>(null);

export const usePopoverInputContext = (): PopoverInputContextType => {
  const context = useContext(PopoverInputContext);

  if (!context) {
    throw new Error('usePopoverInputContext must be used within a PopoverInputContextProvider');
  }

  return context;
};

type PopoverInputContextProviderProps = PropsWithChildren & PopoverInputContextType;

export const PopoverInputContextProvider = ({ children, ...contextValue }: PopoverInputContextProviderProps) => {
  return <PopoverInputContext.Provider value={contextValue}>{children}</PopoverInputContext.Provider>;
};
