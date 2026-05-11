/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSync = (
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
          d="M17.704 10C17.704 14.2526 14.2564 17.7002 10.0038 17.7002C7.84953 17.7001 5.90055 16.814 4.50385 15.3887C4.12664 15.0037 3.79034 14.5785 3.49994 14.1211L3.21576 15.1816L1.8642 14.8184L2.77728 11.4102L6.18549 12.3242L6.00385 13L5.82318 13.6758L4.6806 13.3691C4.91851 13.7442 5.19417 14.0932 5.50385 14.4092C6.64808 15.5769 8.24097 16.2997 10.0038 16.2998C13.4832 16.2998 16.3036 13.4794 16.3036 10H17.704ZM9.99994 2.2998C12.1543 2.2998 14.1032 3.18596 15.4999 4.61133C15.8769 4.99598 16.2126 5.42091 16.5029 5.87793L16.788 4.81836L18.1406 5.18164L17.4081 7.91309L17.2275 8.58984L13.8193 7.67578L13.9999 7L14.1816 6.32422L15.3222 6.62988C15.0845 6.25531 14.8093 5.9065 14.4999 5.59082C13.3557 4.42315 11.7629 3.7002 9.99994 3.7002C6.52056 3.70022 3.70013 6.52062 3.70013 10H2.29974C2.29974 5.74742 5.74736 2.29983 9.99994 2.2998Z"
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
        d="M3.00001 10C3.00001 6.13401 6.13401 3 10 3C11.9587 3 13.7295 3.80447 15 5.10102C15.6659 5.78051 16.1943 6.59516 16.5404 7.5M14 7L16.7321 7.73205L17.4641 5M17.0041 10C17.0041 13.866 13.8701 17 10.0041 17C8.04542 17 6.27463 16.1955 5.00411 14.899C4.33826 14.2195 3.80981 13.4048 3.46374 12.5M6.00411 13L3.27206 12.2679L2.54001 15"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcSync = forwardRef(_IcSync);
