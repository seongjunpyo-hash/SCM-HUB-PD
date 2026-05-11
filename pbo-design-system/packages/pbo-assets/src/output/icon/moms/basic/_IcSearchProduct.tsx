/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSearchProduct = (
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
          d="M8.7002 8.74414L9.5 7.94336L10.2998 8.74414V6.34375H12.7002V12.3438H6.2998V6.34375H8.7002V8.74414Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.5 2.2998C13.4764 2.2998 16.7002 5.52355 16.7002 9.5C16.7002 11.236 16.0847 12.8279 15.0615 14.0713L18.4951 17.5049L17.5049 18.4951L14.0713 15.0615C12.8279 16.0847 11.236 16.7002 9.5 16.7002C5.52355 16.7002 2.2998 13.4764 2.2998 9.5C2.2998 5.52355 5.52355 2.2998 9.5 2.2998ZM9.5 3.7002C6.29675 3.7002 3.7002 6.29675 3.7002 9.5C3.7002 12.7033 6.29675 15.2998 9.5 15.2998C12.7033 15.2998 15.2998 12.7033 15.2998 9.5C15.2998 6.29675 12.7033 3.7002 9.5 3.7002Z"
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
        d="M12.7 12.3438H6.3V6.34375H8.7V8.74375L9.5 7.94375L10.3 8.74375V6.34375H12.7V12.3438Z"
        fill={color}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M14 14L18 18M16 9.5C16 13.0899 13.0899 16 9.5 16C5.91015 16 3 13.0899 3 9.5C3 5.91015 5.91015 3 9.5 3C13.0899 3 16 5.91015 16 9.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcSearchProduct = forwardRef(_IcSearchProduct);
