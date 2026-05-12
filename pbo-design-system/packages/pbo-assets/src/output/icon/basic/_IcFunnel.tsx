/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcFunnel = (
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
          d="M11.7136 13.2998V14.7002L8.28589 14.7002V13.2998L11.7136 13.2998ZM13.8572 9.2998V10.7002H6.14233V9.2998H13.8572ZM15.9998 5.2998V6.7002L3.99976 6.7002V5.2998L15.9998 5.2998Z"
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
        d="M6.14286 10H13.8571M4 6L16 6M8.28571 14L11.7143 14"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcFunnel = forwardRef(_IcFunnel);
