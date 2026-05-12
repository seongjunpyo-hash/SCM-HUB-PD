/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcEye = (
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
          d="M10 4C14.1909 4 17.3157 7.08208 18.416 9.69531L18.4424 9.76953C18.4887 9.91989 18.4887 10.0801 18.4424 10.2305L18.416 10.3047C17.3157 12.9179 14.1909 16 10 16C5.94006 16 2.88092 13.1074 1.69336 10.5508L1.58398 10.3047C1.50187 10.1096 1.50187 9.89036 1.58398 9.69531L1.69336 9.44922C2.88092 6.89261 5.94006 4.00004 10 4ZM10 8C8.89546 8.00004 8 8.89545 8 10C8 11.1045 8.89546 12 10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8Z"
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
        d="M10 4.5C6.05862 4.5 3.08814 7.41272 2.04525 9.88978C2.01536 9.96078 2.01536 10.0392 2.04525 10.1102C3.08814 12.5873 6.05862 15.5 10 15.5C13.9414 15.5 16.9119 12.5873 17.9548 10.1102C17.9846 10.0392 17.9846 9.96078 17.9548 9.88978C16.9119 7.41272 13.9414 4.5 10 4.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    </svg>
  );
};

export const IcEye = forwardRef(_IcEye);
