import type * as PrimitiveRadioGroup from '@radix-ui/react-radio-group';

type OmitPrimitiveRadioGroupProps = Omit<PrimitiveRadioGroup.RadioGroupProps, 'value' | 'onValueChange'>;

export type RadioRootProps<T extends string> = OmitPrimitiveRadioGroupProps & {
  value: T;
  onValueChange: (value: T) => void;
};
