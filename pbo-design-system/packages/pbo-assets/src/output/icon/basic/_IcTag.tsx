/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcTag = (
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
          d="M17.0763 2C17.5178 2.00025 17.8759 2.35833 17.8761 2.7998V9.37598C17.8761 9.58799 17.7916 9.79145 17.6417 9.94141L9.94155 17.6416L9.881 17.6963C9.56691 17.9525 9.10364 17.9342 8.81069 17.6416L2.23452 11.0664C1.92215 10.754 1.92224 10.247 2.23452 9.93457L9.93472 2.23438C10.0847 2.0845 10.2881 2.00006 10.5001 2H17.0763ZM13.88 4.75C13.1897 4.75 12.63 5.30964 12.63 6C12.63 6.69036 13.1897 7.25 13.88 7.25C14.5704 7.24998 15.13 6.69034 15.13 6C15.13 5.30966 14.5704 4.75002 13.88 4.75Z"
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
        d="M10.2881 2.58786C10.3444 2.5316 10.4207 2.5 10.5002 2.5L17.076 2.5C17.2417 2.5 17.376 2.63431 17.376 2.8L17.376 9.37573C17.376 9.4553 17.3444 9.5316 17.2881 9.58786L9.58811 17.2879C9.47095 17.405 9.281 17.405 9.16384 17.2879L2.58811 10.7121C2.47095 10.595 2.47095 10.405 2.58811 10.2879L10.2881 2.58786Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M12.376 6.5C12.376 5.94771 12.8237 5.5 13.376 5.5C13.9283 5.5 14.376 5.94771 14.376 6.5C14.376 7.05228 13.9283 7.5 13.376 7.5C12.8237 7.5 12.376 7.05228 12.376 6.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcTag = forwardRef(_IcTag);
