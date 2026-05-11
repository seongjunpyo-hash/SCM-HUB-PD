import { forwardRef } from 'react';

import { Typography } from '../Typography';

import { cardStyle } from './card.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { CardProps } from './card.types';

const DEFAULT_VALIDATION_STATE: CardProps['validationState'] = 'default';

const Comp = (
  { validationState = DEFAULT_VALIDATION_STATE, label, value, ...props }: CardProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { className, ...restHtmlProps } = props;

  const valueColorToken = (
    {
      default: 'fg',
      critical: 'fg-critical',
      accent: 'pda-fg-accent',
    } as const
  )[validationState];

  return (
    <div ref={ref} className={mergeClassNames(cardStyle, className)} {...restHtmlProps}>
      <Typography name="base-text-s" colorToken="fg-lower">
        {label}
      </Typography>
      <Typography name="base-text-xxl-medium" colorToken={valueColorToken}>
        {value}
      </Typography>
    </div>
  );
};

const Card = forwardRef(Comp);
Card.displayName = 'Card';

export { Card };
