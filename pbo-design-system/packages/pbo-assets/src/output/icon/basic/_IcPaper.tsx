/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcPaper = (
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
          d="M16.5 2C16.7761 2 17 2.22386 17 2.5V12.5H12C11.7239 12.5 11.5 12.7239 11.5 13V18H3.5C3.22386 18 3 17.7761 3 17.5V2.5C3 2.22386 3.22386 2 3.5 2H16.5ZM6 8.5V9.5H14V8.5H6ZM6 5.5V6.5H11V5.5H6Z"
          fill={color}
        />
        <path d="M12.5 17.707V13.5H16.707L12.5 17.707Z" fill={color} />
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
        d="M12 17.5V13H16.5M12 17.5H3.5V2.5H16.5V13M12 17.5L16.5 13M6 6H11M6 9H14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IcPaper = forwardRef(_IcPaper);
