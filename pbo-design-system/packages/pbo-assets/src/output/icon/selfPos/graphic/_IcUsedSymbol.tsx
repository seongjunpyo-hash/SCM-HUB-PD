import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcUsedSymbol = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6.59998" y="6.6001" width="30.8" height="30.8" rx="2" fill="#F7E74B" />
    <path
      d="M24.226 26.1687C24.226 26.8677 23.6896 27.4357 23.0264 27.4357H20.9736C20.3118 27.4357 19.7739 26.8691 19.7739 26.1687V13.0625H15.8125V26.4563C15.8125 28.9318 17.713 30.9375 20.0557 30.9375H23.9443C26.2883 30.9375 28.1875 28.9304 28.1875 26.4563V13.0625H24.2247V26.1687H24.226Z"
      fill="black"
    />
  </svg>
);

export const IcUsedSymbol = forwardRef(_IcUsedSymbol);
