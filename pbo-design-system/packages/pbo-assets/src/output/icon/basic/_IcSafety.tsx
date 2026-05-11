/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSafety = (
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.65625 1.39318C9.87814 1.31182 10.1208 1.31203 10.3428 1.39318L16.6816 3.32091L16.7275 3.33459L16.7715 3.35509C17.0324 3.47561 17.2001 3.73661 17.2002 4.02404V11.0006C17.1999 14.9768 13.9763 18.2008 10 18.2008C6.02375 18.2008 2.80012 14.9768 2.7998 11.0006V4.02404C2.79995 3.73661 2.96757 3.47561 3.22852 3.35509L3.27246 3.33459L3.31836 3.32091L9.65625 1.39318ZM9.49609 10.9498L7.52051 8.75451L7 9.22228L6.47949 9.69103L8.75488 12.2194C9.15373 12.6622 9.84998 12.6598 10.2461 12.2145L14.0234 7.96545L12.9766 7.03576L9.49609 10.9498Z"
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
        d="M7 9.22222L9.27562 11.7507C9.39529 11.8837 9.60399 11.883 9.72283 11.7493L13.5 7.5M16.5 4.02395V11C16.5 14.5898 13.5899 17.5 10 17.5C6.41015 17.5 3.5 14.5899 3.5 11V4.02395C3.5 4.00935 3.50849 3.99608 3.52174 3.98996L9.87428 2.05802C9.95405 2.02121 10.0459 2.02121 10.1257 2.05802L16.4783 3.98996C16.4915 3.99608 16.5 4.00935 16.5 4.02395Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcSafety = forwardRef(_IcSafety);
