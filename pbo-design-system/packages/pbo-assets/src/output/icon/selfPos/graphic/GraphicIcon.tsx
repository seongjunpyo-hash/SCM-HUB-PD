import { forwardRef, type ForwardedRef, type SVGProps } from 'react';

import { GraphicIconMap } from './constants';

import type { GraphicIconName } from './types';

interface Props extends SVGProps<SVGSVGElement> {
  name: GraphicIconName;
  size?: number;
}

const _GraphicIcon = ({ name, ...props }: Props, ref: ForwardedRef<SVGSVGElement>) => {
  const Icon = GraphicIconMap[name];

  return <Icon ref={ref} {...props} />;
};

export const GraphicIcon = forwardRef<SVGSVGElement, Props>(_GraphicIcon);
