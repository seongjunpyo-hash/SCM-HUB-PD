import { forwardRef, type ForwardedRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { iconColorToken, iconName, iconSize } from './alert-banner.constants';
import { alertBannerStyle, sizeStyles, validationStateStyles } from './alert-banner.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { AlertBannerProps } from './alert-banner.types';

const DEFAULT_SIZE: AlertBannerProps['size'] = 'medium';
const DEFAULT_VALIDATION_STATE: AlertBannerProps['validationState'] = 'warning';

const Comp = (
  {
    children,
    text,
    size = DEFAULT_SIZE,
    validationState = DEFAULT_VALIDATION_STATE,
    ...htmlDivProps
  }: AlertBannerProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return (
    <div
      ref={ref}
      className={mergeClassNames(alertBannerStyle, sizeStyles[size], validationStateStyles[validationState], className)}
      {...restHtmlDivProps}
    >
      <Icon
        filled
        name={iconName[validationState]}
        size={iconSize[size]}
        colorToken={iconColorToken[validationState]}
      />
      {text ?? children}
    </div>
  );
};

const AlertBanner = forwardRef(Comp);
AlertBanner.displayName = 'AlertBanner';

export { AlertBanner };
