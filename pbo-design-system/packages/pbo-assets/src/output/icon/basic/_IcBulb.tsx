/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcBulb = (
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
          d="M8.4502 16.2998H11.5498V15.7002H8.4502V16.2998ZM16.2002 8.5C16.2002 10.8566 14.8826 12.899 12.9502 13.9473V16.7002C12.9501 17.2523 12.5023 17.7001 11.9502 17.7002H8.0498C7.49767 17.7001 7.04991 17.2523 7.0498 16.7002V13.9473C5.11743 12.899 3.7998 10.8566 3.7998 8.5C3.7998 5.07583 6.57583 2.2998 10 2.2998C13.4242 2.2998 16.2002 5.07583 16.2002 8.5Z"
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
        d="M10 3C13.0376 3 15.5 5.46243 15.5 8.5C15.5 10.6666 14.2463 12.5385 12.4257 13.4349C12.3197 13.4871 12.25 13.5936 12.25 13.7117V14.7C12.25 14.8657 12.1157 15 11.95 15H8.05C7.88431 15 7.75 14.8657 7.75 14.7V13.7117C7.75 13.5936 7.68032 13.4871 7.57434 13.4349C5.75365 12.5385 4.5 10.6666 4.5 8.5C4.5 5.46243 6.96243 3 10 3Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M7.75 15H12.25V16.7C12.25 16.8657 12.1157 17 11.95 17H8.05C7.88431 17 7.75 16.8657 7.75 16.7V15Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcBulb = forwardRef(_IcBulb);
