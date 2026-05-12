import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { iconSizeMap } from './status-tag.constants';
import {
  badgeProgressStyles,
  badgeSizeStyles,
  badgeStyles,
  countStyles,
  progressStyles,
  restVariantStyles,
  solidStyles,
  statusTagStyle,
  subtleStyles,
} from './status-tag.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { StatusTagProps } from './status-tag.types';

const DEFAULT_VARIANT: StatusTagProps['variant'] = 'default';
const DEFAULT_SIZE: StatusTagProps['size'] = 'medium';
const DEFAULT_PROGRESS_TYPE: StatusTagProps['progressType'] = 'primary';
const DEFAULT_EMPHASIS: StatusTagProps['emphasis'] = 'solid';
const DEFAULT_INFO_ICON: StatusTagProps['infoIcon'] = false;
const DEFAULT_BADGE: StatusTagProps['badge'] = false;

const StatusTag = forwardRef<HTMLDivElement, StatusTagProps>(
  (
    {
      variant = DEFAULT_VARIANT,
      progressType = DEFAULT_PROGRESS_TYPE,
      emphasis = DEFAULT_EMPHASIS,
      size = DEFAULT_SIZE,
      label,
      count,
      infoIcon = DEFAULT_INFO_ICON,
      badge = DEFAULT_BADGE,
      ...htmlDivProps
    },
    ref,
  ) => {
    const { className, ...restHtmlDivProps } = htmlDivProps;

    const isProgress = variant === 'progress';
    const isSolid = emphasis === 'solid';

    const emphasisStyle = isSolid ? solidStyles[size] : subtleStyles[size];
    const colorStyle = isSolid ? (isProgress ? progressStyles[progressType] : restVariantStyles[variant]) : undefined;

    return (
      <div
        ref={ref}
        className={mergeClassNames(statusTagStyle, emphasisStyle, colorStyle, className)}
        {...restHtmlDivProps}
      >
        {badge && (
          <div
            className={mergeClassNames(
              badgeSizeStyles[size],
              isProgress ? badgeProgressStyles[progressType] : badgeStyles[variant],
            )}
          />
        )}
        {label}
        {count !== undefined && <span className={countStyles[size]}>{count}</span>}
        {infoIcon && <Icon name="ic-infoCircle" colorToken="assistIcon-fg" size={iconSizeMap[size]} />}
      </div>
    );
  },
);

StatusTag.displayName = 'StatusTag';

export { StatusTag };
