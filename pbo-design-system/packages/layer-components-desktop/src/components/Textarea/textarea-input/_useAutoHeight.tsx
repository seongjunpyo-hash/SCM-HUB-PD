import { TEXTAREA_HEIGHT } from '../constants';

import type { RefObject } from 'react';

type Params = {
  boxRef?: RefObject<HTMLDivElement>;
  enabled: boolean;
};

export const useAutoHeight = ({ boxRef, enabled }: Params) => {
  const adjustHeight = (textarea: HTMLTextAreaElement) => {
    const box = boxRef?.current;

    if (enabled && box) {
      const textareaScrollHeight = textarea.scrollHeight;
      const textareaClientHeight = textarea.clientHeight;

      if (textareaScrollHeight === textareaClientHeight) {
        // 스크롤 X
        box.style.height = `${TEXTAREA_HEIGHT.MIN}px`;
        return;
      }

      // 스크롤 O
      const boxHeight = box.clientHeight;
      const excludeTextareaHeight = boxHeight - textareaClientHeight;

      const calculatedHeight = textareaScrollHeight + excludeTextareaHeight;

      box.style.height = `${Math.min(TEXTAREA_HEIGHT.MAX, calculatedHeight)}px`;
    }
  };

  return { adjustHeight };
};
