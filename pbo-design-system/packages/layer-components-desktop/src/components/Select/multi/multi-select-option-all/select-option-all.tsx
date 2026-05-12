import { forwardRef, type KeyboardEvent, type MouseEvent } from 'react';

import { useMultipleSelectContext } from '../_context/multiple-select-context';

import { OptionList } from '@/components/OptionList';

import type { SelectOptionAllProps } from './select-option-all.types';

const SelectOptionAll = forwardRef<HTMLDivElement, SelectOptionAllProps>(({ label, ...htmlDivProps }, ref) => {
  const { onClick, onKeyDown, ...restHtmlDivProps } = htmlDivProps;

  const { value: multipleValue, onValueChange, options } = useMultipleSelectContext();
  const isSelected = options.every((option) => multipleValue.includes(option.value));

  const toggleSelected = () => {
    if (isSelected) {
      onValueChange([]);
    } else {
      onValueChange(options.map((option) => option.value));
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
      value="all"
      selectionType="checkBox"
      label={label}
      isSelected={isSelected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...restHtmlDivProps}
    />
  );
});

SelectOptionAll.displayName = 'SelectOptionAll';

export { SelectOptionAll };
