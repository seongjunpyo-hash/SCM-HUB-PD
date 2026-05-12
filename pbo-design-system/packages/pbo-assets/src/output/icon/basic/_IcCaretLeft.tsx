/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCaretLeft = (
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
          d="M11.8341 3.67617C12.338 3.17226 13.2001 3.52902 13.2003 4.2416V15.7592C13.1998 16.4714 12.3379 16.8281 11.8341 16.3246L6.07624 10.5658C5.76388 10.2535 5.76399 9.74739 6.07624 9.43496L11.8341 3.67617Z"
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
        d="M12.3293 15.8293L6.57071 10.0705C6.53166 10.0315 6.53166 9.96818 6.57071 9.92912L12.3293 4.17071C12.3923 4.10771 12.5 4.15233 12.5 4.24142L12.5 15.7586C12.5 15.8477 12.3923 15.8923 12.3293 15.8293Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcCaretLeft = forwardRef(_IcCaretLeft);
