/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcMenu = (
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
        <g clipPath="url(#clip0_3016_3535)">
          <path
            d="M13.4955 2.62184C13.7887 2.38253 14.2119 2.38276 14.5052 2.62184L14.5667 2.67653L17.3246 5.43434C17.6368 5.74676 17.6369 6.25382 17.3246 6.56617L14.5667 9.32399C14.2544 9.63629 13.7473 9.63619 13.4349 9.32399L10.6771 6.56617C10.3647 6.25377 10.3647 5.74676 10.6771 5.43434L13.4349 2.67653L13.4955 2.62184ZM8.99936 16.2C8.9993 16.6417 8.64125 16.9997 8.19955 16.9998H3.79916C3.35747 16.9997 2.99942 16.6417 2.99936 16.2V11.7996C2.99951 11.3579 3.35752 10.9999 3.79916 10.9998H8.19955C8.6412 10.9999 8.99921 11.3579 8.99936 11.7996V16.2ZM16.9994 16.2C16.9993 16.6417 16.6413 16.9997 16.1996 16.9998H11.7992C11.3575 16.9997 10.9994 16.6417 10.9994 16.2V11.7996C10.9995 11.3579 11.3575 10.9999 11.7992 10.9998H16.1996C16.6412 10.9999 16.9992 11.3579 16.9994 11.7996V16.2ZM8.99936 8.19996C8.9993 8.64167 8.64125 8.99966 8.19955 8.99977H3.79916C3.35747 8.99966 2.99942 8.64167 2.99936 8.19996V3.79957C2.99951 3.35794 3.35752 2.99987 3.79916 2.99977H8.19955C8.6412 2.99987 8.99921 3.35794 8.99936 3.79957V8.19996Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_3016_3535">
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
      <g clipPath="url(#clip0_3016_3516)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M3.49936 3.7999C3.49936 3.63421 3.63367 3.49989 3.79936 3.49989H8.19936C8.36504 3.49989 8.49936 3.63421 8.49936 3.79989V8.19989C8.49936 8.36558 8.36504 8.4999 8.19936 8.4999H3.79936C3.63367 8.4999 3.49936 8.36558 3.49936 8.1999V3.7999Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
          strokeLinejoin="round"
        />
        <path
          vectorEffect="non-scaling-stroke"
          d="M3.49936 11.7999C3.49936 11.6342 3.63367 11.4999 3.79936 11.4999H8.19936C8.36504 11.4999 8.49936 11.6342 8.49936 11.7999V16.1999C8.49936 16.3656 8.36504 16.4999 8.19936 16.4999H3.79936C3.63367 16.4999 3.49936 16.3656 3.49936 16.1999V11.7999Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
          strokeLinejoin="round"
        />
        <path
          vectorEffect="non-scaling-stroke"
          d="M11.4994 11.7999C11.4994 11.6342 11.6337 11.4999 11.7994 11.4999H16.1994C16.365 11.4999 16.4994 11.6342 16.4994 11.7999V16.1999C16.4994 16.3656 16.365 16.4999 16.1994 16.4999H11.7994C11.6337 16.4999 11.4994 16.3656 11.4994 16.1999V11.7999Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
          strokeLinejoin="round"
        />
        <path
          vectorEffect="non-scaling-stroke"
          d="M11.0308 6.21229C10.9137 6.09513 10.9137 5.90518 11.0308 5.78802L13.7885 3.03031C13.9057 2.91315 14.0956 2.91315 14.2128 3.03031L16.9705 5.78802C17.0877 5.90518 17.0877 6.09513 16.9705 6.21229L14.2128 8.97C14.0957 9.08716 13.9057 9.08716 13.7885 8.97L11.0308 6.21229Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3016_3516">
          <rect width="20" height="20" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export const IcMenu = forwardRef(_IcMenu);
