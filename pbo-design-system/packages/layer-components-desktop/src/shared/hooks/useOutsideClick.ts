import { useEffect } from 'react';

import type { RefObject } from 'react';

type Params = {
  ref: RefObject<HTMLElement> | null;
  callback: () => void;
};

export const useOutsideClick = ({ ref, callback }: Params) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref?.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, callback]);
};
