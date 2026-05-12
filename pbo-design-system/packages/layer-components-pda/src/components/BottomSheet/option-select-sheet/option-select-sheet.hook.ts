import { useEffect, useRef, useState } from 'react';

import type { BottomSheetProps } from '../bottom-sheet.types';

type Params = {
  open: boolean;
  scrollType: BottomSheetProps['scrollType'];
};

export const useOptionSelectMaxHeight = ({ open, scrollType }: Params) => {
  const [maxHeight, setMaxHeight] = useState('68%');
  const listBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // fixed인 경우에는 해당 로직 제외 (68% 고정)
    if (scrollType === 'fixed') {
      return;
    }

    if (!open) {
      setMaxHeight('68%');
      return;
    }

    if (maxHeight === '100%') return;

    const element = listBoxRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollTop = element.scrollTop;
      if (scrollTop > 10) {
        setMaxHeight('100%');
      }
    };

    element.addEventListener('scroll', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [open, maxHeight, scrollType]);

  return {
    maxHeight,
    listBoxRef,
  };
};
