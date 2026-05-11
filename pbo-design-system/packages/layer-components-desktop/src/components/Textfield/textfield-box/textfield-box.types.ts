import type { HTMLAttributes } from 'react';

export type TextfieldBoxProps = HTMLAttributes<HTMLDivElement> & {
  validationState?: 'none' | 'error';
};
