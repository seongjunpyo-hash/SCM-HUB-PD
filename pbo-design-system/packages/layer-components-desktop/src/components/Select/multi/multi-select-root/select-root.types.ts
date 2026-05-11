import type { PropsWithChildren } from 'react';

export type SelectRootProps<T extends string> = PropsWithChildren & {
  value: T[];
  onValueChange: (value: T[]) => void;
  options: { value: T; label: string }[];
};
