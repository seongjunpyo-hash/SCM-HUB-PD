/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcMail = (
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
          d="M17.7002 15.2002C17.7001 15.7523 17.2523 16.2001 16.7002 16.2002H3.2998C2.74767 16.2001 2.29991 15.7523 2.2998 15.2002V4.81738L9.43652 10.6201L9.44434 10.626C9.77058 10.8822 10.2294 10.8821 10.5557 10.626L10.5645 10.6201L17.7002 4.81738V15.2002Z"
          fill={color}
        />
        <path
          d="M16.7002 3.7998C16.8022 3.79982 16.9005 3.81536 16.9932 3.84375L10 9.53027L3.00586 3.84375C3.0988 3.81518 3.19752 3.79982 3.2998 3.7998H16.7002Z"
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
        d="M3 4.5L9.81474 9.85437C9.92352 9.93984 10.0766 9.93984 10.1854 9.85437L17 4.5M3.3 15.5H16.7C16.8657 15.5 17 15.3657 17 15.2V4.8C17 4.63431 16.8657 4.5 16.7 4.5H3.3C3.13431 4.5 3 4.63431 3 4.8V15.2C3 15.3657 3.13431 15.5 3.3 15.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export const IcMail = forwardRef(_IcMail);
