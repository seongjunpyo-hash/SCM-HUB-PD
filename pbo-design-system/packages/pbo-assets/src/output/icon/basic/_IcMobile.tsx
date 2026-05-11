/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcMobile = (
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
          d="M6.24023 16.7998H13.8398V15.2002H6.24023V16.7998ZM6.24023 4.7998H13.8398V3.2002H6.24023V4.7998ZM15.2402 17.2002C15.2401 17.7523 14.7924 18.2001 14.2402 18.2002H5.83984C5.28771 18.2001 4.83995 17.7523 4.83984 17.2002V2.7998C4.83995 2.24768 5.28771 1.79991 5.83984 1.7998H14.2402C14.7924 1.79991 15.2401 2.24767 15.2402 2.7998V17.2002Z"
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
        d="M6.04004 5.5H14.04M6.04004 14.5H14.04M5.84004 17.5H14.24C14.4057 17.5 14.54 17.3657 14.54 17.2V2.8C14.54 2.63431 14.4057 2.5 14.24 2.5H5.84004C5.67435 2.5 5.54004 2.63432 5.54004 2.8V17.2C5.54004 17.3657 5.67435 17.5 5.84004 17.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcMobile = forwardRef(_IcMobile);
