/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcUpload = (
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
          d="M17 4.20038V2.79999H3V4.20038H17ZM10.7002 16.5002V8.19061L13.5049 10.9953L14.4951 10.0051L10 5.50995L5.50488 10.0051L6.49512 10.9953L9.2998 8.19061V16.5002H10.7002Z"
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
        d="M3 3.5H17M10 6.5V16.5M10 6.5L14 10.5M10 6.5L6 10.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export const IcUpload = forwardRef(_IcUpload);
