/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcHeart = (
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
          d="M18.2002 7.5C18.2002 9.21759 17.5021 10.3739 16.7793 11.208L16.7686 11.2197L16.7588 11.2314C15.1985 12.8809 11.5299 16.0958 10.6562 16.8574C10.2802 17.1852 9.7198 17.1852 9.34375 16.8574C8.47014 16.0958 4.8015 12.8809 3.24121 11.2314L3.23145 11.2197L3.2207 11.208C2.49793 10.3739 1.7998 9.21759 1.7998 7.5C1.7998 4.9247 3.55483 2.7998 6.25 2.7998C8.03717 2.7998 9.18118 3.67693 10 4.74512C10.8188 3.67693 11.9628 2.7998 13.75 2.7998C16.4452 2.7998 18.2002 4.9247 18.2002 7.5Z"
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
        d="M9.80392 16.3294C9.91639 16.4275 10.0836 16.4275 10.1961 16.3294C11.0801 15.5587 14.7183 12.3692 16.25 10.75C16.9 10 17.5 9 17.5 7.5C17.5 5.25 16 3.5 13.75 3.5C11.85 3.5 10.8 4.65 10 6C9.2 4.65 8.15 3.5 6.25 3.5C4 3.5 2.5 5.25 2.5 7.5C2.5 9 3.1 10 3.75 10.75C5.28165 12.3692 8.91988 15.5587 9.80392 16.3294Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export const IcHeart = forwardRef(_IcHeart);
