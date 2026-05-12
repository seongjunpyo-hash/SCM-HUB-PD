/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcDesktop = (
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
          d="M18.7002 12.7002C18.7001 13.2523 18.2523 13.7001 17.7002 13.7002H10.7002V16.2998H14V17.7002H6V16.2998H9.2998V13.7002H2.2998C1.74768 13.7001 1.29991 13.2523 1.2998 12.7002V4.2998C1.29991 3.74768 1.74767 3.29991 2.2998 3.2998H17.7002C18.2523 3.29991 18.7001 3.74767 18.7002 4.2998V12.7002Z"
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
        d="M10 13V17M14 17H6M2.3 13H17.7C17.8657 13 18 12.8657 18 12.7V4.3C18 4.13431 17.8657 4 17.7 4H2.3C2.13431 4 2 4.13431 2 4.3V12.7C2 12.8657 2.13431 13 2.3 13Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcDesktop = forwardRef(_IcDesktop);
