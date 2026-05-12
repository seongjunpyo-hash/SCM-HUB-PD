import { forwardRef } from 'react';

import { TextfieldContextProvider } from '../_context/textfield-context';

import { textfieldBoxStyle } from './textfield-box.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { TextfieldBoxProps } from './textfield-box.types';

const DEFAULT_VALIDATION_STATE: TextfieldBoxProps['validationState'] = 'none';

const TextfieldBox = forwardRef<HTMLDivElement, TextfieldBoxProps>(
  ({ children, validationState = DEFAULT_VALIDATION_STATE, ...htmlDivProps }, ref) => {
    const { className, ...restHtmlDivProps } = htmlDivProps;

    return (
      <TextfieldContextProvider validationState={validationState}>
        <div ref={ref} className={mergeClassNames(textfieldBoxStyle, className)} {...restHtmlDivProps}>
          {children}
        </div>
      </TextfieldContextProvider>
    );
  },
);

TextfieldBox.displayName = 'Textfield.Box';

export { TextfieldBox };
