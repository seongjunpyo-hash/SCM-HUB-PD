import { forwardRef } from 'react';

import { radioLabelStyle } from './radio-label.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { RadioLabelProps } from './radio-label.types';

const Comp = ({ children, label, ...htmlLabelProps }: RadioLabelProps, ref: ForwardedRef<HTMLLabelElement>) => {
  const { className, ...restHtmlLabelProps } = htmlLabelProps;

  return (
    <label ref={ref} className={mergeClassNames(radioLabelStyle, className)} {...restHtmlLabelProps}>
      {label ?? children}
    </label>
  );
};

const RadioLabel = forwardRef(Comp);
RadioLabel.displayName = 'RadioLabel';

export { RadioLabel };
