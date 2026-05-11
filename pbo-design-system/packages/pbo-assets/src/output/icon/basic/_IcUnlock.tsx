/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcUnlock = (
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
          d="M16.3398 16.2861C16.3396 16.6803 16.0201 16.9998 15.626 17H4.05371C3.65955 16.9998 3.34007 16.6803 3.33984 16.2861V7.71387C3.34007 7.31971 3.65955 7.00023 4.05371 7H6.83984V5.5C6.83984 3.84315 8.18299 2.5 9.83984 2.5C11.4967 2.5 12.8398 3.84315 12.8398 5.5H11.8398C11.8398 4.39543 10.9444 3.5 9.83984 3.5C8.73527 3.5 7.83984 4.39543 7.83984 5.5V7H15.626C16.0201 7.00023 16.3396 7.31971 16.3398 7.71387V16.2861Z"
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
        d="M12.3398 5.5C12.3398 4.11929 11.2206 3 9.83984 3C8.45913 3 7.33984 4.11929 7.33984 5.5V7.5M15.8398 7.71429V16.2857C15.8398 16.4041 15.7439 16.5 15.6256 16.5H4.05413C3.93578 16.5 3.83984 16.4041 3.83984 16.2857V7.71429C3.83984 7.59594 3.93578 7.5 4.05413 7.5H15.6256C15.7439 7.5 15.8398 7.59594 15.8398 7.71429Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcUnlock = forwardRef(_IcUnlock);
