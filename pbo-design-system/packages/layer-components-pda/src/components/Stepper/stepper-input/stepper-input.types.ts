import type { TextfieldCountInputProps } from '@/components/Textfield/textfield-countInput';
import type { InputHTMLAttributes } from 'react';

type OmitInputHTMLAttributes = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'placeholder'>;

type PickCountInputProps = Pick<
  TextfieldCountInputProps,
  'validationState' | 'count' | 'totalCount' | 'onCountChange' | 'countTotalSmall' | 'valueAccent'
>;

export type StepperInputProps = OmitInputHTMLAttributes & PickCountInputProps & {};
