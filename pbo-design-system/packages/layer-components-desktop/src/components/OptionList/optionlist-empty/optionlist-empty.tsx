import { forwardRef } from 'react';

import { emptyStyle } from './optionlist-empty.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { OptionListEmptyProps } from './optionlist-empty.types';

const OptionListEmpty = forwardRef<HTMLDivElement, OptionListEmptyProps>(
  ({ label = '결과 없음', ...htmlDivProps }, ref) => {
    const { className, ...restHtmlDivProps } = htmlDivProps;

    return (
      <div ref={ref} className={mergeClassNames(emptyStyle, className)} {...restHtmlDivProps}>
        {label}
      </div>
    );
  },
);

OptionListEmpty.displayName = 'OptionListEmpty';

export { OptionListEmpty };
