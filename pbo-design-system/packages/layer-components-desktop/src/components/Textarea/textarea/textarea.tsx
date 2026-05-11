import { forwardRef } from 'react';

import { TextareaCount } from '../textarea-addon';
import { TextareaBox } from '../textarea-box';
import { TextareaInput } from '../textarea-input';

import type { TextareaProps } from './textarea.types';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      // textarea box props
      validationState,
      heightMode,

      // textarea input props
      onValueChange,
      ...textareaInputProps
    },
    ref,
  ) => {
    return (
      <TextareaBox validationState={validationState} heightMode={heightMode}>
        <TextareaInput ref={ref} onValueChange={onValueChange} {...textareaInputProps} />
        {textareaInputProps.maxLength && <TextareaCount />}
      </TextareaBox>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
