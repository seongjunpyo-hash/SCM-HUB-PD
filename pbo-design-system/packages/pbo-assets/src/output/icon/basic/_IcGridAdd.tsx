/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcGridAdd = (
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
          d="M8.4502 10.5498C9.00233 10.5499 9.45009 10.9977 9.4502 11.5498V16.4502C9.45009 17.0023 9.00233 17.4501 8.4502 17.4502H3.5498C2.99767 17.4501 2.54991 17.0023 2.5498 16.4502V11.5498C2.54991 10.9977 2.99767 10.5499 3.5498 10.5498H8.4502Z"
          fill={color}
        />
        <path
          d="M16.4502 10.5498C17.0023 10.5499 17.4501 10.9977 17.4502 11.5498V16.4502C17.4501 17.0023 17.0023 17.4501 16.4502 17.4502H11.5498C10.9977 17.4501 10.5499 17.0023 10.5498 16.4502V11.5498C10.5499 10.9977 10.9977 10.5499 11.5498 10.5498H16.4502Z"
          fill={color}
        />
        <path
          d="M8.4502 2.5498C9.00233 2.54991 9.45009 2.99768 9.4502 3.5498V8.4502C9.45009 9.00233 9.00233 9.45009 8.4502 9.4502H3.5498C2.99768 9.45009 2.54991 9.00233 2.5498 8.4502V3.5498C2.54991 2.99767 2.99767 2.54991 3.5498 2.5498H8.4502Z"
          fill={color}
        />
        <path
          d="M14.7002 5.2998H17.25V6.7002H14.7002V9.25H13.2998V6.7002H10.75V5.2998H13.2998V2.75H14.7002V5.2998Z"
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
        d="M14 2.75V6M14 6V9.25M14 6H10.75M14 6H17.25M3.55 8.75H8.45C8.61569 8.75 8.75 8.61569 8.75 8.45V3.55C8.75 3.38431 8.61569 3.25 8.45 3.25H3.55C3.38431 3.25 3.25 3.38431 3.25 3.55V8.45C3.25 8.61569 3.38431 8.75 3.55 8.75ZM11.55 16.75H16.45C16.6157 16.75 16.75 16.6157 16.75 16.45V11.55C16.75 11.3843 16.6157 11.25 16.45 11.25H11.55C11.3843 11.25 11.25 11.3843 11.25 11.55V16.45C11.25 16.6157 11.3843 16.75 11.55 16.75ZM3.55 16.75H8.45C8.61569 16.75 8.75 16.6157 8.75 16.45V11.55C8.75 11.3843 8.61569 11.25 8.45 11.25H3.55C3.38431 11.25 3.25 11.3843 3.25 11.55V16.45C3.25 16.6157 3.38431 16.75 3.55 16.75Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcGridAdd = forwardRef(_IcGridAdd);
