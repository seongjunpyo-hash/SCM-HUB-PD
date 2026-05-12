import type * as PrimitiveTabs from '@radix-ui/react-tabs';

export type TabItemProps = PrimitiveTabs.TabsTriggerProps & {
  value: string;
  label?: string;
};
