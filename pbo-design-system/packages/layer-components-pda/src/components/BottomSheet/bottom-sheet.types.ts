import type { HTMLAttributes, PropsWithChildren } from 'react';

export type BottomSheetProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren & {
    open: boolean;
    onClose: () => void;
    title?: string;
    type?: 'optionSelect' | 'contents';
    scrollType?: 'expanded' | 'fixed';
  };
