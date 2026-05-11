import { forwardRef } from 'react';

import * as PrimitiveSelect from '@radix-ui/react-select';

import { useRadixSelectFlag } from '../_shared/useRadixSelectFlag';

import { optionListStyle } from './optionslist.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { OptionListProps } from './optionlist.types';

const OptionList = forwardRef<HTMLDivElement, OptionListProps>(
  ({ children, width, maxHeight, ...htmlDivProps }, ref) => {
    const { className, style, ...restHtmlDivProps } = htmlDivProps;

    const isRadixSelect = useRadixSelectFlag();

    const Comp = isRadixSelect ? PrimitiveSelect.Viewport : 'div';

    return (
      <Comp
        ref={ref}
        className={mergeClassNames(optionListStyle, className)}
        style={{ width, maxHeight, ...style }}
        {...restHtmlDivProps}
      >
        {children}
      </Comp>
    );
  },
);

OptionList.displayName = 'OptionList';

export { OptionList };
