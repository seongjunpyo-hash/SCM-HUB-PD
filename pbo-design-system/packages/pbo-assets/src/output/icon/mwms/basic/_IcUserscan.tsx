/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcUserscan = (
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
          d="M3.7002 13.5V15.7998H6V17.2002H3.2998C2.74767 17.2001 2.29991 16.7523 2.2998 16.2002V13.5H3.7002ZM13.2998 13.2002C13.2998 12.4822 12.718 11.9004 12 11.9004H8C7.28203 11.9004 6.7002 12.4822 6.7002 13.2002V14.2002H5.2998V13.2002C5.2998 11.709 6.50883 10.5 8 10.5H12C13.4912 10.5 14.7002 11.709 14.7002 13.2002V14.2002H13.2998V13.2002ZM10.9922 7.39258C10.9922 6.84454 10.548 6.40039 10 6.40039C9.45196 6.40039 9.00781 6.84454 9.00781 7.39258C9.00796 7.94049 9.45205 8.38477 10 8.38477C10.5479 8.38477 10.992 7.94049 10.9922 7.39258ZM6 2.7998V4.2002H3.7002V6.5H2.2998V3.7998C2.29991 3.24768 2.74767 2.79991 3.2998 2.7998H6ZM17.7002 16.2002C17.7001 16.7523 17.2523 17.2001 16.7002 17.2002H14V15.7998H16.2998V13.5H17.7002V16.2002ZM12.3926 7.39258C12.3924 8.71369 11.3211 9.78418 10 9.78418C8.67885 9.78418 7.60757 8.71369 7.60742 7.39258C7.60742 6.07134 8.67876 5 10 5C11.3212 5 12.3926 6.07134 12.3926 7.39258ZM17.7002 6.5H16.2998V4.2002H14V2.7998H16.7002C17.2523 2.79991 17.7001 3.24768 17.7002 3.7998V6.5Z"
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
        d="M6 16.5H3.3C3.13431 16.5 3 16.3657 3 16.2V13.5M14 16.5H16.7C16.8657 16.5 17 16.3657 17 16.2V13.5M6 3.5H3.3C3.13431 3.5 3 3.63431 3 3.8V6.5M14 3.5H16.7C16.8657 3.5 17 3.63431 17 3.8V6.5M6 14.2V13.2C6 12.0954 6.89543 11.2 8 11.2H12C13.1046 11.2 14 12.0954 14 13.2V14.2M11.6923 7.39231C11.6923 8.32694 10.9346 9.08462 10 9.08462C9.06536 9.08462 8.30769 8.32694 8.30769 7.39231C8.30769 6.45767 9.06536 5.7 10 5.7C10.9346 5.7 11.6923 6.45767 11.6923 7.39231Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcUserscan = forwardRef(_IcUserscan);
