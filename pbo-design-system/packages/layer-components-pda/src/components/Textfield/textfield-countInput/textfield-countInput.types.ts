import type { InputHTMLAttributes } from 'react';

type OmitInputHTMLAttributes = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'placeholder'>;

export type TextfieldCountInputProps = OmitInputHTMLAttributes & {
  validationState?: 'none' | 'error';
  countTotalSmall?: boolean;
  valueAccent?: boolean;
  count: number;
  totalCount: number;
  onCountChange?: (value: number) => void;
};
