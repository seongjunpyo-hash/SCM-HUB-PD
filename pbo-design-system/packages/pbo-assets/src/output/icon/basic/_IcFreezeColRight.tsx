/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcFreezeColRight = (
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
        <path d="M8 11.75H2.5V8.25H8V11.75Z" fill={color} />
        <path
          d="M2.5 16.7002C2.50011 17.1419 2.85813 17.4999 3.2998 17.5H7.2002C7.64187 17.4999 7.99989 17.1419 8 16.7002V12.75H2.5V16.7002Z"
          fill={color}
        />
        <path
          d="M3.2998 2.5C2.85813 2.50011 2.50011 2.85813 2.5 3.2998V7.25H8V3.2998C7.99989 2.85813 7.64187 2.50011 7.2002 2.5H3.2998Z"
          fill={color}
        />
        <path
          d="M17.5 3V17H16.5V3H17.5ZM14.8096 9.46191C14.9393 9.62075 15 9.81415 15 10C15 10.1859 14.9393 10.3793 14.8096 10.5381L12.9492 12.8164L12.5625 12.5L12.1748 12.1836L13.5498 10.5H9.5V9.5H13.5498L12.1748 7.81641L12.5625 7.5L12.9492 7.18359L14.8096 9.46191Z"
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
        d="M17 3V17M7.5 12.25V16.7C7.5 16.8657 7.36569 17 7.2 17H3.3C3.13431 17 3 16.8657 3 16.7V12.25M7.5 12.25H3M7.5 12.25V7.75M3 12.25V7.75M7.5 7.75V3.3C7.5 3.13431 7.36569 3 7.2 3H3.3C3.13431 3 3 3.13431 3 3.3V7.75M7.5 7.75H3M12.5621 7.5L14.4227 9.77855C14.4742 9.84169 14.5 9.92085 14.5 10M12.5621 12.5L14.4227 10.2215C14.4742 10.1583 14.5 10.0792 14.5 10M14.5 10H9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IcFreezeColRight = forwardRef(_IcFreezeColRight);
