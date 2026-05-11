import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { useTextareaContext } from '../_context/textarea-context';

import { useAutoHeight } from './_useAutoHeight';
import { textareaInputStyle } from './textarea-input.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ChangeEvent } from 'react';
import type { TextareaInputProps } from './textarea-input.types';

const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ onValueChange, ...htmlTextareaProps }, ref) => {
    const { heightMode, validationState, setInputState, boxRef } = useTextareaContext() ?? {};

    const { className, onChange, value, maxLength, ...restHtmlTextareaProps } = htmlTextareaProps;

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement, []);

    const { adjustHeight } = useAutoHeight({ boxRef, enabled: heightMode === 'auto' });

    const _onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);

      if (heightMode === 'auto') {
        adjustHeight(e.target);
      }
    };

    useEffect(() => {
      if (textareaRef.current && heightMode === 'auto') {
        adjustHeight(textareaRef.current);
      }
    }, [heightMode, adjustHeight]);

    useEffect(() => {
      setInputState?.({
        value,
        maxLength,
      });
    }, [value, maxLength, setInputState]);

    const isError = validationState === 'error';

    return (
      <textarea
        ref={textareaRef}
        aria-invalid={isError ? 'true' : undefined}
        className={mergeClassNames(textareaInputStyle, className)}
        onChange={_onChange}
        maxLength={maxLength}
        value={value}
        {...restHtmlTextareaProps}
      />
    );
  },
);

TextareaInput.displayName = 'TextareaInput';

export { TextareaInput };
