/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCalendarMinus = (
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
          d="M17.5 16.2002C17.4999 16.6419 17.1419 16.9999 16.7002 17H3.2998C2.85813 16.9999 2.50011 16.6419 2.5 16.2002V8H17.5V16.2002ZM7 12V13H13V12H7Z"
          fill={color}
        />
        <path
          d="M16.7002 3C17.1419 3.00011 17.4999 3.35813 17.5 3.7998V7H2.5V3.7998C2.50011 3.35813 2.85813 3.00011 3.2998 3H16.7002Z"
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
        d="M3 7.5H17M7 12H13M3.3 16.5H16.7C16.8657 16.5 17 16.3657 17 16.2V3.8C17 3.63431 16.8657 3.5 16.7 3.5H3.3C3.13431 3.5 3 3.63431 3 3.8V16.2C3 16.3657 3.13431 16.5 3.3 16.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcCalendarMinus = forwardRef(_IcCalendarMinus);
