/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcGrid = (
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
          d="M9.4502 16.4502C9.45009 17.0023 9.00233 17.4501 8.4502 17.4502H3.5498C2.99767 17.4501 2.54991 17.0023 2.5498 16.4502V11.5498C2.54991 10.9977 2.99767 10.5499 3.5498 10.5498H8.4502C9.00233 10.5499 9.45009 10.9977 9.4502 11.5498V16.4502ZM17.4502 16.4502C17.4501 17.0023 17.0023 17.4501 16.4502 17.4502H11.5498C10.9977 17.4501 10.5499 17.0023 10.5498 16.4502V11.5498C10.5499 10.9977 10.9977 10.5499 11.5498 10.5498H16.4502C17.0023 10.5499 17.4501 10.9977 17.4502 11.5498V16.4502ZM9.4502 8.4502C9.45009 9.00233 9.00233 9.45009 8.4502 9.4502H3.5498C2.99768 9.45009 2.54991 9.00233 2.5498 8.4502V3.5498C2.54991 2.99767 2.99767 2.54991 3.5498 2.5498H8.4502C9.00233 2.54991 9.45009 2.99768 9.4502 3.5498V8.4502ZM17.4502 8.4502C17.4501 9.00233 17.0023 9.45009 16.4502 9.4502H11.5498C10.9977 9.45009 10.5499 9.00233 10.5498 8.4502V3.5498C10.5499 2.99767 10.9977 2.54991 11.5498 2.5498H16.4502C17.0023 2.54991 17.4501 2.99767 17.4502 3.5498V8.4502Z"
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
        d="M3.25 3.55C3.25 3.38431 3.38431 3.25 3.55 3.25H8.45C8.61569 3.25 8.75 3.38431 8.75 3.55V8.45C8.75 8.61569 8.61569 8.75 8.45 8.75H3.55C3.38431 8.75 3.25 8.61569 3.25 8.45V3.55Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M3.25 11.55C3.25 11.3843 3.38431 11.25 3.55 11.25H8.45C8.61569 11.25 8.75 11.3843 8.75 11.55V16.45C8.75 16.6157 8.61569 16.75 8.45 16.75H3.55C3.38431 16.75 3.25 16.6157 3.25 16.45V11.55Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M11.25 3.55C11.25 3.38431 11.3843 3.25 11.55 3.25H16.45C16.6157 3.25 16.75 3.38431 16.75 3.55V8.45C16.75 8.61569 16.6157 8.75 16.45 8.75H11.55C11.3843 8.75 11.25 8.61569 11.25 8.45V3.55Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M11.25 11.55C11.25 11.3843 11.3843 11.25 11.55 11.25H16.45C16.6157 11.25 16.75 11.3843 16.75 11.55V16.45C16.75 16.6157 16.6157 16.75 16.45 16.75H11.55C11.3843 16.75 11.25 16.6157 11.25 16.45V11.55Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcGrid = forwardRef(_IcGrid);
