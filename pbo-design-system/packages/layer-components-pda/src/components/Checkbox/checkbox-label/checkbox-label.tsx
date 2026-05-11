import { forwardRef } from 'react';

import { checkboxLabelStyle } from './checkbox-label.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { CheckboxLabelProps } from './checkbox-label.types';

const Comp = ({ children, label, ...htmlLabelProps }: CheckboxLabelProps, ref: ForwardedRef<HTMLLabelElement>) => {
  const { className, ...restHtmlLabelProps } = htmlLabelProps;

  return (
    <label ref={ref} className={mergeClassNames(checkboxLabelStyle, className)} {...restHtmlLabelProps}>
      {label ?? children}
    </label>
  );
};

const CheckboxLabel = forwardRef(Comp);
CheckboxLabel.displayName = 'CheckboxLabel';

export { CheckboxLabel };
