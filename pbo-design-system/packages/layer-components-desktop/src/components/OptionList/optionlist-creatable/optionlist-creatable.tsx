import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { creatableStyle, textWrapStyle } from './optionlist-creatable.css';

import { Typography } from '@/components/Typography';
import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { OptionListCreatableProps } from './optionlist-creatable.types';

const OptionListCreatable = forwardRef<HTMLButtonElement, OptionListCreatableProps>(
  ({ searchValue, label = '추가', onClick, ...htmlButtonProps }, ref) => {
    const { className, ...restHtmlButtonProps } = htmlButtonProps;

    return (
      <button
        ref={ref}
        className={mergeClassNames(creatableStyle, className)}
        onClick={onClick}
        {...restHtmlButtonProps}
      >
        <Icon name="ic-plus" size={20} colorToken="fg-lower" />
        <div className={textWrapStyle}>
          <Typography as="span" name="base-text-l-medium" colorToken="fg-lower">
            {searchValue}
          </Typography>
          <Typography as="span" name="base-text-l">
            {label}
          </Typography>
        </div>
      </button>
    );
  },
);

OptionListCreatable.displayName = 'OptionListCreatable';

export { OptionListCreatable };
