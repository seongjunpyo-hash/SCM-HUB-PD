/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcShoppingBag = (
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
          d="M11.7998 5C11.7998 4.00589 10.9941 3.2002 10 3.2002C9.00589 3.2002 8.2002 4.00589 8.2002 5V5.2998H11.7998V5ZM13.2002 5.2998H15.7002C16.2523 5.29991 16.7001 5.74767 16.7002 6.2998V16.7002C16.7001 17.2523 16.2523 17.7001 15.7002 17.7002H4.2998C3.74768 17.7001 3.29991 17.2523 3.2998 16.7002V6.2998C3.29991 5.74768 3.74767 5.29991 4.2998 5.2998H6.7998V5C6.7998 3.23269 8.23269 1.7998 10 1.7998C11.7673 1.7998 13.2002 3.23269 13.2002 5V5.2998Z"
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
        d="M7.5 8V5C7.5 3.61929 8.61929 2.5 10 2.5C11.3807 2.5 12.5 3.61929 12.5 5V8M4.3 17H15.7C15.8657 17 16 16.8657 16 16.7V6.3C16 6.13431 15.8657 6 15.7 6H4.3C4.13431 6 4 6.13431 4 6.3V16.7C4 16.8657 4.13432 17 4.3 17Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcShoppingBag = forwardRef(_IcShoppingBag);
