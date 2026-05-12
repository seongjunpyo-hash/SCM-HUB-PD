/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSoundOff = (
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
          d="M19.4951 7.9953L17.4902 10.0002L19.4951 12.0051L18.5049 12.9953L16.5 10.9904L14.4951 12.9953L13.5049 12.0051L15.5098 10.0002L13.5049 7.9953L14.4951 7.00507L16.5 9.00995L18.5049 7.00507L19.4951 7.9953ZM12.5752 16.926C12.5751 17.7336 11.6669 18.2075 11.0039 17.7463L5.49414 13.9142H2.7998C2.24761 13.9141 1.7998 13.4665 1.7998 12.9142V7.08612C1.7998 6.5339 2.24761 6.08623 2.7998 6.08612H5.49414L11.0039 2.25311L11.1309 2.17792C11.777 1.85282 12.5752 2.31714 12.5752 3.0744V16.926Z"
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
        d="M14 7.5L16.5 10M16.5 10L19 12.5M16.5 10L14 12.5M16.5 10L19 7.5M11.875 16.9259V3.07415C11.875 2.83184 11.6026 2.6895 11.4037 2.82787L5.79152 6.73199C5.74124 6.76696 5.68145 6.78571 5.6202 6.78571H2.8C2.63431 6.78571 2.5 6.92003 2.5 7.08571V12.9143C2.5 13.08 2.63431 13.2143 2.8 13.2143H5.6202C5.68145 13.2143 5.74124 13.233 5.79152 13.268L11.4037 17.1721C11.6026 17.3105 11.875 17.1682 11.875 16.9259Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export const IcSoundOff = forwardRef(_IcSoundOff);
