import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { Typography } from '../Typography';

import { accordionStyle, leftStyle } from './accordion.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type React from 'react';
import type { ForwardedRef } from 'react';
import type { AccordionProps } from './accordion.types';

const Comp = ({ open, label, count, disabled, ...htmlDivProps }: AccordionProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, onClick, ...restHtmlDivProps } = htmlDivProps;

  const labelColorToken = disabled ? 'fg-disabled' : 'fg';
  const countColorToken = disabled ? 'fg-disabled' : 'pda-fg-accent';
  const iconColorToken = disabled ? 'fg-disabled' : 'fg';

  const _onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={ref}
      className={mergeClassNames(accordionStyle, className)}
      aria-disabled={disabled}
      onClick={_onClick}
      {...restHtmlDivProps}
    >
      <div className={leftStyle}>
        <Typography name="base-text-l-medium" colorToken={labelColorToken}>
          {label}
        </Typography>
        {count && (
          <Typography name="base-text-l-medium" colorToken={countColorToken}>
            {count}
          </Typography>
        )}
      </div>
      <Icon name={open ? 'ic-minus' : 'ic-plus'} size={28} colorToken={iconColorToken} />
    </div>
  );
};

const Accordion = forwardRef(Comp);
Accordion.displayName = 'Accordion';

export { Accordion };
