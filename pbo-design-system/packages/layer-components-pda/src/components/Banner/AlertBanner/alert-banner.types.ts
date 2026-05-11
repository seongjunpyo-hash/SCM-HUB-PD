import type { HTMLAttributes, ReactNode } from 'react';

export type AlertBannerProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'small' | 'medium';
  validationState?: 'warning' | 'critical' | 'success' | 'accent';
} & TextOrChildren;

type WithText = {
  text: string;
  children?: never;
};

type WithChildren = {
  text?: never;
  children: ReactNode;
};

export type TextOrChildren = WithText | WithChildren;
