import type * as PrimitiveCheckbox from '@radix-ui/react-checkbox';

type OmitPrimitiveCheckboxProps = Omit<PrimitiveCheckbox.CheckboxProps, 'onCheckedChange'>;

export type CheckboxInputProps = OmitPrimitiveCheckboxProps & {
  size?: 'small' | 'medium';
  validation?: 'none' | 'error';
  isIndeterminate?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};
