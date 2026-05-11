import type * as PrimitiveSelect from '@radix-ui/react-select';
import type { ReactNode } from 'react';

type OmitPrimitiveSelectProps = Omit<PrimitiveSelect.SelectTriggerProps, 'asChild' | 'disabled'>;

export type PopoverInputTriggerProps = OmitPrimitiveSelectProps & {
  size?: 'medium' | 'small';
  validation?: 'none' | 'error';
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  floatingBlockLabel?: string;
  required?: boolean;
  displayValue?: ReactNode;
  onClear?: () => void;
};
