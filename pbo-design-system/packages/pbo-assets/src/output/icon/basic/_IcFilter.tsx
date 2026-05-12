/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcFilter = (
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
          d="M10.7002 13L10.7002 14.2998H17V15.7002H10.7002V17H9.2998L9.2998 13L10.7002 13ZM7 14.2998V15.7002H3L3 14.2998H7ZM7.7002 8V12H6.2998V10.7002H3V9.2998H6.2998L6.2998 8H7.7002ZM17 9.2998V10.7002L9.5 10.7002V9.2998L17 9.2998ZM13.7002 3V4.2998H17V5.7002H13.7002V7H12.2998V3H13.7002ZM10.5 4.2998V5.7002L3 5.7002L3 4.2998L10.5 4.2998Z"
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
        d="M3 10H7M9.5 10L17 10M3 5L10.5 5M13 5H17M13 3V7M7 8L7 12M3 15H7M9.5 15L17 15M10 13L10 17"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcFilter = forwardRef(_IcFilter);
