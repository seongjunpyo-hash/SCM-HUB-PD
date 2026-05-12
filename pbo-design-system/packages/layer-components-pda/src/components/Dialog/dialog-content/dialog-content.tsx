import { forwardRef } from 'react';

import { dialogContentStyle } from './dialog-content.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { DialogContentProps } from './dialog-content.types';

const Comp = ({ children, ...htmlDivProps }: DialogContentProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return (
    <div ref={ref} className={mergeClassNames(dialogContentStyle, className)} {...restHtmlDivProps}>
      {children}
    </div>
  );
};

const DialogContent = forwardRef(Comp);
DialogContent.displayName = 'DialogContent';

export { DialogContent };
