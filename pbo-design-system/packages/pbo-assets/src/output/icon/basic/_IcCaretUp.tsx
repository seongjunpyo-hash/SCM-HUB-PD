/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCaretUp = (
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
          d="M9.36913 5.648C9.73557 5.34947 10.2644 5.34947 10.6309 5.648L10.707 5.71636L15.9824 10.9927C16.6124 11.6227 16.1663 12.6998 15.2754 12.6998H4.7246C3.8337 12.6998 3.38761 11.6227 4.01757 10.9927L9.29296 5.71636L9.36913 5.648Z"
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
        d="M9.78787 6.21213L4.51213 11.4879C4.32314 11.6769 4.45699 12 4.72426 12L15.2757 12C15.543 12 15.6769 11.6769 15.4879 11.4879L10.2121 6.21213C10.095 6.09497 9.90503 6.09497 9.78787 6.21213Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcCaretUp = forwardRef(_IcCaretUp);
