import { forwardRef } from 'react';

import { dialogActionStyle } from './dialog-action.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { DialogActionProps } from './dialog-action.types';

const Comp = ({ children, ...htmlDivProps }: DialogActionProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return (
    <div ref={ref} className={mergeClassNames(dialogActionStyle, className)} {...restHtmlDivProps}>
      {children}
    </div>
  );
};

const DialogAction = forwardRef(Comp);
DialogAction.displayName = 'DialogAction';

export { DialogAction };
