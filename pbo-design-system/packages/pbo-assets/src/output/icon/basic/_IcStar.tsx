/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcStar = (
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
          d="M9.21274 2.24896C9.58486 1.69552 10.4148 1.69556 10.787 2.24896L10.8592 2.37591L12.9159 6.68158L17.6082 7.38665C18.3815 7.50312 18.6927 8.45037 18.1395 9.00287L14.7498 12.3837L15.5506 17.1552C15.6812 17.9361 14.8575 18.5263 14.16 18.1513L9.99984 15.914L5.83969 18.1513C5.14233 18.5259 4.31857 17.9359 4.44906 17.1552L5.24887 12.3827L1.8602 8.99798C1.3068 8.44514 1.61901 7.49775 2.39242 7.38177L7.08383 6.6806L9.14047 2.37591L9.21274 2.24896Z"
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
        d="M10.228 2.67738C10.1364 2.48569 9.86357 2.48569 9.77203 2.67738L7.61342 7.19761C7.57724 7.27338 7.50578 7.32622 7.42274 7.33861L2.49626 8.07376C2.291 8.10439 2.20818 8.35573 2.35502 8.50238L5.90782 12.0506C5.96565 12.1084 5.99197 12.1906 5.97844 12.2712L5.13967 17.2704C5.10491 17.4776 5.32346 17.6342 5.50847 17.5347L9.88035 15.1837C9.95506 15.1436 10.0449 15.1436 10.1197 15.1837L14.4915 17.5347C14.6765 17.6342 14.8951 17.4776 14.8603 17.2704L14.0216 12.2713C14.008 12.1906 14.0344 12.1084 14.0923 12.0506L17.6449 8.50757C17.7918 8.36105 17.7092 8.10969 17.504 8.07887L12.5771 7.33872C12.4941 7.32626 12.4228 7.27345 12.3866 7.19776L10.228 2.67738Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcStar = forwardRef(_IcStar);
