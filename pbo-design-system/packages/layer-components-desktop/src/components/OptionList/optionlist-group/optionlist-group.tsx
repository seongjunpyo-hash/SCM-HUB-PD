import { forwardRef } from 'react';

import { optionListGroupStyle } from './optionlist-group.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { OptionListGroupProps } from './optionlist-group.types';

const OptionListGroup = forwardRef<HTMLDivElement, OptionListGroupProps>(({ children, ...htmlDivProps }, ref) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  return (
    <div ref={ref} className={mergeClassNames(optionListGroupStyle, className)} {...restHtmlDivProps}>
      {children}
    </div>
  );
});

OptionListGroup.displayName = 'OptionListGroup';

export { OptionListGroup };
