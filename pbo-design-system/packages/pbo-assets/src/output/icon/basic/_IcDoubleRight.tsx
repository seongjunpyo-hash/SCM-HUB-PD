/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcDoubleRight = (
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
          d="M10.7832 9.29297C11.1734 9.68344 11.1734 10.3166 10.7832 10.707L4.99512 16.4951L4.00488 15.5049L9.50977 10L4.00488 4.49512L4.99512 3.50488L10.7832 9.29297ZM15.7832 9.29297C16.1734 9.68344 16.1734 10.3166 15.7832 10.707L9.99512 16.4951L9.00488 15.5049L14.5098 10L9.00488 4.49512L9.99512 3.50488L15.7832 9.29297Z"
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
        d="M9.5 16L15.2879 10.2121C15.405 10.095 15.405 9.90503 15.2879 9.78787L9.5 4M4.5 16L10.2879 10.2121C10.405 10.095 10.405 9.90503 10.2879 9.78787L4.5 4"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcDoubleRight = forwardRef(_IcDoubleRight);
