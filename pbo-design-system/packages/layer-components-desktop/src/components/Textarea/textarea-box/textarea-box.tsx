import { forwardRef, useImperativeHandle, useRef } from 'react';

import { TextareaContextProvider } from '../_context/textarea-context';

import { heightModeStyles, textareaBoxStyle } from './textarea-box.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { TextareaBoxProps } from './textarea-box.types';

const DEFAULT_HEIGHT_MODE: TextareaBoxProps['heightMode'] = 'min';
const DEFAULT_VALIDATION_STATE: TextareaBoxProps['validationState'] = 'none';

const TextareaBox = forwardRef<HTMLDivElement, TextareaBoxProps>(
  (
    { children, validationState = DEFAULT_VALIDATION_STATE, heightMode = DEFAULT_HEIGHT_MODE, ...htmlDivProps },
    ref,
  ) => {
    const { className, ...restHtmlDivProps } = htmlDivProps;

    const boxRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => boxRef.current as HTMLDivElement, []);

    const contextValue = { heightMode, validationState, boxRef };

    return (
      <TextareaContextProvider {...contextValue}>
        <div
          ref={boxRef}
          className={mergeClassNames(textareaBoxStyle, heightModeStyles[heightMode], className)}
          {...restHtmlDivProps}
        >
          {children}
        </div>
      </TextareaContextProvider>
    );
  },
);

TextareaBox.displayName = 'TextareaBox';

export { TextareaBox };
