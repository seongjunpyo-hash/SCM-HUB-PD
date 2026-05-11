import { Children, forwardRef, Fragment, isValidElement, type ForwardedRef } from 'react';

import * as Tabs from '@radix-ui/react-tabs';

import { TabContextProvider } from '../_context/tab-context';

import { tabListStyles, tabTextDividerStyle } from './tab-root.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { TabRootProps } from './tab-root.types';

const DEFAULT_SIZE = 'large';
const DEFAULT_TYPE = 'tabLine';

const _TabRoot = <T extends string>(
  { value, onValueChange, size = DEFAULT_SIZE, type = DEFAULT_TYPE, children, ...htmlDivProps }: TabRootProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return (
    <TabContextProvider size={size} type={type}>
      <Tabs.Root asChild value={value} onValueChange={(value) => onValueChange(value as T)}>
        <Tabs.List
          ref={ref}
          className={mergeClassNames(tabListStyles({ type, size }), className)}
          {...restHtmlDivProps}
        >
          {type === 'tabText' ? (
            <>
              {Children.toArray(children).map((child, index, array) => {
                const key = isValidElement(child) && child.props && 'value' in child.props ? child.props.value : index;

                return (
                  <Fragment key={key}>
                    {child}
                    {index < array.length - 1 && <TabTextDivider />}
                  </Fragment>
                );
              })}
            </>
          ) : (
            children
          )}
        </Tabs.List>
      </Tabs.Root>
    </TabContextProvider>
  );
};

const TabTextDivider = () => {
  return <div className={tabTextDividerStyle} />;
};

const TabRoot = forwardRef(_TabRoot) as <T extends string>(
  props: TabRootProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof _TabRoot>;

export { TabRoot };
