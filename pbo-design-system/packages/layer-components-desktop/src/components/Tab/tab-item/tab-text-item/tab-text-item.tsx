import { forwardRef, type FocusEvent } from 'react';

import * as PrimitiveTabs from '@radix-ui/react-tabs';

import { useTabContext } from '../../_context/tab-context';

import { sizeStyles, tabTextItemStyles } from './tab-text-item.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { TabItemProps } from '../tab-item.types';

const TabTextItem = forwardRef<HTMLButtonElement, TabItemProps>(
  ({ value, label, children, ...htmlButtonProps }, ref) => {
    const { className, onFocus, ...restHtmlButtonProps } = htmlButtonProps;

    const { size } = useTabContext();

    const handleFocus = (e: FocusEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onFocus?.(e);
    };

    return (
      <PrimitiveTabs.Trigger
        ref={ref}
        value={value}
        tabIndex={0}
        onFocus={handleFocus}
        className={mergeClassNames(tabTextItemStyles, sizeStyles[size], className)}
        {...restHtmlButtonProps}
      >
        {label ?? children}
      </PrimitiveTabs.Trigger>
    );
  },
);

TabTextItem.displayName = 'TabLineItem';

export { TabTextItem };
