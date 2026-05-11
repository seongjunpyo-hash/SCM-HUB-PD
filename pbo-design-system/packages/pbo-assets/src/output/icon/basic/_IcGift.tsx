/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcGift = (
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
          d="M12.375 2.5C13.937 2.5 15.25 3.70609 15.25 5.25V6H16.7002C17.1419 6.00011 17.4999 6.35813 17.5 6.7998V16.7002C17.4999 17.1419 17.1419 17.4999 16.7002 17.5H10.5V6H9.5V17.5H3.2998C2.85813 17.4999 2.50011 17.1419 2.5 16.7002V6.7998C2.50011 6.35813 2.85813 6.00011 3.2998 6H4.75V5.25C4.75 3.70609 6.063 2.5 7.625 2.5C8.59986 2.5 9.47777 2.96975 10 3.69824C10.5222 2.96975 11.4001 2.5 12.375 2.5ZM7.625 3.5C6.56365 3.5 5.75 4.30863 5.75 5.25V6H9.5V5.25C9.5 4.30863 8.68635 3.5 7.625 3.5ZM12.375 3.5C11.3137 3.5 10.5 4.30863 10.5 5.25V6H14.25V5.25C14.25 4.30863 13.4363 3.5 12.375 3.5Z"
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
        d="M10 5V16.5M5.25 6.5V5.25C5.25 4.00736 6.31332 3 7.625 3C8.93668 3 10 4.00736 10 5.25C10 4.00736 11.0633 3 12.375 3C13.6867 3 14.75 4.00736 14.75 5.25V6.5M3.3 17H16.7C16.8657 17 17 16.8657 17 16.7V6.8C17 6.63431 16.8657 6.5 16.7 6.5H3.3C3.13431 6.5 3 6.63431 3 6.8V16.7C3 16.8657 3.13431 17 3.3 17Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcGift = forwardRef(_IcGift);
