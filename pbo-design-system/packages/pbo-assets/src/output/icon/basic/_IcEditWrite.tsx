/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcEditWrite = (
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
          d="M13.5566 9.2285L7.03611 15.9756C6.92746 16.088 6.78827 16.1661 6.63572 16.2002L3.26462 16.9532C2.83221 17.0493 2.44823 16.6596 2.55076 16.2285L3.36228 12.8154C3.39548 12.6759 3.46575 12.5475 3.5654 12.4443L10.0556 5.7275L13.5566 9.2285ZM18 16.5H9.99998V15.5H18V16.5ZM12.875 2.8183C13.1713 2.56956 13.606 2.56956 13.9023 2.8183L13.9638 2.87592L16.2929 5.28609C16.5924 5.59613 16.5924 6.08743 16.2929 6.39743L14.251 8.50877L10.751 5.00875L12.8135 2.87592L12.875 2.8183Z"
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
        d="M18 16H10M10.7411 5.70639L13.5347 8.5M15.9334 6.05019L6.67671 15.6282C6.63592 15.6704 6.58365 15.6998 6.52637 15.7125L3.15609 16.4651C3.08398 16.4812 3.01991 16.4163 3.03701 16.3444L3.84881 12.9312C3.86126 12.8789 3.88756 12.8308 3.92495 12.7921L13.1728 3.22321C13.2907 3.10119 13.4863 3.10119 13.6042 3.22321L15.9334 5.63322C16.0458 5.7495 16.0458 5.93391 15.9334 6.05019Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcEditWrite = forwardRef(_IcEditWrite);
