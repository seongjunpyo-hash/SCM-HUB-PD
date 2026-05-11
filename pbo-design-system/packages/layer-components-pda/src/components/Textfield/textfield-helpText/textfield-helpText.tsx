import { forwardRef } from 'react';

import { textfieldHelpTextStyle } from './textfield-helpText.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { TextfieldHelpTextProps } from './textfield-helpText.types';

const Comp = ({ children, ...htmlParagraphProps }: TextfieldHelpTextProps, ref: ForwardedRef<HTMLParagraphElement>) => {
  const { className, ...restHtmlParagraphProps } = htmlParagraphProps;

  return (
    <p ref={ref} className={mergeClassNames(textfieldHelpTextStyle, className)} {...restHtmlParagraphProps}>
      {children}
    </p>
  );
};

const TextfieldHelpText = forwardRef(Comp);
TextfieldHelpText.displayName = 'TextfieldHelpText';

export { TextfieldHelpText };
