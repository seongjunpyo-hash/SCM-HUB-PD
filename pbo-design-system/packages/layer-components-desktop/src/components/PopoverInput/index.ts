import { PopoverContent, type PopoverContentProps } from './popover-content';
import { PopoverInputTrigger, type PopoverInputTriggerProps } from './popover-input-trigger';
import { PopoverRoot } from './popover-root';
import { PopoverTrigger } from './popover-trigger';

const PopoverInputNamespace = {
  Root: PopoverRoot,
  Trigger: PopoverInputTrigger,
  Content: PopoverContent,
};

const PopoverNamespace = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
};

export { usePopoverInputContext } from './_context/popover-input-context';

export { PopoverNamespace as Popover, PopoverInputNamespace as PopoverInput };

export type { PopoverContentProps, PopoverInputTriggerProps };
