import { forwardRef } from 'react';

import { useDialogContext } from '../_context/dialog-context';

import { dialogTitleStyle, typeStyles } from './dialog-title.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { DialogTitleProps } from './dialog-title.types';

const Comp = ({ children, ...htmlDivProps }: DialogTitleProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  const { type } = useDialogContext();

  return (
    <div ref={ref} className={mergeClassNames(dialogTitleStyle, typeStyles[type], className)} {...restHtmlDivProps}>
      {children}
    </div>
  );
};

const DialogTitle = forwardRef(Comp);
DialogTitle.displayName = 'DialogTitle';

export { DialogTitle };
