/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSun = (
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
          d="M10.7002 15.25V17.5H9.2998V15.25H10.7002ZM6.78223 14.207L5.19141 15.7979L4.20117 14.8086L5.79199 13.2178L6.78223 14.207ZM15.7979 14.8086L14.8076 15.7979L13.2168 14.207L14.207 13.2178L15.7979 14.8086ZM4.75 9.2998V10.7002H2.5V9.2998H4.75ZM17.5 9.2998V10.7002H15.25V9.2998H17.5ZM6.78223 5.79297L5.79199 6.78223L4.20117 5.19141L5.19141 4.20215L6.78223 5.79297ZM15.7979 5.19141L14.207 6.78223L13.2168 5.79297L14.8076 4.20215L15.7979 5.19141ZM10.7002 2.5V4.75H9.2998V2.5H10.7002ZM14.2002 10C14.2002 12.3196 12.3196 14.2002 10 14.2002C7.6804 14.2002 5.7998 12.3196 5.7998 10C5.7998 7.6804 7.6804 5.7998 10 5.7998C12.3196 5.7998 14.2002 7.6804 14.2002 10Z"
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
        d="M10 2.5V4.75M10 15.25V17.5M2.5 10H4.75M15.25 10H17.5M4.69629 4.69666L6.28728 6.28765M13.7119 13.7123L15.3029 15.3033M15.3027 4.69666L13.7117 6.28765M6.28712 13.7123L4.69613 15.3033M13.5 10C13.5 11.933 11.933 13.5 10 13.5C8.067 13.5 6.5 11.933 6.5 10C6.5 8.067 8.067 6.5 10 6.5C11.933 6.5 13.5 8.067 13.5 10Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcSun = forwardRef(_IcSun);
