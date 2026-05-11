/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcArrowUpDown = (
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
        <g clipPath="url(#clip0_4372_5874)">
          <path
            d="M11.3281 12.7384L13.4668 14.8007V3.56882H14.8662V14.8017L17.0049 12.7384L17.9951 13.6938L14.6621 16.9092C14.3888 17.1729 13.9453 17.1728 13.6719 16.9092L10.3379 13.6938L11.3281 12.7384ZM5.33789 3.09116C5.61126 2.82744 6.05476 2.82744 6.32812 3.09116L9.66211 6.30661L8.67188 7.26192L6.5332 5.19962V16.4315H5.13379V5.19868L2.99512 7.26192L2.00488 6.30661L5.33789 3.09116Z"
            fill={color}
          />
          <path
            d="M11.3281 12.7384L13.4668 14.8007V3.56882H14.8662V14.8017L17.0049 12.7384L17.9951 13.6938L14.6621 16.9092C14.3888 17.1729 13.9453 17.1728 13.6719 16.9092L10.3379 13.6938L11.3281 12.7384ZM5.33789 3.09116C5.61126 2.82744 6.05476 2.82744 6.32812 3.09116L9.66211 6.30661L8.67188 7.26192L6.5332 5.19962V16.4315H5.13379V5.19868L2.99512 7.26192L2.00488 6.30661L5.33789 3.09116Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_4372_5874">
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
      <g clipPath="url(#clip0_4372_4835)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M14.1667 3.33334V16.6667M14.1667 16.6667L10.8333 13.3333M14.1667 16.6667L17.5 13.3333M5.83333 16.6667V3.33334M5.83333 3.33334L2.5 6.66668M5.83333 3.33334L9.16667 6.66668"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4372_4835">
          <rect width="20" height="20" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export const IcArrowUpDown = forwardRef(_IcArrowUpDown);
