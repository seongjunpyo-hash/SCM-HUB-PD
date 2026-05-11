import { createContext, useContext, useState } from 'react';

import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import type { TextfieldInputProps } from '../textfield-input';

type InputState = {
  value: TextfieldInputProps['value'];
  maxLength: TextfieldInputProps['maxLength'];
};

type TextfieldContextType = {
  validationState: 'none' | 'error';

  inputState: InputState;
  setInputState: Dispatch<SetStateAction<InputState>>;
};

const TextfieldContext = createContext<TextfieldContextType | null>(null);

export const useTextfieldContext = (): TextfieldContextType => {
  const context = useContext(TextfieldContext);

  if (!context) {
    throw new Error('TextfieldContext must be used within a TextfieldContextProvider');
  }

  return context;
};

type TextfieldContextProviderProps = PropsWithChildren & Pick<TextfieldContextType, 'validationState'>;

export const TextfieldContextProvider = ({ children, validationState }: TextfieldContextProviderProps) => {
  const [inputState, setInputState] = useState<InputState>({
    value: undefined,
    maxLength: undefined,
  });

  return (
    <TextfieldContext.Provider value={{ inputState, setInputState, validationState }}>
      {children}
    </TextfieldContext.Provider>
  );
};
