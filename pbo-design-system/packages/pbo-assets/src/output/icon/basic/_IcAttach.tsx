/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcAttach = (
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
          d="M12.1115 8.57595C12.4239 8.26353 12.4239 7.75728 12.1115 7.44486C11.799 7.13244 11.2928 7.13244 10.9804 7.44486L6.2074 12.2178C5.40683 13.0184 5.40683 14.3161 6.2074 15.1167C7.00798 15.9173 8.30569 15.9173 9.10627 15.1167L14.2328 9.99017C15.5215 8.70144 15.5215 6.61227 14.2328 5.32354C12.9441 4.03481 10.8549 4.03481 9.56616 5.32354L4.96997 9.91973L3.97974 8.92951L8.57594 4.33331C10.4114 2.49785 13.3876 2.49785 15.223 4.33331C17.0585 6.16878 17.0585 9.14493 15.223 10.9804L10.0965 16.1069C8.74918 17.4542 6.56449 17.4542 5.21718 16.1069C3.86987 14.7596 3.86987 12.5749 5.21718 11.2276L9.99015 6.45463C10.8493 5.59548 12.2425 5.59548 13.1017 6.45463C13.9608 7.31379 13.9608 8.70703 13.1017 9.56618L8.85905 13.8088L7.86883 12.8186L12.1115 8.57595Z"
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
        d="M10.4853 14.7279L14.7279 10.4853C16.29 8.92318 16.29 6.39052 14.7279 4.82843C13.1658 3.26633 10.6332 3.26633 9.07106 4.82843L4.47487 9.42462M8.36396 13.3137L12.6066 9.07107C13.1924 8.48528 13.1924 7.53553 12.6066 6.94975C12.0208 6.36396 11.0711 6.36396 10.4853 6.94975L7.3033 10.1317M11.5459 13.6673L9.60139 15.6118C8.52745 16.6857 6.78625 16.6857 5.71231 15.6118C4.63836 14.5379 4.63836 12.7967 5.71231 11.7227L7.65685 9.77817"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcAttach = forwardRef(_IcAttach);
