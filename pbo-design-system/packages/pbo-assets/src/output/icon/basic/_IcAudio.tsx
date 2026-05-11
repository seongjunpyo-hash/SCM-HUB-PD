/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcAudio = (
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
          d="M6.2002 9C6.2002 11.0987 7.90132 12.7998 10 12.7998C12.0987 12.7998 13.7998 11.0987 13.7998 9H15.2002C15.2002 11.6343 13.2408 13.8083 10.7002 14.1504V16.2998H14V17.7002H6V16.2998H9.2998V14.1504C6.75923 13.8083 4.7998 11.6343 4.7998 9H6.2002ZM12.7002 9C12.7002 10.4912 11.4912 11.7002 10 11.7002C8.50883 11.7002 7.2998 10.4912 7.2998 9V5C7.2998 3.50883 8.50883 2.2998 10 2.2998C11.4912 2.2998 12.7002 3.50883 12.7002 5V9Z"
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
        d="M10 13.5V17M10 13.5C12.4853 13.5 14.5 11.4853 14.5 9M10 13.5C7.51472 13.5 5.5 11.4853 5.5 9M6 17H14M10 11C8.89543 11 8 10.1046 8 9V5C8 3.89543 8.89543 3 10 3C11.1046 3 12 3.89543 12 5V9C12 10.1046 11.1046 11 10 11Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcAudio = forwardRef(_IcAudio);
