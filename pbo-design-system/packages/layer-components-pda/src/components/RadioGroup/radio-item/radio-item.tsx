import { forwardRef } from 'react';

import * as PrimitiveRadioGroup from '@radix-ui/react-radio-group';

import { indicatorStyle, itemStyle } from './radio-item.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { RadioInputProps } from './radio-item.types';

const RadioItem = forwardRef<HTMLButtonElement, RadioInputProps>(({ value, ...htmlInputProps }, ref) => {
  const { className, ...restHtmlInputProps } = htmlInputProps;

  return (
    <PrimitiveRadioGroup.Item
      ref={ref}
      value={value}
      className={mergeClassNames(itemStyle, className)}
      {...restHtmlInputProps}
    >
      <PrimitiveRadioGroup.Indicator className={mergeClassNames(indicatorStyle)} />
    </PrimitiveRadioGroup.Item>
  );
});

RadioItem.displayName = 'RadioItem';

export { RadioItem };
