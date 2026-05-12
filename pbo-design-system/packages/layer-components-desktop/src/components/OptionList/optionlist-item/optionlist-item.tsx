import { forwardRef } from 'react';

import { tokens } from '@musinsa/layer-tokens/desktop';
import { Icon } from '@musinsa/pbo-assets';
import * as PrimitiveSelect from '@radix-ui/react-select';

import { useRadixSelectFlag } from '../_shared/useRadixSelectFlag';

import { ellipsisStyle, flexStyle, optionListItemStyle, textWrapStyle } from './optionlist-item.css';

import { Checkbox } from '@/components/Checkbox';
import { Typography } from '@/components/Typography';
import { mergeClassNames } from '@/shared/utils/merge-class-names';
import { getIcon } from '@/shared/utils/prefix-suffix-icon';

import type { OptionListItemProps } from './optionlist-item.types';

const DEFAULT_SELECTION_TYPE: OptionListItemProps['selectionType'] = 'default';

const OptionListItem = forwardRef<HTMLDivElement, OptionListItemProps>(
  (
    {
      selectionType = DEFAULT_SELECTION_TYPE,
      value,
      label,
      isSelected,
      thumbnail,
      subTitle,
      description,
      suffixIcon: suffixIconName,
      suffixSubtle,
      ...htmlDivProps
    },
    ref,
  ) => {
    const { className, ...restHtmlDivProps } = htmlDivProps;

    const SuffixIcon = getIcon(suffixIconName);

    const isRadixSelect = useRadixSelectFlag();
    const Comp = isRadixSelect ? PrimitiveSelect.Item : 'div';

    return (
      <Comp ref={ref} value={value} className={mergeClassNames(optionListItemStyle, className)} {...restHtmlDivProps}>
        <div className={flexStyle}>
          {selectionType === 'checkBox' && <Checkbox size="small" checked={isSelected} />}
          {thumbnail && <img width={60} height={72} src={thumbnail} alt={label} />}
          <div className={textWrapStyle}>
            {subTitle && (
              <Typography className={ellipsisStyle} as="span" name="base-text-s" colorToken="fg-low">
                {subTitle}
              </Typography>
            )}
            <Typography className={ellipsisStyle} as="span" name="base-text-l">
              {label}
            </Typography>
            {description && (
              <Typography className={ellipsisStyle} as="span" name="base-text-s" colorToken="fg-low">
                {description}
              </Typography>
            )}
          </div>
        </div>

        {suffixSubtle && (
          <Typography as="span" name="base-text-s" colorToken="fg-lower">
            {suffixSubtle}
          </Typography>
        )}
        {SuffixIcon && <SuffixIcon size={20} color={tokens['fg-lower']} />}
        {selectionType === 'checkMark' && isSelected && <Icon name="ic-check" size={28} colorToken="fg" />}
      </Comp>
    );
  },
);

OptionListItem.displayName = 'OptionListItem';

export { OptionListItem };
