import { createContext, useContext } from 'react';

import type { PropsWithChildren } from 'react';
import type { DialogProps } from '../dialog.types';

type DialogContextType = {
  type: NonNullable<DialogProps['type']>;
};

const DialogContext = createContext<DialogContextType>({
  type: 'default',
});

export const useDialogContext = (): DialogContextType => {
  return useContext(DialogContext);
};

type DialogContextProviderProps = PropsWithChildren & {
  type: NonNullable<DialogProps['type']>;
};

export const DialogContextProvider = ({ children, type }: DialogContextProviderProps) => {
  return <DialogContext.Provider value={{ type }}>{children}</DialogContext.Provider>;
};
