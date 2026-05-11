/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcDownCircle = (
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 2.2998C14.2526 2.2998 17.7002 5.74741 17.7002 10C17.7002 14.2526 14.2526 17.7002 10 17.7002C5.74741 17.7002 2.2998 14.2526 2.2998 10C2.2998 5.74741 5.74741 2.2998 10 2.2998ZM10 11.0098L7.49512 8.50488L6.50488 9.49512L9.29297 12.2832C9.68344 12.6734 10.3166 12.6734 10.707 12.2832L13.4951 9.49512L12.5049 8.50488L10 11.0098Z"
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
        d="M7 9L9.78787 11.7879C9.90503 11.905 10.095 11.905 10.2121 11.7879L13 9M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcDownCircle = forwardRef(_IcDownCircle);
