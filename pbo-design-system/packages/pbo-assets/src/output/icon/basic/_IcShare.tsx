/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcShare = (
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
          d="M16.9002 5.5C16.9002 6.99117 15.6912 8.2002 14.2 8.2002C13.3718 8.2002 12.6318 7.82626 12.1365 7.23926L8.34064 9.43652C8.37924 9.61829 8.40021 9.80673 8.40021 10C8.40021 10.1929 8.37911 10.381 8.34064 10.5625L12.1365 12.7598C12.6318 12.1731 13.3721 11.7998 14.2 11.7998C15.6912 11.7998 16.9002 13.0088 16.9002 14.5C16.9002 15.9912 15.6912 17.2002 14.2 17.2002C12.7088 17.2002 11.4998 15.9912 11.4998 14.5C11.4998 14.3404 11.5152 14.1842 11.5418 14.0322L7.70001 11.8086C7.20596 12.3546 6.49436 12.7002 5.70001 12.7002C4.20884 12.7002 2.99982 11.4912 2.99982 10C2.99982 8.50883 4.20884 7.2998 5.70001 7.2998C6.4941 7.2998 7.20597 7.64474 7.70001 8.19043L11.5418 5.9668C11.5154 5.81508 11.4998 5.65929 11.4998 5.5C11.4998 4.00883 12.7088 2.7998 14.2 2.7998C15.6912 2.7998 16.9002 4.00883 16.9002 5.5Z"
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
        d="M12.45 6.25L7.7 8.99999M7.7 11L12.45 13.75M16.2 5.5C16.2 6.60457 15.3046 7.5 14.2 7.5C13.0954 7.5 12.2 6.60457 12.2 5.5C12.2 4.39543 13.0954 3.5 14.2 3.5C15.3046 3.5 16.2 4.39543 16.2 5.5ZM7.7 10C7.7 11.1046 6.80457 12 5.7 12C4.59543 12 3.7 11.1046 3.7 10C3.7 8.89543 4.59543 8 5.7 8C6.80457 8 7.7 8.89543 7.7 10ZM16.2 14.5C16.2 15.6046 15.3046 16.5 14.2 16.5C13.0954 16.5 12.2 15.6046 12.2 14.5C12.2 13.3954 13.0954 12.5 14.2 12.5C15.3046 12.5 16.2 13.3954 16.2 14.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcShare = forwardRef(_IcShare);
