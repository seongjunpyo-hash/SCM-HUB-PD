/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcStop = (
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
          d="M15.0332 15.8232C13.6832 16.9912 11.9251 17.7002 10 17.7002C5.74741 17.7002 2.2998 14.2526 2.2998 10C2.2998 8.07482 3.00783 6.31587 4.17578 4.96582L15.0332 15.8232Z"
          fill={color}
        />
        <path
          d="M10 2.2998C14.2526 2.2998 17.7002 5.74741 17.7002 10C17.7002 11.823 17.0648 13.4965 16.0059 14.8154L5.18359 3.99316C6.50256 2.93421 8.17698 2.2998 10 2.2998Z"
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
        d="M5.2002 5L15.2002 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcStop = forwardRef(_IcStop);
