import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { childWrapStyle, contentsSheetStyle, topNavStyle } from './contents-sheet.css';

import { Typography } from '@/components/Typography';
import { dimStyle } from '@/shared/css/common.css';
import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { BottomSheetProps } from '../bottom-sheet.types';

type Props = Omit<BottomSheetProps, 'type' | 'scrollType'>;

const ContentsSheet = forwardRef<HTMLDivElement, Props>(({ open, onClose, title, children, ...htmlDivProps }, ref) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  if (!open) return null;

  return (
    <div className={dimStyle}>
      <div ref={ref} className={mergeClassNames(contentsSheetStyle, className)} {...restHtmlDivProps}>
        <div className={topNavStyle}>
          <Typography name="base-text-m-medium" colorToken="fg">
            {title}
          </Typography>
          <Icon name="ic-close" size={28} colorToken="fg" onClick={onClose} />
        </div>
        <div className={childWrapStyle}>{children}</div>
      </div>
    </div>
  );
});

ContentsSheet.displayName = 'ContentsSheet';

export { ContentsSheet };
