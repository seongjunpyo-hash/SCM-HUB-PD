/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCalculator = (
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
          d="M16.7002 2.2998C17.2523 2.29991 17.7001 2.74767 17.7002 3.2998V16.7002C17.7001 17.2523 17.2523 17.7001 16.7002 17.7002H3.2998C2.74767 17.7001 2.29991 17.2523 2.2998 16.7002V3.2998C2.29991 2.74768 2.74767 2.29991 3.2998 2.2998H16.7002ZM7 12.293L5.85352 11.1465L5.14648 11.8535L6.29297 13L5.14648 14.1465L5.85352 14.8535L7 13.707L8.14648 14.8535L8.85352 14.1465L7.70703 13L8.85352 11.8535L8.14648 11.1465L7 12.293ZM11 13.5V14.5H15V13.5H11ZM11 11.5V12.5H15V11.5H11ZM6.5 5V6.5H5V7.5H6.5V9H7.5V7.5H9V6.5H7.5V5H6.5ZM11 6.5V7.5H15V6.5H11Z"
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
        d="M7 5V7M7 7V9M7 7H5M7 7H9M5.5 11.5L7 13M7 13L8.5 14.5M7 13L5.5 14.5M7 13L8.5 11.5M11 7H15M15 12H11M15 14H11M3.3 17H16.7C16.8657 17 17 16.8657 17 16.7V3.3C17 3.13431 16.8657 3 16.7 3H3.3C3.13431 3 3 3.13431 3 3.3V16.7C3 16.8657 3.13431 17 3.3 17Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcCalculator = forwardRef(_IcCalculator);
