import { forwardRef } from 'react';

import { optionListGroupTitleStyle } from './optionlist-group-title.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { OptionListGroupTitleProps } from './optionlist-group-title.types';

const OptionListGroupTitle = forwardRef<HTMLSpanElement, OptionListGroupTitleProps>(
  ({ title, children, ...htmlSpanProps }, ref) => {
    const { className, ...restHtmlSpanProps } = htmlSpanProps;

    return (
      <span ref={ref} className={mergeClassNames(optionListGroupTitleStyle, className)} {...restHtmlSpanProps}>
        {title ?? children}
      </span>
    );
  },
);

OptionListGroupTitle.displayName = 'OptionListGroupTitle';

export { OptionListGroupTitle };
