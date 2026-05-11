import type { ReactNode } from 'react';

type WithLabel = {
  label: string;
  children?: never;
};

type WithChildren = {
  label?: never;
  children: ReactNode;
};

export type LabelOrChildren = WithLabel | WithChildren;
