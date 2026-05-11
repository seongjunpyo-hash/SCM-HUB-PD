/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcControl = (
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
          d="M7 10.5C7.55228 10.5 8 10.9477 8 11.5C8 12.0523 7.55228 12.5 7 12.5C6.44772 12.5 6 12.0523 6 11.5C6 10.9477 6.44772 10.5 7 10.5Z"
          fill={color}
        />
        <path
          d="M13 7.5C13.5523 7.5 14 7.94772 14 8.5C14 9.05228 13.5523 9.5 13 9.5C12.4477 9.5 12 9.05228 12 8.5C12 7.94772 12.4477 7.5 13 7.5Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.7002 2.5C17.1419 2.50011 17.4999 2.85813 17.5 3.2998V16.7002C17.4999 17.1419 17.1419 17.4999 16.7002 17.5H3.2998C2.85813 17.4999 2.50011 17.1419 2.5 16.7002V3.2998C2.50011 2.85813 2.85813 2.50011 3.2998 2.5H16.7002ZM6.5 4.5V9.56543C5.63768 9.78765 5 10.5683 5 11.5C5 12.4316 5.6378 13.2113 6.5 13.4336V15.5H7.5V13.4336C8.3622 13.2113 9 12.4316 9 11.5C9 10.5683 8.36232 9.78765 7.5 9.56543V4.5H6.5ZM12.5 4.5V6.56543C11.6377 6.78765 11 7.56829 11 8.5C11 9.43162 11.6378 10.2113 12.5 10.4336V15.5H13.5V10.4336C14.3622 10.2113 15 9.43162 15 8.5C15 7.56829 14.3623 6.78765 13.5 6.56543V4.5H12.5Z"
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
        d="M7 5V10M7 10C6.17157 10 5.5 10.6716 5.5 11.5C5.5 12.3284 6.17157 13 7 13M7 10C7.82843 10 8.5 10.6716 8.5 11.5C8.5 12.3284 7.82843 13 7 13M7 13V15M13 10V15M13 10C13.8284 10 14.5 9.32843 14.5 8.5C14.5 7.67157 13.8284 7 13 7M13 10C12.1716 10 11.5 9.32843 11.5 8.5C11.5 7.67157 12.1716 7 13 7M13 5V7M3.3 17H16.7C16.8657 17 17 16.8657 17 16.7V3.3C17 3.13431 16.8657 3 16.7 3H3.3C3.13431 3 3 3.13431 3 3.3V16.7C3 16.8657 3.13431 17 3.3 17Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcControl = forwardRef(_IcControl);
