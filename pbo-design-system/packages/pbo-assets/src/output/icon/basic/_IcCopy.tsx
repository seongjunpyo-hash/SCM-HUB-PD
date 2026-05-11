/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCopy = (
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
          d="M4.5 6V16.5H13V17.5H4.2998C3.85813 17.4999 3.50011 17.1419 3.5 16.7002V6H4.5ZM16.5 13.7002C16.4999 14.1419 16.1419 14.4999 15.7002 14.5H7.2998C6.85813 14.4999 6.50011 14.1419 6.5 13.7002V3.2998C6.50011 2.85813 6.85813 2.50011 7.2998 2.5H15.7002C16.1419 2.50011 16.4999 2.85813 16.5 3.2998V13.7002Z"
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
        d="M4 6V16.7C4 16.8657 4.13431 17 4.3 17L13 17M15.7 14H7.3C7.13431 14 7 13.8657 7 13.7V3.3C7 3.13431 7.13431 3 7.3 3H15.7C15.8657 3 16 3.13431 16 3.3V13.7C16 13.8657 15.8657 14 15.7 14Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcCopy = forwardRef(_IcCopy);
