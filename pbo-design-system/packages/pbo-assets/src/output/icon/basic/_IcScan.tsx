/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcScan = (
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
          d="M4.2002 13V15.2998H6.5V16.7002H3.7998C3.24767 16.7001 2.79991 16.2523 2.7998 15.7002V13H4.2002ZM17 9.2998V10.7002H3V9.2998H17ZM6.5 3.2998V4.7002H4.2002V7H2.7998V4.2998C2.79991 3.74768 3.24767 3.29991 3.7998 3.2998H6.5ZM17.2002 15.7002C17.2001 16.2523 16.7523 16.7001 16.2002 16.7002H13.5V15.2998H15.7998V13H17.2002V15.7002ZM17.2002 7H15.7998V4.7002H13.5V3.2998H16.2002C16.7523 3.29991 17.2001 3.74768 17.2002 4.2998V7Z"
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
        d="M6.5 16H3.8C3.63431 16 3.5 15.8657 3.5 15.7V13M13.5 16H16.2C16.3657 16 16.5 15.8657 16.5 15.7V13M6.5 4L3.8 4C3.63431 4 3.5 4.13431 3.5 4.3V7M13.5 4L16.2 4C16.3657 4 16.5 4.13431 16.5 4.3V7M3 10H17"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcScan = forwardRef(_IcScan);
