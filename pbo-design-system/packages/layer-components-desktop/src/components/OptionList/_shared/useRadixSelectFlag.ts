import { useContext } from 'react';

import { PopoverInputContext } from '@/components/PopoverInput/_context/popover-input-context';
import { MultipleSelectContext } from '@/components/Select/multi/_context/multiple-select-context';
import { SelectContext } from '@/components/Select/single/_context/select-context';

/**
 *  radix select 기반인지 (Select.Root 또는 MultiSelect.Root 내부인지 확인)
 */
export const useRadixSelectFlag = (): boolean => {
  const selectContext = useContext(SelectContext);
  const multipleSelectContext = useContext(MultipleSelectContext);

  const popoverInputContext = useContext(PopoverInputContext);

  return selectContext !== null || multipleSelectContext !== null || popoverInputContext !== null;
};
