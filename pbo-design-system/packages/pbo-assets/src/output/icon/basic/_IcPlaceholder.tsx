/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcPlaceholder = (
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
          d="M18 16.9611C17.9999 17.5347 17.5347 17.9999 16.9611 18H3.03893C2.46531 17.9999 2.00011 17.5347 2 16.9611V3.03893C2.00011 2.46531 2.46531 2.00011 3.03893 2H16.9611C17.5347 2.00011 17.9999 2.46531 18 3.03893V16.9611Z"
          fill={color}
          fillOpacity="0.1"
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
        d="M18 16.9611C17.9999 17.5347 17.5347 17.9999 16.9611 18H3.03893C2.46531 17.9999 2.00011 17.5347 2 16.9611V3.03893C2.00011 2.46531 2.46531 2.00011 3.03893 2H16.9611C17.5347 2.00011 17.9999 2.46531 18 3.03893V16.9611Z"
        fill={color}
        fillOpacity="0.1"
      />
    </svg>
  );
};

export const IcPlaceholder = forwardRef(_IcPlaceholder);
