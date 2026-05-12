/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCloseSquare = (
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
          d="M16.7002 2.2998C17.2523 2.29991 17.7001 2.74767 17.7002 3.2998V16.7002C17.7001 17.2523 17.2523 17.7001 16.7002 17.7002H3.2998C2.74767 17.7001 2.29991 17.2523 2.2998 16.7002V3.2998C2.29991 2.74768 2.74767 2.29991 3.2998 2.2998H16.7002ZM10 9.00977L7.99512 7.00488L7.00488 7.99512L9.00977 10L7.00488 12.0049L7.99512 12.9951L10 10.9902L12.0049 12.9951L12.9951 12.0049L10.9902 10L12.9951 7.99512L12.0049 7.00488L10 9.00977Z"
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
        d="M7.5 7.5L10 10M10 10L12.5 12.5M10 10L7.5 12.5M10 10L12.5 7.5M3.3 17H16.7C16.8657 17 17 16.8657 17 16.7V3.3C17 3.13431 16.8657 3 16.7 3H3.3C3.13431 3 3 3.13431 3 3.3V16.7C3 16.8657 3.13431 17 3.3 17Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export const IcCloseSquare = forwardRef(_IcCloseSquare);
