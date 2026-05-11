/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcZoomIn = (
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 3.2998C12.148 3.2998 14.7002 5.85198 14.7002 9C14.7002 10.3215 14.2479 11.5362 13.4932 12.5029L17.4951 16.5049L16.5049 17.4951L12.5029 13.4932C11.5362 14.2479 10.3215 14.7002 9 14.7002C5.85198 14.7002 3.2998 12.148 3.2998 9C3.2998 5.85198 5.85198 3.2998 9 3.2998ZM8.50488 6.00488V8.5H6V9.5H8.50488V12.0049H9.50488V9.5H12V8.5H9.50488V6.00488H8.50488Z"
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
        d="M12.5 12.5L17 17M6 9H12M9.005 6.005L9.005 12.005M14 9C14 11.7614 11.7614 14 9 14C6.23858 14 4 11.7614 4 9C4 6.23858 6.23858 4 9 4C11.7614 4 14 6.23858 14 9Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcZoomIn = forwardRef(_IcZoomIn);
