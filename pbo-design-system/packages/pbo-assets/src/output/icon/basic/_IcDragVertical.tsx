/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcDragVertical = (
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
          d="M4.06674 12.3775C3.59397 11.9047 3.92869 11.0959 4.59723 11.0957L15.403 11.0957C16.0712 11.0962 16.4059 11.9048 15.9335 12.3775L10.5306 17.7795C10.2375 18.0725 9.76275 18.0724 9.46963 17.7795L4.06674 12.3775Z"
          fill={color}
        />
        <path
          d="M15.9332 7.62093C16.406 8.09372 16.0713 8.90256 15.4028 8.90271L4.59698 8.90271C3.9288 8.90224 3.59411 8.09366 4.0665 7.62093L9.46939 2.21896C9.76245 1.92591 10.2372 1.92601 10.5304 2.21896L15.9332 7.62093Z"
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
        d="M4.06674 12.3775C3.59397 11.9047 3.92869 11.0959 4.59723 11.0957L15.403 11.0957C16.0712 11.0962 16.4059 11.9048 15.9335 12.3775L10.5306 17.7795C10.2375 18.0725 9.76275 18.0724 9.46963 17.7795L4.06674 12.3775Z"
        fill={color}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M15.9332 7.62093C16.406 8.09372 16.0713 8.90256 15.4028 8.90271L4.59698 8.90271C3.9288 8.90224 3.59411 8.09366 4.0665 7.62093L9.46939 2.21896C9.76245 1.92591 10.2372 1.92601 10.5304 2.21896L15.9332 7.62093Z"
        fill={color}
      />
    </svg>
  );
};

export const IcDragVertical = forwardRef(_IcDragVertical);
