import type { HTMLAttributes } from 'react';

export type StatusTagProps = HTMLAttributes<HTMLDivElement> &
  Variant &
  EmphasisAndBadge & {
    infoIcon?: boolean;
    size?: 'xsmall' | 'small' | 'medium';
    label: string;
    count?: number;
  };

type EmphasisAndBadge =
  | {
      emphasis?: 'solid';
      badge?: boolean;
    }
  | {
      emphasis: 'subtle';
      badge: true;
    };

type Variant =
  | {
      variant?: 'default' | 'success' | 'warning' | 'critical';
      progressType?: never;
    }
  | {
      variant: 'progress';
      progressType?: 'primary' | 'secondary' | 'tertiary';
    };
