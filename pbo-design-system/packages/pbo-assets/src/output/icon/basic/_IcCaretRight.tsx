/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCaretRight = (
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
          d="M6.7998 4.72421C6.8001 3.88949 7.74648 3.4447 8.38379 3.91073L8.50684 4.01718L13.7832 9.29257C14.1734 9.68297 14.1732 10.3161 13.7832 10.7066L8.50684 15.982C7.87687 16.612 6.7998 16.1659 6.7998 15.275V4.72421Z"
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
        d="M13.2879 10.2121L8.01213 15.4879C7.82314 15.6769 7.5 15.543 7.5 15.2757L7.5 4.72426C7.5 4.45699 7.82314 4.32314 8.01213 4.51213L13.2879 9.78787C13.405 9.90503 13.405 10.095 13.2879 10.2121Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcCaretRight = forwardRef(_IcCaretRight);
