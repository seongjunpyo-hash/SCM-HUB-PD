/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcBell = (
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
          d="M7.80956 14.7002C8.10586 15.6279 8.974 16.2998 9.99999 16.2998C11.026 16.2998 11.8941 15.6279 12.1904 14.7002H7.80956ZM15.7002 11.7998C15.7002 11.8163 15.7168 11.9277 15.9072 12.1377C16.0849 12.3337 16.3431 12.537 16.6318 12.7275C17.0913 13.0311 17.144 13.5558 17.0586 13.8945C16.9726 14.2344 16.6598 14.7002 16.0674 14.7002H13.6328C13.3055 16.4088 11.804 17.7002 9.99999 17.7002C8.19599 17.7002 6.69453 16.4088 6.36718 14.7002H3.93261C3.34018 14.7002 3.02734 14.2344 2.9414 13.8945C2.85595 13.5558 2.90865 13.0311 3.36815 12.7275L3.57811 12.582C3.78067 12.4354 3.95947 12.2847 4.09276 12.1377C4.28313 11.9277 4.29979 11.8163 4.29979 11.7998V8C4.29979 4.85198 6.85197 2.2998 9.99999 2.2998C13.148 2.2998 15.7002 4.85198 15.7002 8V11.7998Z"
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
        d="M13 14C13 15.6569 11.6569 17 10 17C8.34315 17 7 15.6569 7 14M5 8C5 5.23858 7.23858 3 10 3C12.7614 3 15 5.23858 15 8V11.8C15 12.3511 15.6222 12.8998 16.2458 13.3115C16.517 13.4904 16.3927 14 16.0678 14H3.93217C3.60727 14 3.48302 13.4904 3.75417 13.3115C4.37778 12.8998 5 12.3511 5 11.8V8Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcBell = forwardRef(_IcBell);
