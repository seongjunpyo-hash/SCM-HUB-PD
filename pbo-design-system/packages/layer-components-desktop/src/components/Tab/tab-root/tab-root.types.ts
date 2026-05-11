import type * as PrimitiveTabs from '@radix-ui/react-tabs';

type OmitPrimitiveTabsProps = Omit<PrimitiveTabs.TabsProps, 'value' | 'onValueChange'>;

export type TabRootProps<T extends string> = OmitPrimitiveTabsProps & {
  size?: 'large' | 'medium';
  type?: 'tabLine' | 'tabBox' | 'tabText';
  value: T;
  onValueChange: (value: T) => void;
};
