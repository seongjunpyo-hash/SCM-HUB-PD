import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { iconSizeMap } from './filter-tag.constants';
import { filterTagStyle, selectedSizeStyles, unSelectedSizeStyles } from './filter-tag.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { FilterTagProps } from './filter-tag.types';

const DEFAULT_SIZE: FilterTagProps['size'] = 'medium';
const DEFAULT_IS_SELECTED: FilterTagProps['isSelected'] = false;

const FilterTag = forwardRef<HTMLButtonElement, FilterTagProps>(
  ({ size = DEFAULT_SIZE, isSelected = DEFAULT_IS_SELECTED, label, children, ...htmlButtonProps }, ref) => {
    const { className, ...restHtmlButtonProps } = htmlButtonProps;

    const sizeStyles = isSelected ? selectedSizeStyles : unSelectedSizeStyles;

    return (
      <button
        ref={ref}
        className={mergeClassNames(filterTagStyle, sizeStyles({ size }), className)}
        {...restHtmlButtonProps}
      >
        {isSelected && <Icon name="ic-check" color="currentColor" size={iconSizeMap[size]} />}
        {label ?? children}
      </button>
    );
  },
);

FilterTag.displayName = 'FilterTag';

export { FilterTag };
