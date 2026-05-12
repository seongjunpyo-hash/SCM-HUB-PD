import { forwardRef, type KeyboardEvent, type MouseEvent } from 'react';

import { useMultipleSelectContext } from '../_context/multiple-select-context';

import { OptionList } from '@/components/OptionList';

import type { SelectOptionProps } from './select-option.types';

const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(({ value, label, ...htmlDivProps }, ref) => {
  const { onClick, onKeyDown, ...restHtmlDivProps } = htmlDivProps;

  const { value: multipleValue, onValueChange } = useMultipleSelectContext();
  const isSelected = multipleValue.includes(value);

  const toggleSelected = () => {
    if (isSelected) {
      onValueChange(multipleValue.filter((v) => v !== value));
    } else {
      onValueChange([...multipleValue, value]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleSelected();
    }
    onKeyDown?.(e);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    toggleSelected();
    onClick?.(e);
  };

  return (
    <OptionList.Item
      ref={ref}
      selectionType="checkBox"
      value={value}
      label={label}
      isSelected={isSelected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...restHtmlDivProps}
    />
  );
});

SelectOption.displayName = 'SelectOption';

export { SelectOption };
