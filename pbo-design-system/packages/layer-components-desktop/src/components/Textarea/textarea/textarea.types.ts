import type { TextareaBoxProps } from '../textarea-box';
import type { TextareaInputProps } from '../textarea-input';

type BoxProps = Pick<TextareaBoxProps, 'validationState' | 'heightMode'>;

type InputProps = TextareaInputProps;

export type TextareaProps = BoxProps & InputProps;
