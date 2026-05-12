/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcComment = (
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
          d="M10 2.5498C12.2115 2.5498 14.2397 3.23675 15.7295 4.37891C17.2198 5.52158 18.2002 7.14917 18.2002 9C18.2002 10.8508 17.2198 12.4784 15.7295 13.6211C14.2397 14.7632 12.2115 15.4502 10 15.4502C9.54506 15.4502 9.09859 15.4192 8.66309 15.3633L5.36426 17.3037C4.65874 17.7187 3.78078 17.1562 3.8623 16.3418L4.14453 13.5205C2.72545 12.3832 1.7998 10.7983 1.7998 9C1.7998 7.14917 2.78023 5.52158 4.27051 4.37891C5.76028 3.23675 7.78847 2.5498 10 2.5498Z"
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
        d="M10 14.75C14.1421 14.75 17.5 12.1756 17.5 9C17.5 5.82436 14.1421 3.25 10 3.25C5.85786 3.25 2.5 5.82436 2.5 9C2.5 10.658 3.41534 12.1521 4.87973 13.2015L4.55838 16.4119C4.53393 16.6562 4.79734 16.8248 5.00899 16.7003L8.51605 14.6375C8.99574 14.7113 9.49197 14.75 10 14.75Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    </svg>
  );
};

export const IcComment = forwardRef(_IcComment);
