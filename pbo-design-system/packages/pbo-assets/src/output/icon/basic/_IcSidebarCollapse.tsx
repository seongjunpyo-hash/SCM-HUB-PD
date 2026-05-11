/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSidebarCollapse = (
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
          d="M8.7002 15.2998H16.2998V4.7002H8.7002V15.2998ZM17.7002 15.7002C17.7001 16.2523 17.2523 16.7001 16.7002 16.7002H3.2998C2.74768 16.7001 2.29991 16.2523 2.2998 15.7002V4.2998C2.29991 3.74768 2.74767 3.29991 3.2998 3.2998H16.7002C17.2523 3.29991 17.7001 3.74767 17.7002 4.2998V15.7002Z"
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
        d="M8 4H3.3C3.13431 4 3 4.13431 3 4.3V15.7C3 15.8657 3.13431 16 3.3 16H8M8 4H16.7C16.8657 4 17 4.13431 17 4.3V15.7C17 15.8657 16.8657 16 16.7 16H8M8 4V16"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcSidebarCollapse = forwardRef(_IcSidebarCollapse);
