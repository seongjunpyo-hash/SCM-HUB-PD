/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcFaceSad = (
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
          d="M10 2.5C14.142 2.5 17.5 5.85797 17.5 10C17.5 14.142 14.142 17.5 10 17.5C5.85797 17.5 2.5 14.142 2.5 10C2.5 5.85797 5.85797 2.5 10 2.5ZM10 10.0996C8.23275 10.0996 6.79991 11.5326 6.7998 13.2998H8.2002C8.2003 12.3058 9.00595 11.5 10 11.5C10.994 11.5 11.7997 12.3058 11.7998 13.2998H13.2002C13.2001 11.5326 11.7672 10.0996 10 10.0996ZM7 7.5C6.44772 7.5 6 7.94772 6 8.5C6 9.05228 6.44772 9.5 7 9.5C7.55228 9.5 8 9.05228 8 8.5C8 7.94772 7.55228 7.5 7 7.5ZM13 7.5C12.4477 7.5 12 7.94772 12 8.5C12 9.05228 12.4477 9.5 13 9.5C13.5523 9.5 14 9.05228 14 8.5C14 7.94772 13.5523 7.5 13 7.5Z"
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
        d="M7.5 13.3C7.5 11.9193 8.61929 10.8 10 10.8C11.3807 10.8 12.5 11.9193 12.5 13.3M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M8 8.5C8 9.05228 7.55228 9.5 7 9.5C6.44772 9.5 6 9.05228 6 8.5C6 7.94772 6.44772 7.5 7 7.5C7.55228 7.5 8 7.94772 8 8.5Z"
        fill={color}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M14 8.5C14 9.05228 13.5523 9.5 13 9.5C12.4477 9.5 12 9.05228 12 8.5C12 7.94772 12.4477 7.5 13 7.5C13.5523 7.5 14 7.94772 14 8.5Z"
        fill={color}
      />
    </svg>
  );
};

export const IcFaceSad = forwardRef(_IcFaceSad);
