import { forwardRef } from 'react';

import { dialogSubTitleStyle } from './dialog-subTitle.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { DialogSubTitleProps } from './dialog-subTitle.types';

const Comp = ({ children, ...htmlDivProps }: DialogSubTitleProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return (
    <div ref={ref} className={mergeClassNames(dialogSubTitleStyle, className)} {...restHtmlDivProps}>
      {children}
    </div>
  );
};

const DialogSubTitle = forwardRef(Comp);
DialogSubTitle.displayName = 'DialogSubTitle';

export { DialogSubTitle };
