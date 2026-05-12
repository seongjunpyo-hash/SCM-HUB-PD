/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcOutbound = (
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.79 2.2998C15.1578 2.29987 15.4911 2.50146 15.665 2.81641L15.7295 2.95801L17.6582 8.26074L17.7002 8.37695V16.7002C17.7001 17.2523 17.2523 17.7001 16.7002 17.7002H3.2998C2.74768 17.7001 2.29991 17.2523 2.2998 16.7002V8.37695L2.3418 8.26074L4.27051 2.95801L4.33496 2.81641C4.50887 2.50146 4.84215 2.29987 5.20996 2.2998H14.79ZM7.0332 12.2188L7.9668 13.2617L9.2998 12.0664V15.5H10.7002V12.0664L12.0332 13.2617L12.9668 12.2188L10 9.56055L7.0332 12.2188ZM4 7.7998H16L14.5098 3.7002H5.49023L4 7.7998Z"
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
        d="M17 8.5L15.0718 3.19748C15.0287 3.07892 14.916 3 14.7899 3H5.21013C5.08398 3 4.9713 3.07892 4.92819 3.19748L3 8.5M17 8.5V16.7C17 16.8657 16.8657 17 16.7 17H3.3C3.13431 17 3 16.8657 3 16.7V8.5M17 8.5H3M10 10.5L10 15.5M10 10.5L12.5 12.74M10 10.5L7.5 12.74"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export const IcOutbound = forwardRef(_IcOutbound);
