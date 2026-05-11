/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcExit = (
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
        <g clipPath="url(#clip0_3016_3538)">
          <path
            d="M17.8984 10.0088C18.0639 10.1802 18.1419 10.4032 18.1367 10.6201C18.1316 10.8332 18.0462 11.0493 17.8779 11.2119L15.7109 13.3057L14.7383 12.2988L15.7686 11.3037H10.5V9.90332H15.8496L14.7217 8.73535L15.7285 7.7627L17.8984 10.0088ZM15.8662 5.91699H14.4668V3.7002H5.7002V17.2998H14.4668V15.083H15.8662V17.583C15.8662 18.1997 15.3667 18.7002 14.75 18.7002H5.41699C4.80028 18.7002 4.2998 18.1997 4.2998 17.583V3.41699C4.2998 2.80027 4.80027 2.2998 5.41699 2.2998H14.75C15.3667 2.29981 15.8662 2.80027 15.8662 3.41699V5.91699Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_3016_3538">
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
      <g clipPath="url(#clip0_3016_3519)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M15.1667 5.91667V3.41667C15.1667 3.18655 14.9801 3 14.75 3H5.41667C5.18655 3 5 3.18655 5 3.41667V17.5833C5 17.8135 5.18655 18 5.41667 18H14.75C14.9801 18 15.1667 17.8135 15.1667 17.5833V15.0833M17.4373 10.6033C17.4382 10.5643 17.4242 10.5248 17.395 10.4947L15.2255 8.24859M17.4373 10.6033C17.4363 10.6417 17.421 10.6797 17.3914 10.7083L15.2246 12.802M17.4373 10.6033H17.5M17.4373 10.6033L10.5 10.6033"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>
      <defs>
        <clipPath id="clip0_3016_3519">
          <rect width="20" height="20" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export const IcExit = forwardRef(_IcExit);
