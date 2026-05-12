/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcDownload = (
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
          d="M17 15.7998V17.2002H3V15.7998H17ZM10.7002 3.5V11.8096L13.5049 9.00488L14.4951 9.99512L10 14.4902L5.50488 9.99512L6.49512 9.00488L9.2998 11.8096V3.5H10.7002Z"
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
        d="M3 16.5H17M10 13.5V3.5M10 13.5L14 9.5M10 13.5L6 9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export const IcDownload = forwardRef(_IcDownload);
