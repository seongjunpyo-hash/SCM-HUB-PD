import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { childWrapStyle, optionSelectSheetStyle, topNavStyle } from './option-select-sheet.css';
import { useOptionSelectMaxHeight } from './option-select-sheet.hook';

import { Typography } from '@/components/Typography';
import { dimStyle } from '@/shared/css/common.css';
import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { BottomSheetProps } from '../bottom-sheet.types';

type Props = Omit<BottomSheetProps, 'type'>;

const DEFAULT_SCROLL_TYPE: BottomSheetProps['scrollType'] = 'expanded';

const OptionSelectSheet = forwardRef<HTMLDivElement, Props>(
  ({ open, onClose, title, children, scrollType = DEFAULT_SCROLL_TYPE, ...htmlDivProps }, ref) => {
    const { className, style, ...restHtmlDivProps } = htmlDivProps;

    const { maxHeight, listBoxRef } = useOptionSelectMaxHeight({ open, scrollType });

    if (!open) return null;

    return (
      <div className={dimStyle}>
        <div
          ref={ref}
          className={mergeClassNames(optionSelectSheetStyle, className)}
          style={{ maxHeight, ...style }}
          {...restHtmlDivProps}
        >
          <div className={topNavStyle}>
            <Typography name="base-text-m-medium" colorToken="fg">
              {title}
            </Typography>
            <Icon name="ic-close" size={28} colorToken="fg" onClick={onClose} />
          </div>
          <div ref={listBoxRef} role="listbox" className={childWrapStyle}>
            {children}
          </div>
        </div>
      </div>
    );
  },
);

OptionSelectSheet.displayName = 'OptionSelectSheet';

export { OptionSelectSheet };
