/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcArrowLeft = (
  { size = 24, filled = false, strokeWidth = 1.4, color, ...props }: BasicSvgProps,
  ref: ForwardedRef<SVGSVGElement>,
) => {
  if (filled) {
    return (
      <svg
        ref={ref}
        {...props}
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.58106 4.49023L4.66602 9.50684L17.2002 9.50684V10.9072L4.75001 10.9072L9.56348 15.4932L8.59864 16.5068L2.73731 10.9238C2.33352 10.5392 2.32271 9.89843 2.7129 9.5L8.58106 3.50977L9.58106 4.49023Z"
          fill={color}
        />
      </svg>
    );
  }

  return (
    <svg
      ref={ref}
      {...props}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        vectorEffect="non-scaling-stroke"
        d="M9.08108 4L3.21291 9.98958C3.09581 10.1091 3.09912 10.3013 3.22028 10.4167L9.08108 16M3 10.2069L17.2 10.2069"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcArrowLeft = forwardRef(_IcArrowLeft);
