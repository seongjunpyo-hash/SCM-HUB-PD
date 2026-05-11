/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcChevronLeft = (
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
          d="M12.9951 4.49512L7.48926 9.99902L12.9951 15.5049L12.0049 16.4951L6.07617 10.5654C5.76376 10.253 5.76375 9.74699 6.07617 9.43457L12.0049 3.50488L12.9951 4.49512Z"
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
        d="M12.5 16L6.71213 10.212C6.59497 10.0948 6.59498 9.90486 6.71213 9.7877L12.5 4"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcChevronLeft = forwardRef(_IcChevronLeft);
