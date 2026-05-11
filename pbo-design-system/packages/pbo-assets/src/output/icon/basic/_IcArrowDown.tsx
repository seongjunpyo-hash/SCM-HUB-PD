/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcArrowDown = (
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
          d="M10.9072 3V15.4502L15.4932 10.6357L16 11.1191L16.5068 11.6016L10.9238 17.4629C10.7335 17.6627 10.4781 17.7662 10.2236 17.7725C9.9646 17.7787 9.70083 17.6839 9.5 17.4873L3.50977 11.6191L4.49023 10.6191L9.50684 15.5342V3H10.9072Z"
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
        d="M4 11.1189L9.98958 16.9871C10.0499 17.0462 10.1288 17.0746 10.2069 17.0727M16 11.1189L10.4167 16.9797C10.3596 17.0397 10.2836 17.0708 10.2069 17.0727M10.2069 17.0727V17.2M10.2069 17.0727V3"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcArrowDown = forwardRef(_IcArrowDown);
