/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCaretDown = (
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
          d="M15.2754 7.2998C16.1663 7.29981 16.6124 8.37687 15.9824 9.00684L10.707 14.2832C10.3166 14.6734 9.68343 14.6734 9.29296 14.2832L4.01757 9.00684C3.38761 8.37687 3.8337 7.2998 4.7246 7.2998H15.2754Z"
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
        d="M9.78787 13.7879L4.51213 8.51213C4.32314 8.32314 4.45699 8 4.72426 8L15.2757 8C15.543 8 15.6769 8.32314 15.4879 8.51213L10.2121 13.7879C10.095 13.905 9.90503 13.905 9.78787 13.7879Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcCaretDown = forwardRef(_IcCaretDown);
