import { forwardRef } from 'react';

import { stepperRootStyle } from './stepper-root.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { StepperRootProps } from './stepper-root.types';

const Root = ({ children, ...htmlDivProps }: StepperRootProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return (
    <div ref={ref} className={mergeClassNames(stepperRootStyle, className)} {...restHtmlDivProps}>
      {children}
    </div>
  );
};

const StepperRoot = forwardRef(Root);
StepperRoot.displayName = 'StepperRoot';

export { StepperRoot };
