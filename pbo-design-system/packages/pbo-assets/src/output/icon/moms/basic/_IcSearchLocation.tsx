/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSearchLocation = (
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
        <path d="M10.0352 9.99023H8.8252L9.40918 8.24902H9.44531L10.0352 9.99023Z" fill={color} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.7002 6C12.8657 6.00011 12.9999 6.13427 13 6.2998V12.7002C12.9999 12.8657 12.8657 12.9999 12.7002 13H6.2998C6.13427 12.9999 6.00011 12.8657 6 12.7002V6.2998C6.00011 6.13427 6.13427 6.00011 6.2998 6H12.7002ZM7.43066 11.6836H8.25879L8.61621 10.6162H10.2441L10.6016 11.6836H11.4307L9.9043 7.36719H8.9502L7.43066 11.6836Z"
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
        d="M9.44531 8.24902L10.0352 9.99023H8.8252L9.40918 8.24902H9.44531Z"
        fill={color}
      />
      <path
        vectorEffect="non-scaling-stroke"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7002 6C12.8657 6.00011 12.9999 6.13427 13 6.2998V12.7002C12.9999 12.8657 12.8657 12.9999 12.7002 13H6.2998C6.13427 12.9999 6.00011 12.8657 6 12.7002V6.2998C6.00011 6.13427 6.13427 6.00011 6.2998 6H12.7002ZM8.9502 7.36719L7.43066 11.6836H8.25879L8.61621 10.6162H10.2441L10.6016 11.6836H11.4307L9.9043 7.36719H8.9502Z"
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

export const IcSearchLocation = forwardRef(_IcSearchLocation);
