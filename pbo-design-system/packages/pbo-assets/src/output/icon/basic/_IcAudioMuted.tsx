/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcAudioMuted = (
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
          d="M6.2002 9C6.2002 9.53274 6.3099 10.0398 6.50781 10.5L7.37695 9.63184C7.49435 10.1209 7.74279 10.5582 8.08594 10.9033L7.30762 11.6807C7.99569 12.3717 8.94768 12.7998 10 12.7998C12.0987 12.7998 13.7998 11.0987 13.7998 9H15.2002C15.2002 11.6343 13.2408 13.8093 10.7002 14.1514V16.2998H14V17.7002H6V16.2998H9.2998V14.1514C8.14115 13.9953 7.10347 13.4595 6.31738 12.6709L4.49512 14.4951L3.50488 13.5049L5.46484 11.5439C5.04198 10.7917 4.7998 9.92431 4.7998 9H6.2002Z"
          fill={color}
        />
        <path
          d="M12.7002 6.29004V9C12.7002 10.4912 11.4912 11.7002 10 11.7002C9.25168 11.7002 8.57501 11.3951 8.08594 10.9033L12.7002 6.29004Z"
          fill={color}
        />
        <path
          d="M10 2.2998C11.2786 2.2998 12.3465 3.18939 12.626 4.38281L7.37695 9.63184C7.32825 9.42896 7.2998 9.21781 7.2998 9V5C7.2998 3.50883 8.50883 2.2998 10 2.2998Z"
          fill={color}
        />
        <path
          d="M15.4951 3.49512L12.7002 6.29004V5C12.7002 4.78739 12.6724 4.58126 12.626 4.38281L14.5049 2.50488L15.4951 3.49512Z"
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
        d="M10 13V17M6 17H14M14.5 9C14.5 11.4853 12.4853 13.5 10 13.5C7.51472 13.5 5.5 11.4853 5.5 9M15 3L4 14M8 9V5C8 3.89543 8.89543 3 10 3C11.1046 3 12 3.89543 12 5V9C12 10.1046 11.1046 11 10 11C8.89543 11 8 10.1046 8 9Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcAudioMuted = forwardRef(_IcAudioMuted);
