import { createContext, useContext, useState } from 'react';

import type { Dispatch, PropsWithChildren, RefObject, SetStateAction } from 'react';
import type { TextareaInputProps } from '../textarea-input';

type InputState = {
  value: TextareaInputProps['value'];
  maxLength: TextareaInputProps['maxLength'];
};

type TextareaContextType = {
  heightMode: 'min' | 'max' | 'auto';
  validationState: 'none' | 'error';

  inputState: InputState;
  setInputState: Dispatch<SetStateAction<InputState>>;

  boxRef: RefObject<HTMLDivElement>;
};

const TextareaContext = createContext<TextareaContextType | null>(null);

export const useTextareaContext = (): TextareaContextType | null => {
  return useContext(TextareaContext);
};

type TextareaContextProviderProps = PropsWithChildren &
  Pick<TextareaContextType, 'heightMode' | 'validationState' | 'boxRef'>;

export const TextareaContextProvider = ({
  children,
  heightMode,
  validationState,
  boxRef,
}: TextareaContextProviderProps) => {
  const [inputState, setInputState] = useState<InputState>({
    value: undefined,
    maxLength: undefined,
  });

  return (
    <TextareaContext.Provider value={{ inputState, setInputState, heightMode, validationState, boxRef }}>
      {children}
    </TextareaContext.Provider>
  );
};
