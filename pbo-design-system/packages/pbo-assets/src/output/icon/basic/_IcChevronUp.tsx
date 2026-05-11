/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcChevronUp = (
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
          d="M9.36914 6.64408C9.73565 6.34532 10.2644 6.34532 10.6309 6.64408L10.707 6.71244L16.4951 12.5005L15.5049 13.4908L10 7.98588L4.49512 13.4908L3.50488 12.5005L9.29297 6.71244L9.36914 6.64408Z"
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
        d="M4 13L9.78787 7.21213C9.90503 7.09497 10.095 7.09497 10.2121 7.21213L16 13"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcChevronUp = forwardRef(_IcChevronUp);
