/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcDoubleUp = (
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
          d="M15.5256 10.9743L10.0217 5.46938L4.51581 10.9743L3.52557 9.985L9.45526 4.05532C9.7676 3.7431 10.2737 3.74321 10.5861 4.05532L16.5158 9.985L15.5256 10.9743ZM15.5256 15.9743L10.0217 10.4694L4.51581 15.9743L3.52557 14.985L9.45526 9.05532C9.7676 8.7431 10.2737 8.74321 10.5861 9.05532L16.5158 14.985L15.5256 15.9743Z"
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
        d="M4.02069 10.4797L9.95015 4.55041C9.9892 4.51135 10.0525 4.51136 10.0916 4.55041L16.0207 10.4797M4.02069 15.4797L9.95015 9.55041C9.9892 9.51135 10.0525 9.51136 10.0916 9.55041L16.0207 15.4797"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcDoubleUp = forwardRef(_IcDoubleUp);
