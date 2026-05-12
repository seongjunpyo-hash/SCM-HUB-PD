import type { InputHTMLAttributes } from 'react';

export type TextfieldInputProps = InputHTMLAttributes<HTMLInputElement> & {
  validationState?: 'none' | 'error';
  onValueChange?: (value: string) => void;
};
