/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcPlayCircle = (
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
          d="M10 2.2998C14.2526 2.2998 17.7002 5.74741 17.7002 10C17.7002 14.2526 14.2526 17.7002 10 17.7002C5.74741 17.7002 2.2998 14.2526 2.2998 10C2.2998 5.74741 5.74741 2.2998 10 2.2998ZM9.22656 6.4834C8.71147 6.15358 8.00013 6.51696 8 7.16113V12.8389C8.00015 13.5261 8.80993 13.893 9.32715 13.4404L12.5713 10.6016C12.9353 10.2828 12.9355 9.71611 12.5713 9.39746L9.32715 6.55859L9.22656 6.4834Z"
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
        d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M12.242 10.2258L8.99755 13.0646C8.80358 13.2344 8.5 13.0966 8.5 12.8389V7.16113C8.5 6.90338 8.80358 6.76563 8.99755 6.93536L12.242 9.77423C12.3786 9.89375 12.3786 10.1062 12.242 10.2258Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcPlayCircle = forwardRef(_IcPlayCircle);
