/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcPrinter = (
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
          d="M13.7002 2.2998C14.2523 2.29991 14.7001 2.74767 14.7002 3.2998V5.2998H16.7002C17.2523 5.29991 17.7001 5.74767 17.7002 6.2998V13.7002C17.7001 14.2523 17.2523 14.7001 16.7002 14.7002H14.7002V16.7002C14.7001 17.2523 14.2523 17.7001 13.7002 17.7002H6.2998C5.74768 17.7001 5.29991 17.2523 5.2998 16.7002V14.7002H3.2998C2.74767 14.7001 2.29991 14.2523 2.2998 13.7002V6.2998C2.29991 5.74768 2.74767 5.29991 3.2998 5.2998H5.2998V3.2998C5.29991 2.74767 5.74768 2.29991 6.2998 2.2998H13.7002ZM6.7002 16.2998H13.2998V10.7002H6.7002V16.2998ZM13.5 7.09961V8.5H15.5V7.09961H13.5ZM6.7002 5.2998H13.2998V3.7002H6.7002V5.2998Z"
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
        d="M14 14H16.7C16.8657 14 17 13.8657 17 13.7V6.3C17 6.13431 16.8657 6 16.7 6H3.3C3.13431 6 3 6.13431 3 6.3V13.7C3 13.8657 3.13431 14 3.3 14H6M13.5 8H15.5M6.3 6H13.7C13.8657 6 14 5.86569 14 5.7V3.3C14 3.13431 13.8657 3 13.7 3H6.3C6.13431 3 6 3.13431 6 3.3V5.7C6 5.86569 6.13431 6 6.3 6ZM6.3 17H13.7C13.8657 17 14 16.8657 14 16.7V10.3C14 10.1343 13.8657 10 13.7 10H6.3C6.13431 10 6 10.1343 6 10.3V16.7C6 16.8657 6.13431 17 6.3 17Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcPrinter = forwardRef(_IcPrinter);
