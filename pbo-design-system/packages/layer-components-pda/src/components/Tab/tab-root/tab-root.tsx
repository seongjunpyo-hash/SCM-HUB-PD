import { forwardRef, type ForwardedRef } from 'react';

import * as PrimitiveTabs from '@radix-ui/react-tabs';

import { TabContextProvider } from '../_context/tab-context';

import { tabListStyles } from './tab-root.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { TabRootProps } from './tab-root.types';

const DEFAULT_WIDTH_MODE = 'hug';

const _TabRoot = <T extends string>(
  { value, onValueChange, widthMode = DEFAULT_WIDTH_MODE, children, ...htmlDivProps }: TabRootProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return (
    <TabContextProvider widthMode={widthMode}>
      <PrimitiveTabs.Root asChild value={value} onValueChange={(value) => onValueChange(value as T)}>
        <PrimitiveTabs.List ref={ref} className={mergeClassNames(tabListStyles, className)} {...restHtmlDivProps}>
          {children}
        </PrimitiveTabs.List>
      </PrimitiveTabs.Root>
    </TabContextProvider>
  );
};

const TabRoot = forwardRef(_TabRoot) as <T extends string>(
  props: TabRootProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof _TabRoot>;

export { TabRoot };
