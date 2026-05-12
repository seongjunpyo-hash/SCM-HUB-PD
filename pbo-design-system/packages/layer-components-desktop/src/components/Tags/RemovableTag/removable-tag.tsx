import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { iconSizeMap } from './removable-tag.constants';
import { iconButtonStyle, removableTagStyle, sizeStyles, variantStyles } from './removable-tag.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { RemovableTagProps } from './removable-tag.types';

const DEFAULT_VARIANT: RemovableTagProps['variant'] = 'outlined';
const DEFAULT_SIZE: RemovableTagProps['size'] = 'small';

const RemovableTag = forwardRef<HTMLDivElement, RemovableTagProps>(
  ({
    variant = DEFAULT_VARIANT,
    size = DEFAULT_SIZE,
    disabled = false,
    label,
    children,
    onRemove,
    ...htmlDivProps
  }) => {
    const { className, ...restHtmlDivProps } = htmlDivProps;

    return (
      <div
        aria-disabled={disabled}
        className={mergeClassNames(removableTagStyle, variantStyles[variant], sizeStyles[size], className)}
        {...restHtmlDivProps}
      >
        {label ?? children}
        <button className={iconButtonStyle} disabled={disabled} onClick={onRemove}>
          <Icon name="ic-close" size={iconSizeMap[size]} color="currentColor" />
        </button>
      </div>
    );
  },
);

RemovableTag.displayName = 'StatusTag';

export { RemovableTag };
