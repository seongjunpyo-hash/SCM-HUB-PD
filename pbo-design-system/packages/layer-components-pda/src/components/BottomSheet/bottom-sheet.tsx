import { forwardRef } from 'react';
import { createPortal } from 'react-dom';

import { ContentsSheet } from './contents-sheet';
import { OptionSelectSheet } from './option-select-sheet';

import type { BottomSheetProps } from './bottom-sheet.types';

const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(({ type, ...props }, ref) => {
  switch (type) {
    case 'optionSelect':
      return createPortal(<OptionSelectSheet {...props} ref={ref} />, document.body);
    case 'contents':
      return createPortal(<ContentsSheet {...props} ref={ref} />, document.body);
    default:
      return null;
  }
});

BottomSheet.displayName = 'BottomSheet';

export { BottomSheet };
