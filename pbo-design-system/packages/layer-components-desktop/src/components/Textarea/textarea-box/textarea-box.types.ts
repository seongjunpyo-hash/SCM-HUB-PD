import type { HTMLAttributes } from 'react';

export type TextareaBoxProps = HTMLAttributes<HTMLDivElement> & {
  heightMode?: 'min' | 'max' | 'auto';
  validationState?: 'none' | 'error';
};
