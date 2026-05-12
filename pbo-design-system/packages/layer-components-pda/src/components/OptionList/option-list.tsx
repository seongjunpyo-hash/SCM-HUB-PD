import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { optionListStyle, typeStyles } from './option-list.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { OptionListProps } from './option-list.types';

const DEFAULT_TYPE: OptionListProps['type'] = 'default';
const DEFAULT_IS_CHECKED: OptionListProps['isChecked'] = false;
const DEFAULT_DISABLED: OptionListProps['disabled'] = false;

const Comp = (
  {
    type = DEFAULT_TYPE,
    isChecked = DEFAULT_IS_CHECKED,
    disabled = DEFAULT_DISABLED,
    label,
    children,
    ...htmlDivProps
  }: OptionListProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  const iconColorToken = disabled ? 'fg-disabled' : 'pda-fg-accent';

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isChecked}
      aria-disabled={disabled}
      className={mergeClassNames(optionListStyle, typeStyles[type], className)}
      {...restHtmlDivProps}
    >
      {label ?? children}
      {isChecked && <Icon name="ic-check" size={28} colorToken={iconColorToken} />}
    </div>
  );
};

const OptionList = forwardRef(Comp);
OptionList.displayName = 'OptionList';

export { OptionList };
