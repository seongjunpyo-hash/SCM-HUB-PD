import type { InputHTMLAttributes } from 'react';

export type TextfieldInputProps = InputHTMLAttributes<HTMLInputElement> & {
  type?: 'text' | 'password' | 'number';
  onValueChange?: (value: string) => void;
  onClear?: () => void;
};
