/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcIn = (
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
          d="M11.9951 7.99512L10.6904 9.2998H17V10.7002H10.6904L11.9951 12.0049L11.0049 12.9951L8.00977 10L11.0049 7.00488L11.9951 7.99512ZM15.7002 6H14.2998V3.2002H4.7002V16.7998H14.2998V14H15.7002V17.2002C15.7001 17.7523 15.2523 18.2001 14.7002 18.2002H4.2998C3.74768 18.2001 3.29991 17.7523 3.2998 17.2002V2.7998C3.29991 2.24768 3.74767 1.79991 4.2998 1.7998H14.7002C15.2523 1.79991 15.7001 2.24767 15.7002 2.7998V6Z"
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
        d="M17 10L9 10M9 10L11.5 12.5M9 10L11.5 7.5M15 6V2.8C15 2.63431 14.8657 2.5 14.7 2.5H4.3C4.13431 2.5 4 2.63432 4 2.8V17.2C4 17.3657 4.13431 17.5 4.3 17.5H14.7C14.8657 17.5 15 17.3657 15 17.2V14"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcIn = forwardRef(_IcIn);
