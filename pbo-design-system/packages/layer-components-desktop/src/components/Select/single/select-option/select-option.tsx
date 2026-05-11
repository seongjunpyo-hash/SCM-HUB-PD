import { forwardRef, type KeyboardEvent, type MouseEvent } from 'react';

import { useSelectContext } from '../_context/select-context';

import { OptionList } from '@/components/OptionList';

import type { SelectOptionProps } from './select-option.types';

const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(
  ({ selectionType, value, label, ...htmlDivProps }, ref) => {
    const { onClick, onKeyDown, ...restHtmlDivProps } = htmlDivProps;

    const { value: selectedValue, onValueChange, setOpen } = useSelectContext();
    const isSelected = selectedValue === value;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      onValueChange(value);
      onClick?.(e);
      setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onValueChange(value);
        setOpen(false);
      }
      onKeyDown?.(e);
    };

    return (
      <OptionList.Item
        ref={ref}
        selectionType={selectionType}
        value={value}
        label={label}
        isSelected={isSelected}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...restHtmlDivProps}
      />
    );
  },
);

SelectOption.displayName = 'SelectOption';

export { SelectOption };
