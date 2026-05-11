import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { iconSizeMap } from './label-tag.constants';
import { colorVariantStyles, countStyles, labelTagStyle, sizeStyles } from './label-tag.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { LabelTagProps } from './label-tag.types';

const DEFAULT_COLOR_VARIANT: LabelTagProps['colorVariant'] = 'gray';
const DEFAULT_SIZE: LabelTagProps['size'] = 'medium';
const DEFAULT_INFO_ICON: LabelTagProps['infoIcon'] = false;

const LabelTag = forwardRef<HTMLDivElement, LabelTagProps>(
  (
    {
      colorVariant = DEFAULT_COLOR_VARIANT,
      size = DEFAULT_SIZE,
      label,
      count,
      infoIcon = DEFAULT_INFO_ICON,
      ...htmlDivProps
    },
    ref,
  ) => {
    const { className, ...restHtmlDivProps } = htmlDivProps;

    return (
      <div
        ref={ref}
        className={mergeClassNames(
          labelTagStyle,
          colorVariantStyles[colorVariant],
          sizeStyles({ size, infoIcon }),
          className,
        )}
        {...restHtmlDivProps}
      >
        {label}
        {count !== undefined && <span className={countStyles[size]}>{count}</span>}
        {infoIcon && <Icon name="ic-infoCircle" colorToken="assistIcon-fg" size={iconSizeMap[size]} />}
      </div>
    );
  },
);

LabelTag.displayName = 'LabelTag';

export { LabelTag };
