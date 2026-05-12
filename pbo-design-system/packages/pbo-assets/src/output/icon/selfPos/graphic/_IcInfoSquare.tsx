import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcInfoSquare = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" fill="#EBEBEB" />
    <path d="M21 9.99992H18.3334V14.9765H21V9.99992Z" fill="black" />
    <path d="M21 17.4661H18.3334V29.9114H21V17.4661Z" fill="black" />
  </svg>
);

export const IcInfoSquare = forwardRef(_IcInfoSquare);
