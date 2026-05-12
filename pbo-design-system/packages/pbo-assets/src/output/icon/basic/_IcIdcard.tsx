/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcIdcard = (
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
          d="M7 8C7.30798 8 7.55758 8.24965 7.55762 8.55762C7.55762 8.86562 7.30801 9.11523 7 9.11523C6.692 9.11523 6.44238 8.86562 6.44238 8.55762C6.44242 8.24965 6.69202 8 7 8Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.7002 4.5C18.1419 4.50011 18.4999 4.85813 18.5 5.2998V14.7002C18.4999 15.1419 18.1419 15.4999 17.7002 15.5H2.2998C1.85813 15.4999 1.50011 15.1419 1.5 14.7002V5.2998C1.50011 4.85813 1.85813 4.50011 2.2998 4.5H17.7002ZM5.6543 10.5801C4.74105 10.5801 4.00024 11.3202 4 12.2334V13H5V12.2334C5.00024 11.8725 5.29334 11.5801 5.6543 11.5801H8.3457C8.70666 11.5801 8.99976 11.8725 9 12.2334V13H10V12.2334C9.99976 11.3202 9.25895 10.5801 8.3457 10.5801H5.6543ZM11.5 11V12H16V11H11.5ZM7 7C6.13974 7 5.44242 7.69736 5.44238 8.55762C5.44238 9.41791 6.13971 10.1152 7 10.1152C7.86029 10.1152 8.55762 9.41791 8.55762 8.55762C8.55758 7.69736 7.86026 7 7 7ZM11.5 8V9H14.5V8H11.5Z"
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
        d="M4.5 13V12.2338C4.5 11.5966 5.01659 11.08 5.65385 11.08H8.34615C8.98341 11.08 9.5 11.5966 9.5 12.2338V13M11.5 11.5H16M11.5 8.5H14.5M8.05769 8.55769C8.05769 9.14184 7.58415 9.61538 7 9.61538C6.41585 9.61538 5.94231 9.14184 5.94231 8.55769C5.94231 7.97354 6.41585 7.5 7 7.5C7.58415 7.5 8.05769 7.97354 8.05769 8.55769ZM2.3 15H17.7C17.8657 15 18 14.8657 18 14.7V5.3C18 5.13431 17.8657 5 17.7 5H2.3C2.13431 5 2 5.13431 2 5.3V14.7C2 14.8657 2.13431 15 2.3 15Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcIdcard = forwardRef(_IcIdcard);
