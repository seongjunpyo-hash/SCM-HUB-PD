import { forwardRef, type ForwardedRef } from 'react';

import { buttonGroupStyle, stretchModeStyles } from './button-group.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ButtonGroupProps } from './button-group.types';

const DEFAULT_STRETCH_MODE: ButtonGroupProps['stretchMode'] = 'both';

const Comp = (
  { stretchMode = DEFAULT_STRETCH_MODE, children, ...htmlDivProps }: ButtonGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return (
    <div
      ref={ref}
      className={mergeClassNames(buttonGroupStyle, stretchModeStyles[stretchMode], className)}
      {...restHtmlDivProps}
    >
      {children}
    </div>
  );
};

const ButtonGroup = forwardRef(Comp);
ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
