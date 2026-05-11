/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcLock = (
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
        <g clipPath="url(#clip0_4372_5560)">
          <path
            d="M12 5.5C12 4.39543 11.1046 3.5 10 3.5C8.89543 3.5 8 4.39543 8 5.5V7H12V5.5ZM13 7H15.7861C16.1803 7.00023 16.4998 7.31971 16.5 7.71387V16.2861C16.4998 16.6803 16.1803 16.9998 15.7861 17H4.21387C3.81971 16.9998 3.50023 16.6803 3.5 16.2861V7.71387C3.50023 7.31971 3.81971 7.00023 4.21387 7H7V5.5C7 3.84315 8.34315 2.5 10 2.5C11.6569 2.5 13 3.84315 13 5.5V7Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_4372_5560">
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
      <g clipPath="url(#clip0_4372_4486)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M7.5 7.5V5.5C7.5 4.11929 8.61929 3 10 3C11.3807 3 12.5 4.11929 12.5 5.5V7.5M16 7.71429V16.2857C16 16.4041 15.9041 16.5 15.7857 16.5H4.21429C4.09594 16.5 4 16.4041 4 16.2857V7.71429C4 7.59594 4.09594 7.5 4.21429 7.5H15.7857C15.9041 7.5 16 7.59594 16 7.71429Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>
      <defs>
        <clipPath id="clip0_4372_4486">
          <rect width="20" height="20" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export const IcLock = forwardRef(_IcLock);
