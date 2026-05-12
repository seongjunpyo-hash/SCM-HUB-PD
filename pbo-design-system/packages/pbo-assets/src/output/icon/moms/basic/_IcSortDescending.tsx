/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSortDescending = (
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
          d="M14.7002 4.5V13.8887L17.0225 11.7217L17.9775 12.7451L14 16.457L10.0225 12.7451L10.9775 11.7217L13.2998 13.8887V4.5H14.7002ZM6 14.2998V15.7002H2V14.2998H6ZM9 9.2998V10.7002H2V9.2998H9ZM12 4.2998V5.7002H2V4.2998H12Z"
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
        d="M14 15.4999L14 4.5M14 15.4999L10.5 12.2333M14 15.4999L17.5 12.2333M2 14.9999H6M2 9.99995H9M2 4.99995H12"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcSortDescending = forwardRef(_IcSortDescending);
