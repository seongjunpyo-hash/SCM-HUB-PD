/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcHome = (
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
        <g clipPath="url(#clip0_4372_5546)">
          <path
            d="M17 7.79162C17 7.60751 16.9155 7.43358 16.7707 7.31983L10.3707 2.29126C10.1531 2.12032 9.84687 2.12032 9.62931 2.29126L3.22931 7.31983C3.08453 7.43358 3 7.60751 3 7.79162V16.9C3 17.2314 3.26863 17.5 3.6 17.5H8.82143C9.05812 17.5 9.25 17.3081 9.25 17.0714V11.4286C9.25 11.1919 9.44188 11 9.67857 11H10.3214C10.5581 11 10.75 11.1919 10.75 11.4286V17.0714C10.75 17.3081 10.9419 17.5 11.1786 17.5H16.4C16.7314 17.5 17 17.2314 17 16.9V7.79162Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_4372_5546">
            <rect width="20" height="20" fill={color} />
          </clipPath>
        </defs>
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
      <g clipPath="url(#clip0_4372_4484)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M10 17H3.8C3.63431 17 3.5 16.8657 3.5 16.7V7.90234C3.5 7.8066 3.5457 7.71661 3.623 7.66012L9.823 3.12935C9.92842 3.05231 10.0716 3.05231 10.177 3.12935L16.377 7.66012C16.4543 7.71661 16.5 7.8066 16.5 7.90234V16.7C16.5 16.8657 16.3657 17 16.2 17H10ZM10 17V10.3611"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>
      <defs>
        <clipPath id="clip0_4372_4484">
          <rect width="20" height="20" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export const IcHome = forwardRef(_IcHome);
