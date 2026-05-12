/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcReset = (
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
          d="M3.2998 11C3.2998 7.3014 6.3014 4.2998 10 4.2998L12.8096 4.2998L11.0049 2.49512L11.9951 1.50488L14.7832 4.29297C15.1734 4.68344 15.1734 5.31656 14.7832 5.70703L11.9951 8.49512L11.0049 7.50488L12.8096 5.7002H10C7.0746 5.7002 4.7002 8.0746 4.7002 11C4.7002 13.9254 7.0746 16.2998 10 16.2998C12.9254 16.2998 15.2998 13.9254 15.2998 11V9.5H16.7002V11C16.7002 14.6986 13.6986 17.7002 10 17.7002C6.3014 17.7002 3.2998 14.6986 3.2998 11Z"
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
        d="M11.5 2L14.2879 4.78787C14.405 4.90503 14.405 5.09497 14.2879 5.21213L11.5 8M14.002 5L10 5C6.688 5 4 7.688 4 11C4 14.312 6.688 17 10 17C13.312 17 16 14.312 16 11V9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export const IcReset = forwardRef(_IcReset);
