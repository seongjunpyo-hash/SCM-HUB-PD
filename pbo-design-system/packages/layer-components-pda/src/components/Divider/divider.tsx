import { forwardRef } from 'react';

import { dividerStyles } from './divider.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { DividerProps } from './divider.types';

const DEFAULT_TYPE: DividerProps['type'] = 'default';

const Comp = ({ type = DEFAULT_TYPE, ...htmlDivProps }: DividerProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return <div ref={ref} className={mergeClassNames(dividerStyles({ type }), className)} {...restHtmlDivProps} />;
};

const Divider = forwardRef(Comp);
Divider.displayName = 'Divider';

export { Divider };
