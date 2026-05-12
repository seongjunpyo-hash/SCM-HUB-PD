import { useEffect } from 'react';

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

/**
 *  모바일 대응을 확인하기 위해 라이브러리 사용
 */
export const useScrollLock = ({ enabled = true }: { enabled: boolean }) => {
  useEffect(() => {
    const body = document.querySelector('body');

    const disableScroll = () => {
      if (!body) return;
      disableBodyScroll(body);
    };
    const enableScroll = () => {
      if (!body) return;
      enableBodyScroll(body);
    };

    if (enabled) {
      disableScroll();
    } else {
      enableScroll();
    }

    return () => enableScroll();
  }, [enabled]);
};
