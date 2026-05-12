/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCrown = (
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.33407 3.09653C9.63098 2.65179 10.2629 2.62435 10.6016 3.01353L10.6661 3.09653L14.0772 8.2147L17.0284 5.2645L17.1329 5.17466C17.6768 4.78314 18.476 5.22126 18.3878 5.92954L17.0294 16.7987C16.9793 17.1988 16.6387 17.4996 16.2354 17.4999H3.76473C3.36138 17.4998 3.02086 17.1989 2.97079 16.7987L1.61239 5.92954C1.51824 5.17402 2.43319 4.72632 2.97176 5.2645L5.92196 8.2147L9.33407 3.09653ZM10.0001 10.9999C8.89556 10.9999 8.00016 11.8954 8.00008 12.9999C8.00008 14.1044 8.89551 14.9999 10.0001 14.9999C11.1046 14.9998 12.0001 14.1044 12.0001 12.9999C12 11.8954 11.1046 10.9999 10.0001 10.9999Z"
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
        d="M2.10845 5.86761C2.07302 5.58417 2.41628 5.41628 2.61827 5.61827L5.74124 8.74124C5.87511 8.87511 6.09798 8.85304 6.20299 8.69552L9.75039 3.37442C9.86913 3.1963 10.1309 3.1963 10.2496 3.37442L13.797 8.69552C13.902 8.85304 14.1249 8.87511 14.2588 8.74124L17.3817 5.61827C17.5837 5.41628 17.927 5.58417 17.8915 5.86761L16.5328 16.7372C16.5141 16.8873 16.3865 17 16.2352 17H3.76483C3.61354 17 3.48592 16.8873 3.46715 16.7372L2.10845 5.86761Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M12 12.5C12 13.6046 11.1046 14.5 10 14.5C8.89543 14.5 8 13.6046 8 12.5C8 11.3954 8.89543 10.5 10 10.5C11.1046 10.5 12 11.3954 12 12.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcCrown = forwardRef(_IcCrown);
