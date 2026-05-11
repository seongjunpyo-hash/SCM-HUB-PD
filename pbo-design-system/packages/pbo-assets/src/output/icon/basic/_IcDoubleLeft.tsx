/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcDoubleLeft = (
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
          d="M10.9946 4.49512L5.48967 9.99902L10.9946 15.5049L10.0053 16.4951L4.07561 10.5654C3.7634 10.2531 3.76351 9.74697 4.07561 9.43457L10.0053 3.50488L10.9946 4.49512ZM15.9946 4.49512L10.4897 9.99902L15.9946 15.5049L15.0053 16.4951L9.07561 10.5654C8.7634 10.2531 8.76351 9.74697 9.07561 9.43457L15.0053 3.50488L15.9946 4.49512Z"
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
        d="M10.5 16L4.57071 10.0705C4.53166 10.0315 4.53166 9.96818 4.57071 9.92912L10.5 4M15.5 16L9.57071 10.0705C9.53166 10.0315 9.53166 9.96818 9.57071 9.92912L15.5 4"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcDoubleLeft = forwardRef(_IcDoubleLeft);
