/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcLineChart = (
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
          d="M3.7002 2V16.2998H18V17.7002H3.2998C2.74767 17.7001 2.29991 17.2523 2.2998 16.7002V2H3.7002ZM17.5352 5.45117L12.8252 11.0479C12.4624 11.4789 11.8151 11.5252 11.3945 11.1504L8.8623 8.89355L5.51172 12.4785L4.48828 11.5215L8.10645 7.65234C8.45399 7.28067 9.02043 7.23262 9.42383 7.52539L9.50293 7.58887L12.0186 9.83105L16.4648 4.54883L17.5352 5.45117Z"
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
        d="M5 12L8.61813 8.13061C8.72938 8.01164 8.91525 8.00317 9.03685 8.11155L11.8605 10.628C11.9867 10.7404 12.1808 10.7265 12.2896 10.5972L17 5M3 2V16.7C3 16.8657 3.13431 17 3.3 17H18"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcLineChart = forwardRef(_IcLineChart);
