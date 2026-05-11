import { forwardRef } from 'react';

import { textfieldRootStyle } from './textfield-root.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { TextfieldRootProps } from './textfield-root.types';

const Root = ({ children, ...htmlDivProps }: TextfieldRootProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return (
    <div ref={ref} className={mergeClassNames(textfieldRootStyle, className)} {...restHtmlDivProps}>
      {children}
    </div>
  );
};

const TextfieldRoot = forwardRef(Root);
TextfieldRoot.displayName = 'TextfieldRoot';

export { TextfieldRoot };
