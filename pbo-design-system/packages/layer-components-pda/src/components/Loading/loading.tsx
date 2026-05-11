import { forwardRef } from 'react';

import { loadingStyle, sizeStyles } from './loading.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { LoadingProps } from './loading.types';

const DEFAULT_SIZE: LoadingProps['size'] = 'medium';

const Comp = ({ size = DEFAULT_SIZE, ...htmlDivProps }: LoadingProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return <div ref={ref} className={mergeClassNames(loadingStyle, sizeStyles[size], className)} {...restHtmlDivProps} />;
};

const Loading = forwardRef(Comp);
Loading.displayName = 'Loading';

export { Loading };
