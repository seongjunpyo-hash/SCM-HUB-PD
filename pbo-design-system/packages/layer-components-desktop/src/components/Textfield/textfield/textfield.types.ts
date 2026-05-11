import type { TextfieldBoxProps } from '../textfield-box';
import type { TextfieldInputProps } from '../textfield-input';

type BoxProps = Pick<TextfieldBoxProps, 'validationState'>;

type InputProps = TextfieldInputProps;

export type TextfieldProps = BoxProps & InputProps;
