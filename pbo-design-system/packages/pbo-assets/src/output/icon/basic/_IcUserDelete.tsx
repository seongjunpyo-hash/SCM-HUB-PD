/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcUserDelete = (
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
          d="M18 15.2998V16.7002H13V15.2998H18ZM2.7998 14.5C2.7998 12.4565 4.45655 10.7998 6.5 10.7998H14C15.7673 10.7998 17.2002 12.2327 17.2002 14H15.7998C15.7998 13.0059 14.9941 12.2002 14 12.2002H6.5C5.22975 12.2002 4.2002 13.2297 4.2002 14.5V16.5H2.7998V14.5ZM12.0498 6.25C12.0498 5.11782 11.1322 4.2002 10 4.2002C8.86782 4.2002 7.9502 5.11782 7.9502 6.25C7.9502 7.38218 8.86782 8.2998 10 8.2998C11.1322 8.2998 12.0498 7.38218 12.0498 6.25ZM13.4502 6.25C13.4502 8.15538 11.9054 9.7002 10 9.7002C8.09462 9.7002 6.5498 8.15538 6.5498 6.25C6.5498 4.34462 8.09462 2.7998 10 2.7998C11.9054 2.7998 13.4502 4.34462 13.4502 6.25Z"
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
        d="M13 16H18M3.5 16.5V14.5C3.5 12.8431 4.84315 11.5 6.5 11.5H14C15.3807 11.5 16.5 12.6193 16.5 14M12.75 6.25C12.75 7.76878 11.5188 9 10 9C8.48122 9 7.25 7.76878 7.25 6.25C7.25 4.73122 8.48122 3.5 10 3.5C11.5188 3.5 12.75 4.73122 12.75 6.25Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcUserDelete = forwardRef(_IcUserDelete);
