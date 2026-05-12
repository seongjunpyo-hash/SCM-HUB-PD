import type { ButtonHTMLAttributes } from 'react';

export type OptionListCreatableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  searchValue: string;
  label?: string;
  onClick: () => void;
};
