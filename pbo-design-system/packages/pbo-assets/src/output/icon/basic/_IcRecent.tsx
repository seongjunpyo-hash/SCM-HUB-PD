/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcRecent = (
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
        <g clipPath="url(#clip0_4372_5882)">
          <path
            d="M3.91431 10.0004C3.91453 13.3593 6.64127 16.0854 10.0002 16.0854C13.359 16.0851 16.085 13.3592 16.0852 10.0004C16.0852 6.64142 13.3592 3.91469 10.0002 3.91446C8.14937 3.91446 6.48948 4.74167 5.37329 6.04825H7.17212V7.44864H4.36255C3.81031 7.44864 3.36263 7.00085 3.36255 6.44864V3.49747H4.76196V4.65176C6.11198 3.32923 7.96235 2.51407 10.0002 2.51407C14.1324 2.51429 17.4856 5.86822 17.4856 10.0004C17.4854 14.1324 14.1322 17.4855 10.0002 17.4857C5.86807 17.4857 2.51414 14.1325 2.51392 10.0004H3.91431ZM10.6995 6.32462V9.62442L12.9329 11.1137L12.1565 12.2787L9.74536 10.6713C9.46716 10.4858 9.30005 10.1736 9.30005 9.83926V6.32462H10.6995Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_4372_5882">
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
      <g clipPath="url(#clip0_4372_4843)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M4.02843 6.77541C5.17386 4.65284 7.42129 3.21426 9.99986 3.21426C13.7456 3.21426 16.7856 6.25426 16.7856 9.99998C16.7856 13.7457 13.7456 16.7857 9.99986 16.7857C6.25414 16.7857 3.21414 13.7457 3.21414 9.99998M9.99986 6.32438V9.83942C9.99986 9.93973 10.05 10.0334 10.1334 10.089L12.5445 11.6964M7.17248 6.74849H4.36236C4.19667 6.74849 4.06236 6.61418 4.06236 6.44849V3.497"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
        />
      </g>
      <defs>
        <clipPath id="clip0_4372_4843">
          <rect width="20" height="20" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export const IcRecent = forwardRef(_IcRecent);
