/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcNotification = (
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
          d="M9.2998 13.3748L6.7002 12.6004V14.6854C6.70045 15.4164 7.28714 15.9998 8 15.9998C8.71286 15.9998 9.29955 15.4164 9.2998 14.6854V13.3748ZM3.7002 10.9627H5.2998V7.07207H3.7002V10.9627ZM17.7002 14.532C17.7002 15.195 17.063 15.6859 16.415 15.493L10.7002 13.7908V14.6854C10.6999 16.1797 9.49597 17.4002 8 17.4002C6.50403 17.4002 5.30006 16.1797 5.2998 14.6854V12.3621H3.2998C2.74272 12.362 2.29992 11.9086 2.2998 11.3602V6.67461C2.29991 6.1262 2.74272 5.67276 3.2998 5.67266H5.89746L16.415 2.5418C17.063 2.3489 17.7002 2.83976 17.7002 3.50273V14.532Z"
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
        d="M6 6.62442V14.6849C6 15.7978 6.89543 16.7 8 16.7C9.10457 16.7 10 15.7978 10 14.6849V12.6698M17 14.5323V3.50246C17 3.30051 16.8072 3.15536 16.615 3.21258L6.04161 6.36015C6.01401 6.36836 5.98539 6.37253 5.95661 6.37253H3.3C3.13431 6.37253 3 6.50786 3 6.6748V11.3599C3 11.5269 3.13431 11.6622 3.3 11.6622H5.95661C5.98539 11.6622 6.01401 11.6664 6.04161 11.6746L16.615 14.8222C16.8072 14.8794 17 14.7342 17 14.5323Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcNotification = forwardRef(_IcNotification);
