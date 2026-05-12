/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSortAscending = (
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
          d="M12 14.2998V15.7002H2V14.2998H12ZM17.9775 7.25488L17.0225 8.27832L14.7002 6.11035V15.5H13.2998V6.11035L10.9775 8.27832L10.0225 7.25488L14 3.54297L17.9775 7.25488ZM9 9.2998V10.7002H2V9.2998H9ZM6 4.2998V5.7002H2V4.2998H6Z"
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
        d="M14 4.5L14 15.4999M14 4.5L17.5 7.76666M14 4.5L10.5 7.76666M2 4.99995H6M2 9.99995H9M2 14.9999H12"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcSortAscending = forwardRef(_IcSortAscending);
