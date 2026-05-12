import { forwardRef } from 'react';

import { floatingActionButtonStyle } from './floating-action-button.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';
import { getIcon } from '@/shared/utils/prefix-suffix-icon';

import type { ForwardedRef } from 'react';
import type { FloatingActionButtonProps } from './floating-action-button.types';

const ICON_SIZE = 24;

const Comp = (
  { children, label, prefixIcon: prefixIconName, ...htmlButtonProps }: FloatingActionButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) => {
  const { className, ...restHtmlButtonProps } = htmlButtonProps;

  const PrefixIcon = getIcon(prefixIconName);

  return (
    <button ref={ref} className={mergeClassNames(floatingActionButtonStyle, className)} {...restHtmlButtonProps}>
      {PrefixIcon && <PrefixIcon filled size={ICON_SIZE} color="currentColor" />}
      {label ?? children}
    </button>
  );
};

const FloatingActionButton = forwardRef(Comp);
FloatingActionButton.displayName = 'FloatingActionButton';

export { FloatingActionButton };
