import type { InputHTMLAttributes } from 'react';

export type TextfieldSearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  validationState?: 'none' | 'error';
  onValueChange?: (value: string) => void;
};
