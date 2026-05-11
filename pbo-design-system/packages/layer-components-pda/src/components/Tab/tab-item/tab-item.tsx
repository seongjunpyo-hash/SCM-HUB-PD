import { forwardRef } from 'react';

import * as PrimitiveTabs from '@radix-ui/react-tabs';

import { useTabContext } from '../_context/tab-context';

import { tabItemStyles, widthModeStyles } from './tab-item.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { TabItemProps } from './tab-item.types';

const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(({ value, label, children, ...htmlDivProps }, ref) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  const { widthMode } = useTabContext();

  return (
    <PrimitiveTabs.Trigger
      ref={ref}
      value={value}
      className={mergeClassNames(tabItemStyles, widthModeStyles[widthMode], className)}
      {...restHtmlDivProps}
    >
      {label ?? children}
    </PrimitiveTabs.Trigger>
  );
});

TabItem.displayName = 'TabItem';

export { TabItem };
