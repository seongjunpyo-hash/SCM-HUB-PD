/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcArrowUp = (
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
          d="M9.87305 2.42969C10.0676 2.44386 10.2601 2.5151 10.4219 2.64355L10.5 2.71289L16.4902 8.58105L15.5098 9.58105L10.4932 4.66504V17.2002H9.09277V4.74902L4.50684 9.56348L3.49316 8.59863L9.07617 2.7373L9.15039 2.66699C9.33016 2.51306 9.5536 2.43321 9.77637 2.42773L9.87305 2.42969Z"
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
        d="M16 9.08108L10.0104 3.21291C9.95009 3.1538 9.87124 3.12538 9.79309 3.12729M4 9.08108L9.58326 3.22028C9.64042 3.16028 9.71641 3.12918 9.79309 3.12729M9.79309 3.12729V3M9.79309 3.12729V17.2"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcArrowUp = forwardRef(_IcArrowUp);
