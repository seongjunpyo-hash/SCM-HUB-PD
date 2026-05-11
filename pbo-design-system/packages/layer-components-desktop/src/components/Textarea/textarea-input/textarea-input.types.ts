import type { TextareaHTMLAttributes } from 'react';

export type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  onValueChange?: (value: string) => void;
};
