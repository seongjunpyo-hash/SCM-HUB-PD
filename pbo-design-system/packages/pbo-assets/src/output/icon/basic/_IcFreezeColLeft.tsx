/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcFreezeColLeft = (
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
        <path d="M17.5 11.75H12V8.25H17.5V11.75Z" fill={color} />
        <path
          d="M12 16.7002C12.0001 17.1419 12.3581 17.4999 12.7998 17.5H16.7002C17.1419 17.4999 17.4999 17.1419 17.5 16.7002V12.75H12V16.7002Z"
          fill={color}
        />
        <path
          d="M12.7998 2.5C12.3581 2.50011 12.0001 2.85813 12 3.2998V7.25H17.5V3.2998C17.4999 2.85813 17.1419 2.50011 16.7002 2.5H12.7998Z"
          fill={color}
        />
        <path
          d="M3.5 2.5V17.5H2.5V2.5H3.5ZM7.4375 7.5L7.8252 7.81641L6.4502 9.5H10.5V10.5H6.4502L7.8252 12.1836L7.4375 12.5L7.05078 12.8164L5.19043 10.5381C5.06073 10.3793 5 10.1858 5 10C5 9.81415 5.06073 9.62075 5.19043 9.46191L7.05078 7.18359L7.4375 7.5Z"
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
        d="M17 12.25V16.7C17 16.8657 16.8657 17 16.7 17H12.8C12.6343 17 12.5 16.8657 12.5 16.7V12.25M17 12.25H12.5M17 12.25V7.75M12.5 12.25V7.75M17 7.75V3.3C17 3.13431 16.8657 3 16.7 3H12.8C12.6343 3 12.5 3.13431 12.5 3.3V7.75M17 7.75H12.5M3 2.5V17.5M7.43793 7.5L5.57735 9.77855C5.52578 9.84169 5.5 9.92085 5.5 10M7.43793 12.5L5.57735 10.2215C5.52578 10.1583 5.5 10.0792 5.5 10M5.5 10H10.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IcFreezeColLeft = forwardRef(_IcFreezeColLeft);
