/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcDashboard = (
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
          d="M9.2998 17.7002H3.2998C2.74767 17.7001 2.29991 17.2523 2.2998 16.7002V3.2998C2.29991 2.74768 2.74767 2.29991 3.2998 2.2998H9.2998V17.7002Z"
          fill={color}
        />
        <path
          d="M17.7002 16.7002C17.7001 17.2523 17.2523 17.7001 16.7002 17.7002H10.7002V10.7002H17.7002V16.7002Z"
          fill={color}
        />
        <path
          d="M16.7002 2.2998C17.2523 2.29991 17.7001 2.74767 17.7002 3.2998V9.2998H10.7002V2.2998H16.7002Z"
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
        d="M10 10V3M10 10H17M10 10V17M3.3 17H16.7C16.8657 17 17 16.8657 17 16.7V3.3C17 3.13431 16.8657 3 16.7 3H3.3C3.13431 3 3 3.13431 3 3.3V16.7C3 16.8657 3.13431 17 3.3 17Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcDashboard = forwardRef(_IcDashboard);
