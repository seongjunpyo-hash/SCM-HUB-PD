import { createContext, useContext } from 'react';

import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';

type TooltipContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const TooltipContext = createContext<TooltipContextType | null>(null);

export const useTooltipContext = (): TooltipContextType => {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error('TooltipContext must be used within a TooltipContextProvider');
  }

  return context;
};

export const TooltipContextProvider = ({ children, open, setOpen }: TooltipContextType & PropsWithChildren) => {
  return <TooltipContext.Provider value={{ open, setOpen }}>{children}</TooltipContext.Provider>;
};
