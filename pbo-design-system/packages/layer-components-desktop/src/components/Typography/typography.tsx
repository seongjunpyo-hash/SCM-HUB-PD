/* eslint-disable react/prop-types */
import { forwardRef } from 'react';

import { colorTokenStyles, nameStyles } from './typography.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { TypographyComponent } from './typography.types';

const DEFAULT_NAME = 'base-text-m';
const DEFAULT_COLOR_TOKEN = 'fg';

export const Typography = forwardRef(
  ({ as, name = DEFAULT_NAME, color: propColor, colorToken: propColorToken, children, ...htmlProps }, ref) => {
    const { style, className, ...restHtmlProps } = htmlProps;

    const Component = as || 'p';

    const hasPropColor = propColor !== undefined;

    const color = hasPropColor ? propColor : undefined;
    const colorToken = hasPropColor ? undefined : propColorToken || DEFAULT_COLOR_TOKEN;

    return (
      <Component
        ref={ref}
        className={mergeClassNames(nameStyles[name], colorToken && colorTokenStyles[colorToken], className)}
        style={{ color, ...style }}
        {...restHtmlProps}
      >
        {children}
      </Component>
    );
  },
) as TypographyComponent;

Typography.displayName = 'Typography';
