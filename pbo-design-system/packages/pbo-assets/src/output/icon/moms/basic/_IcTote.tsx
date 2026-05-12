/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcTote = (
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
          d="M17.7002 2.7998C18.2523 2.79991 18.7001 3.24767 18.7002 3.7998V6.7002C18.7001 7.21806 18.3062 7.64435 17.8018 7.69531L17.7002 7.7002V16.2002C17.7001 16.7523 17.2523 17.2001 16.7002 17.2002H3.2998C2.74768 17.2001 2.29991 16.7523 2.2998 16.2002V7.7002C1.74768 7.70009 1.29991 7.25233 1.2998 6.7002V3.7998C1.29991 3.24767 1.74767 2.79991 2.2998 2.7998H17.7002ZM7 10.7002H13V9.2998H7V10.7002ZM2.7002 6.2998H17.2998V4.2002H2.7002V6.2998Z"
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
        d="M7 10H13M2.3 7H17.7C17.8657 7 18 6.86569 18 6.7V3.8C18 3.63431 17.8657 3.5 17.7 3.5H2.3C2.13431 3.5 2 3.63431 2 3.8V6.7C2 6.86569 2.13431 7 2.3 7ZM3.3 16.5H16.7C16.8657 16.5 17 16.3657 17 16.2V7.3C17 7.13431 16.8657 7 16.7 7H3.3C3.13431 7 3 7.13431 3 7.3V16.2C3 16.3657 3.13431 16.5 3.3 16.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcTote = forwardRef(_IcTote);
