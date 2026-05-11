import { forwardRef } from 'react';

import { stepperHelpTextStyle } from './stepper-helpText.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { StepperHelpTextProps } from './stepper-helpText.types';

const Comp = ({ children, ...htmlParagraphProps }: StepperHelpTextProps, ref: ForwardedRef<HTMLParagraphElement>) => {
  const { className, ...restHtmlParagraphProps } = htmlParagraphProps;

  return (
    <p ref={ref} className={mergeClassNames(stepperHelpTextStyle, className)} {...restHtmlParagraphProps}>
      {children}
    </p>
  );
};

const StepperHelpText = forwardRef(Comp);
StepperHelpText.displayName = 'StepperHelpText';

export { StepperHelpText };
