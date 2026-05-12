/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcEyeClosed = (
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
          d="M17.6514 7.25684C17.3798 7.94643 16.9502 8.68784 16.3867 9.39648L17.9951 11.0049L17.0049 11.9951L15.4375 10.4277C14.7089 11.1113 13.8424 11.7079 12.8604 12.1182L13.6641 14.5283L12.3359 14.9717L11.5244 12.5371C11.0369 12.641 10.5284 12.7002 10 12.7002C9.47126 12.7002 8.96239 12.6411 8.47461 12.5371L7.66406 14.9717L6.33594 14.5283L7.13867 12.1182C6.15678 11.7078 5.29003 11.1113 4.56152 10.4277L2.99512 11.9951L2.00488 11.0049L3.6123 9.39648C3.04901 8.68798 2.62014 7.94627 2.34863 7.25684L3.65137 6.74316C4.45683 8.78879 6.87434 11.2998 10 11.2998C13.1257 11.2998 15.5432 8.78879 16.3486 6.74316L17.6514 7.25684Z"
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
        d="M17 7C16.125 9.22222 13.5 12 10 12C6.5 12 3.875 9.22222 3 7M12 11.75L13 14.75M15.25 9.25L17.5 11.5M8 11.75L7 14.75M4.75 9.25L2.5 11.5"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcEyeClosed = forwardRef(_IcEyeClosed);
