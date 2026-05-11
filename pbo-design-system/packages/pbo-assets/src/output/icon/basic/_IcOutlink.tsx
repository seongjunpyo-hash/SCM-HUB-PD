/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcOutlink = (
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
        <g clipPath="url(#clip0_4372_5884)">
          <path
            d="M14.4053 4.19727C14.9574 4.19737 15.4052 4.64514 15.4053 5.19727V12.8975H14.0049V6.58789L5.2002 15.3926L4.20996 14.4023L13.0146 5.59766H6.70508V4.19727H14.4053Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_4372_5884">
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
      <g clipPath="url(#clip0_4372_4845)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M7 5H14.7C14.8657 5 15 5.13431 15 5.3V13M15 5L5 15"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>
      <defs>
        <clipPath id="clip0_4372_4845">
          <rect width="20" height="20" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export const IcOutlink = forwardRef(_IcOutlink);
