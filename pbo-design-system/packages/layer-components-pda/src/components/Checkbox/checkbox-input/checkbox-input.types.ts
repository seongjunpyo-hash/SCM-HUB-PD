import type * as PrimitiveCheckbox from '@radix-ui/react-checkbox';

type OmitPrimitiveCheckboxProps = Omit<PrimitiveCheckbox.CheckboxProps, 'onCheckedChange'>;

export type CheckboxInputProps = OmitPrimitiveCheckboxProps & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};
