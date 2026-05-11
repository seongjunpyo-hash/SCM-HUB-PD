/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcArrowRightLeft = (
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
        <g clipPath="url(#clip0_4372_5872)">
          <path
            d="M7.16149 11.3767L5.02379 13.5935H16.6664V15.0441H5.02281L7.16149 17.261L6.17125 18.2874L2.83824 14.8326C2.56493 14.5493 2.56504 14.0895 2.83824 13.8061L6.17125 10.3502L7.16149 11.3767ZM17.1615 5.1674C17.2927 5.3034 17.3665 5.48831 17.3666 5.68063C17.3666 5.87307 17.2928 6.05777 17.1615 6.19385L13.8285 9.64974L12.8382 8.6233L14.9759 6.40642H3.33336V4.95584H14.9769L12.8382 2.73897L13.8285 1.71252L17.1615 5.1674Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_4372_5872">
            <rect width="20" height="20" fill={color} />
          </clipPath>
        </defs>
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
      <g clipPath="url(#clip0_4372_4833)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M16.6667 14.1667H3.33337M3.33337 14.1667L6.66671 10.8333M3.33337 14.1667L6.66671 17.5M3.33337 5.83333H16.6667M16.6667 5.83333L13.3334 2.5M16.6667 5.83333L13.3334 9.16667"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4372_4833">
          <rect width="20" height="20" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export const IcArrowRightLeft = forwardRef(_IcArrowRightLeft);
