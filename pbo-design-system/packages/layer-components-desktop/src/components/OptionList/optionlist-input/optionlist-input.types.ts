import type { InputHTMLAttributes } from 'react';

export type OptionListInputProps = InputHTMLAttributes<HTMLInputElement> & {
  onValueChange?: (value: string) => void;
  onClear?: () => void;
};
