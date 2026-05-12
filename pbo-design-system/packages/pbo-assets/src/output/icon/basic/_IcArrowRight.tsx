/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcArrowRight = (
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
          d="M10.0464 4.47363L14.9614 9.49023H2.42722V10.8906H14.8774L10.0639 15.4766L11.0288 16.4902L16.8901 10.9072C17.2939 10.5226 17.3047 9.88183 16.9145 9.4834L11.0464 3.49316L10.0464 4.47363Z"
          fill={color}
        />
        <path
          d="M10.0464 4.47363L14.9614 9.49023H2.42722V10.8906H14.8774L10.0639 15.4766L11.0288 16.4902L16.8901 10.9072C17.2939 10.5226 17.3047 9.88183 16.9145 9.4834L11.0464 3.49316L10.0464 4.47363Z"
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
        d="M11.1189 4L16.9871 9.98958C17.0462 10.0499 17.0746 10.1288 17.0727 10.2069M11.1189 16L16.9797 10.4167C17.0397 10.3596 17.0708 10.2836 17.0727 10.2069M17.0727 10.2069H17.2M17.0727 10.2069H3"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcArrowRight = forwardRef(_IcArrowRight);
