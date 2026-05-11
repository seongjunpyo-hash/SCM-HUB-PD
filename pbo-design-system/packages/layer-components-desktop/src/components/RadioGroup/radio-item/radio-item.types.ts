import type * as PrimitiveRadioGroup from '@radix-ui/react-radio-group';

export type RadioInputProps = PrimitiveRadioGroup.RadioGroupItemProps & {
  size?: 'small' | 'medium';
  validation?: 'none' | 'error';
  value: string;
};
