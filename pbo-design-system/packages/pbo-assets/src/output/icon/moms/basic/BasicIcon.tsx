import { forwardRef, type ForwardedRef } from 'react';

import { colorTokenMap, tokens, type ColorToken } from '@musinsa/layer-tokens/desktop';

import { BasicIconMap } from './constants';

import type { SVGProps } from 'react';
import type { BasicIconName } from './types';

interface BaseProps extends SVGProps<SVGSVGElement> {
  name: BasicIconName;
  size?: number;
  color?: string;
  colorToken?: ColorToken;
}

interface FilledProps extends BaseProps {
  filled: true;
  iconStroke?: never;
}

interface StrokeProps extends BaseProps {
  filled?: never;
  iconStroke?: keyof typeof tokens.primitive.iconStroke;
}

type Props = FilledProps | StrokeProps;

const _BasicIcon = (
  { name, size = 24, filled, iconStroke = '150', color: propColor = '#000000', colorToken, ...props }: Props,
  ref: ForwardedRef<SVGSVGElement>,
) => {
  const Icon = BasicIconMap[name];
  const strokeWidth = parseFloat(tokens.primitive.iconStroke[iconStroke]);

  const hasColorToken = colorToken && colorToken in colorTokenMap;
  const color = hasColorToken ? colorTokenMap[colorToken] : propColor;

  return <Icon ref={ref} size={size} filled={filled} strokeWidth={strokeWidth} color={color} {...props} />;
};

export const BasicIcon = forwardRef<SVGSVGElement, Props>(_BasicIcon);
