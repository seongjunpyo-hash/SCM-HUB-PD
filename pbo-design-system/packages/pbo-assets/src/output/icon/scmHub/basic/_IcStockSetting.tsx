/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcStockSetting = (
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
          d="M17.5 16.6768C17.5 17.1313 17.1313 17.5 16.6768 17.5H3.32324C2.86867 17.5 2.5 17.1313 2.5 16.6768V6.73047H17.5V16.6768Z"
          fill={color}
        />
        <path
          d="M14.1562 2.5C14.37 2.5 14.5741 2.58305 14.7266 2.72949L14.7891 2.7959L17.2334 5.73047H10.5V2.5H14.1562Z"
          fill={color}
        />
        <path
          d="M9.5 5.73047H2.7666L5.21094 2.7959L5.27344 2.72949C5.42587 2.58305 5.63004 2.5 5.84375 2.5H9.5V5.73047Z"
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
        d="M17 6.23077L14.4046 3.11625C14.3432 3.04259 14.2523 3 14.1564 3H10M17 6.23077V16.6769C17 16.8554 16.8554 17 16.6769 17H3.32308C3.14465 17 3 16.8554 3 16.6769V6.23077M17 6.23077H10M3 6.23077L5.59543 3.11625C5.65682 3.04259 5.74775 3 5.84363 3H10M3 6.23077H10M10 3V6.23077"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IcStockSetting = forwardRef(_IcStockSetting);
