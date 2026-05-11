/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcStrategy = (
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
        <path d="M18 17.7002H2V16.2998H18V17.7002Z" fill={color} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.7002 5.2998C17.2523 5.29991 17.7001 5.74767 17.7002 6.2998V13.7002C17.7001 14.2523 17.2523 14.7001 16.7002 14.7002H3.2998C2.74768 14.7001 2.29991 14.2523 2.2998 13.7002V6.2998C2.29991 5.74768 2.74767 5.29991 3.2998 5.2998H16.7002ZM5 9V12H7V9H5ZM9 8V12H11V8H9ZM13 10V12H15V10H13Z"
          fill={color}
        />
        <path d="M18 3.7002H2V2.2998H18V3.7002Z" fill={color} />
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
        d="M2 3H18M2 17H18M3.3 14H16.7C16.8657 14 17 13.8657 17 13.7V6.3C17 6.13431 16.8657 6 16.7 6H3.3C3.13431 6 3 6.13431 3 6.3V13.7C3 13.8657 3.13431 14 3.3 14Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path vectorEffect="non-scaling-stroke" d="M5 9H7V12H5V9Z" fill={color} />
      <path vectorEffect="non-scaling-stroke" d="M13 10H15V12H13V10Z" fill={color} />
      <path vectorEffect="non-scaling-stroke" d="M9 8H11V12H9V8Z" fill={color} />
    </svg>
  );
};

export const IcStrategy = forwardRef(_IcStrategy);
