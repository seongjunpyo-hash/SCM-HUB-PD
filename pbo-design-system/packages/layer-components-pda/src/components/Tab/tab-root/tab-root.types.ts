import type * as PrimitiveTabs from '@radix-ui/react-tabs';
import type { PropsWithChildren } from 'react';

type OmitPrimitiveTabsProps = Omit<PrimitiveTabs.TabsProps, 'value' | 'onValueChange'>;

export type TabRootProps<T extends string> = OmitPrimitiveTabsProps &
  PropsWithChildren & {
    widthMode?: 'hug' | 'fill';
    value: T;
    onValueChange: (value: T) => void;
  };
