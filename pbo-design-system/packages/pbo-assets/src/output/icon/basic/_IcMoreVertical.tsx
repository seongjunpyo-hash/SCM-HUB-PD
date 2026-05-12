/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcMoreVertical = (
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
          d="M10 9C10.5523 9 11 9.44772 11 10C11 10.5523 10.5523 11 10 11C9.44772 11 9 10.5523 9 10C9 9.44772 9.44772 9 10 9Z"
          fill={color}
        />
        <path
          d="M10 4C10.5523 4 11 4.44771 11 5C11 5.55229 10.5523 6 10 6C9.44772 6 9 5.55229 9 5C9 4.44771 9.44772 4 10 4Z"
          fill={color}
        />
        <path
          d="M10 14C10.5523 14 11 14.4477 11 15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15C9 14.4477 9.44772 14 10 14Z"
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
        d="M10 9C10.5523 9 11 9.44772 11 10C11 10.5523 10.5523 11 10 11C9.44772 11 9 10.5523 9 10C9 9.44772 9.44772 9 10 9Z"
        fill={color}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M10 4C10.5523 4 11 4.44771 11 5C11 5.55229 10.5523 6 10 6C9.44772 6 9 5.55229 9 5C9 4.44771 9.44772 4 10 4Z"
        fill={color}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M10 14C10.5523 14 11 14.4477 11 15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15C9 14.4477 9.44772 14 10 14Z"
        fill={color}
      />
    </svg>
  );
};

export const IcMoreVertical = forwardRef(_IcMoreVertical);
