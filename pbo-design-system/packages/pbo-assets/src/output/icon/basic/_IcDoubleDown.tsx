/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcDoubleDown = (
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
          d="M4.51581 9.02638L10.0197 14.5313L15.5256 9.02638L16.5158 10.0156L10.5861 15.9453C10.2738 16.2575 9.76766 16.2574 9.45526 15.9453L3.52557 10.0156L4.51581 9.02638ZM4.51581 4.02638L10.0197 9.53126L15.5256 4.02638L16.5158 5.01564L10.5861 10.9453C10.2738 11.2575 9.76766 11.2574 9.45526 10.9453L3.52557 5.01564L4.51581 4.02638Z"
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
        d="M16.0207 9.52091L10.0912 15.4502C10.0522 15.4893 9.98887 15.4893 9.94982 15.4502L4.02069 9.52091M16.0207 4.52091L10.0912 10.4502C10.0522 10.4893 9.98887 10.4893 9.94982 10.4502L4.02069 4.52091"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcDoubleDown = forwardRef(_IcDoubleDown);
