import { forwardRef } from 'react';

import { stateTypeStyles, tagStyle } from './tag.css';

import { mergeClassNames } from '@/shared/utils/merge-class-names';
import { getIcon } from '@/shared/utils/prefix-suffix-icon';

import type { ForwardedRef } from 'react';
import type { TagProps } from './tag.types';

const DEFAULT_STATE_TYPE: TagProps['stateType'] = 'default';
const ICON_SIZE = 16;

const Comp = (
  {
    stateType = DEFAULT_STATE_TYPE,
    prefixIcon: prefixIconName,
    suffixIcon: suffixIconName,
    label,
    children,
    ...htmlProps
  }: TagProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { className, ...restHtmlProps } = htmlProps;

  const PrefixIcon = getIcon(prefixIconName);
  const SuffixIcon = getIcon(suffixIconName);

  return (
    <div ref={ref} className={mergeClassNames(tagStyle, stateTypeStyles[stateType], className)} {...restHtmlProps}>
      {PrefixIcon && <PrefixIcon size={ICON_SIZE} color="currentColor" />}
      {label ?? children}
      {SuffixIcon && <SuffixIcon size={ICON_SIZE} color="currentColor" />}
    </div>
  );
};

const Tag = forwardRef(Comp);
Tag.displayName = 'Tag';

export { Tag };
