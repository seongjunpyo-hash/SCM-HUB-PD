/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcChevronDown = (
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
          d="M16.4951 7.49023L10.707 13.2783C10.341 13.6442 9.76183 13.6668 9.36914 13.3467L9.29297 13.2783L3.50488 7.49023L4.49512 6.5L10 12.0049L15.5049 6.5L16.4951 7.49023Z"
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
        d="M4 7L9.78787 12.7879C9.90503 12.905 10.095 12.905 10.2121 12.7879L16 7"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcChevronDown = forwardRef(_IcChevronDown);
