/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCamera = (
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
          d="M12.3145 3.2998C12.6458 3.2998 12.9528 3.4636 13.1377 3.73145L13.209 3.85254L13.9326 5.2998H16.7002C17.2523 5.29991 17.7001 5.74767 17.7002 6.2998V15.7002C17.7001 16.2523 17.2523 16.7001 16.7002 16.7002H3.2998C2.74768 16.7001 2.29991 16.2523 2.2998 15.7002V6.2998C2.29991 5.74768 2.74767 5.29991 3.2998 5.2998H6.06738L6.79102 3.85254L6.8623 3.73145C7.04725 3.4636 7.35417 3.2998 7.68555 3.2998H12.3145ZM10 8.5C8.61929 8.5 7.5 9.61929 7.5 11C7.5 12.3807 8.61929 13.5 10 13.5C11.3807 13.5 12.5 12.3807 12.5 11C12.5 9.61929 11.3807 8.5 10 8.5Z"
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
        d="M17 15.7C17 15.8657 16.8657 16 16.7 16H3.3C3.13431 16 3 15.8657 3 15.7V6.3C3 6.13431 3.13431 6 3.3 6H6.31459C6.42822 6 6.5321 5.9358 6.58292 5.83416L7.41708 4.16584C7.4679 4.0642 7.57178 4 7.68541 4H12.3146C12.4282 4 12.5321 4.0642 12.5829 4.16584L13.4171 5.83416C13.4679 5.9358 13.5718 6 13.6854 6H16.7C16.8657 6 17 6.13431 17 6.3V15.7Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M12.5 11C12.5 12.3807 11.3807 13.5 10 13.5C8.61929 13.5 7.5 12.3807 7.5 11C7.5 9.61929 8.61929 8.5 10 8.5C11.3807 8.5 12.5 9.61929 12.5 11Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcCamera = forwardRef(_IcCamera);
