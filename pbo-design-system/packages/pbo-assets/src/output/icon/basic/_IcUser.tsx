/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcUser = (
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
          d="M17 16.2002C16.9999 16.6419 16.6419 16.9999 16.2002 17H3.7998C3.35813 16.9999 3.00011 16.6419 3 16.2002V14.5C3 12.567 4.567 11 6.5 11H13.5C15.433 11 17 12.567 17 14.5V16.2002ZM13.25 6.25C13.25 8.04493 11.7949 9.5 10 9.5C8.20507 9.5 6.75 8.04493 6.75 6.25C6.75 4.45507 8.20507 3 10 3C11.7949 3 13.25 4.45507 13.25 6.25Z"
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
        d="M3.5 16.5V14.5C3.5 12.8431 4.84315 11.5 6.5 11.5H13.5C15.1569 11.5 16.5 12.8431 16.5 14.5V16.5M12.75 6.25C12.75 7.76878 11.5188 9 10 9C8.48122 9 7.25 7.76878 7.25 6.25C7.25 4.73122 8.48122 3.5 10 3.5C11.5188 3.5 12.75 4.73122 12.75 6.25Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcUser = forwardRef(_IcUser);
