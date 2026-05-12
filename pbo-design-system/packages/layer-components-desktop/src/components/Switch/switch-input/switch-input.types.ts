import type * as PrimitiveSwitch from '@radix-ui/react-switch';

export type SwitchInputProps = PrimitiveSwitch.SwitchProps & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};
