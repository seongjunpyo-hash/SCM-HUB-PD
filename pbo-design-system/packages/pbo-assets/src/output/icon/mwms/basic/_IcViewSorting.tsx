/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcViewSorting = (
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
        <path d="M9.65625 17.1562H2.34375V10.8438H9.65625V17.1562Z" fill={color} />
        <path d="M17.5 16.1562H11.5V14.8438H17.5V16.1562Z" fill={color} />
        <path d="M17.5 10.6562H11.5V9.34375H17.5V10.6562Z" fill={color} />
        <path d="M9.65625 9.15625H2.34375V2.84375H9.65625V9.15625Z" fill={color} />
        <path d="M17.5 5.15625H11.5V3.84375H17.5V5.15625Z" fill={color} />
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
        d="M11.5 4.5H17.5M11.5 10H17.5M11.5 15.5H17.5M3 3.5L9 3.5V8.5H3V3.5ZM3 11.5H9V16.5H3V11.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcViewSorting = forwardRef(_IcViewSorting);
