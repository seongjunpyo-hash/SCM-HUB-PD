import type { HTMLAttributes } from 'react';

export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  label: string;
  count?: number;
  disabled?: boolean;
};
