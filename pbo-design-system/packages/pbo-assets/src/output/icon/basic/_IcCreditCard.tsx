/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCreditCard = (
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
          d="M17.7002 8.7002V14.7002C17.7001 15.2523 17.2523 15.7001 16.7002 15.7002H3.2998C2.74768 15.7001 2.29991 15.2523 2.2998 14.7002V8.7002H17.7002ZM12 13.2002H15V11.7998H12V13.2002Z"
          fill={color}
        />
        <path
          d="M16.7002 4.2998C17.2523 4.29991 17.7001 4.74767 17.7002 5.2998V7.2998H2.2998V5.2998C2.29991 4.74768 2.74767 4.29991 3.2998 4.2998H16.7002Z"
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
        d="M3 8H17M12 12.5H15M3.3 15H16.7C16.8657 15 17 14.8657 17 14.7V5.3C17 5.13431 16.8657 5 16.7 5H3.3C3.13431 5 3 5.13431 3 5.3V14.7C3 14.8657 3.13431 15 3.3 15Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcCreditCard = forwardRef(_IcCreditCard);
