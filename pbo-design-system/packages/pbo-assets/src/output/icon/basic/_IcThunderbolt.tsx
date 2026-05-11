/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcThunderbolt = (
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
          d="M14.459 2.2998C15.097 2.2998 15.4783 3.01029 15.126 3.54199L12.5976 7.35059H15.2119C15.9284 7.35059 16.284 8.22001 15.7724 8.72168L6.8867 17.4355C6.29853 18.0122 5.32774 17.4304 5.55857 16.6396L7.2031 11.0049H4.67869C4.05395 11.0049 3.6703 10.3202 3.99607 9.78711L8.33787 2.68262L8.39744 2.59766C8.54811 2.41087 8.77684 2.2998 9.02049 2.2998H14.459Z"
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
        d="M14.5423 3.1553L11.3966 7.89485C11.3525 7.96132 11.4002 8.05015 11.4799 8.05015H15.2122C15.3018 8.05015 15.3462 8.15884 15.2823 8.22155L6.39653 16.9356C6.32301 17.0077 6.20166 16.935 6.23052 16.8362L8.09982 10.4327C8.11851 10.3687 8.07051 10.3047 8.00383 10.3047H4.67831C4.60021 10.3047 4.55226 10.2192 4.59298 10.1525L8.93473 3.04786C8.9529 3.01813 8.98522 3 9.02006 3H14.459C14.5388 3 14.5864 3.08883 14.5423 3.1553Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcThunderbolt = forwardRef(_IcThunderbolt);
