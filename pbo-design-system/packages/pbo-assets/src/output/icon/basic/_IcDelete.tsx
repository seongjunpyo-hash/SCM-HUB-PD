/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcDelete = (
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
          d="M13.7002 2.2998C14.2523 2.29991 14.7001 2.74767 14.7002 3.2998V5.2998H17V6.7002H16.1689L15.7119 16.7451C15.6876 17.2792 15.2475 17.7002 14.7129 17.7002H5.28711C4.75248 17.7002 4.31236 17.2792 4.28809 16.7451L3.83105 6.7002H3V5.2998H5.2998V3.2998C5.29991 2.74767 5.74768 2.29991 6.2998 2.2998H13.7002ZM7.2998 9V14H8.7002V9H7.2998ZM11.2998 9V14H12.7002V9H11.2998ZM6.7002 5.2998H13.2998V3.7002H6.7002V5.2998Z"
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
        d="M3 6H17M8 9V14M12 9V14M6.3 6H13.7C13.8657 6 14 5.86569 14 5.7V3.3C14 3.13431 13.8657 3 13.7 3H6.3C6.13431 3 6 3.13431 6 3.3V5.7C6 5.86569 6.13431 6 6.3 6ZM5.28667 17H14.7133C14.8737 17 15.0057 16.8738 15.013 16.7136L15.4857 6.31362C15.4935 6.14277 15.3571 6 15.1861 6H4.81395C4.64291 6 4.50649 6.14277 4.51426 6.31362L4.98698 16.7136C4.99427 16.8738 5.12628 17 5.28667 17Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcDelete = forwardRef(_IcDelete);
