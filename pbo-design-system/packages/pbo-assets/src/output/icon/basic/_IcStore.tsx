/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcStore = (
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
          d="M16.5 2.5C16.7761 2.5 17 2.72386 17 3V5C17.2761 5 17.5 5.22386 17.5 5.5V8.5C17.5 9.11258 17.3152 9.68146 17 10.1562V17C17 17.2761 16.7761 17.5 16.5 17.5H12.5V14C12.5 13.7239 12.2761 13.5 12 13.5H8C7.72386 13.5 7.5 13.7239 7.5 14V17.5H3.5C3.22386 17.5 3 17.2761 3 17V10.1562C2.68482 9.68146 2.5 9.11258 2.5 8.5V5.5C2.5 5.22386 2.72386 5 3 5V3C3 2.72386 3.22386 2.5 3.5 2.5H16.5ZM3.5 8.5C3.5 9.60457 4.39543 10.5 5.5 10.5C6.2916 10.5 6.97551 10.0381 7.2998 9.36621L7.33496 9.30469C7.42696 9.16791 7.58211 9.08398 7.75 9.08398C7.94176 9.08398 8.1167 9.19361 8.2002 9.36621C8.52449 10.0381 9.2084 10.5 10 10.5C10.7916 10.5 11.4755 10.0381 11.7998 9.36621L11.835 9.30469C11.927 9.16791 12.0821 9.08398 12.25 9.08398C12.4418 9.08398 12.6167 9.19361 12.7002 9.36621C13.0245 10.0381 13.7084 10.5 14.5 10.5C15.6046 10.5 16.5 9.60457 16.5 8.5V6H3.5V8.5Z"
          fill={color}
        />
        <path d="M11.5 14.5V17.5H8.5V14.5H11.5Z" fill={color} />
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
        d="M16.5 10V17H3.5V10M3.5 3H16.5V5.5H3.5V3ZM8 13.5H12V17H8V13.5ZM17 8.5C17 9.88071 15.8807 11 14.5 11C13.5082 11 12.654 10.4211 12.25 9.58398C11.846 10.4211 10.9918 11 10 11C9.00819 11 8.15404 10.4211 7.75 9.58398C7.34596 10.4211 6.49181 11 5.5 11C4.11929 11 3 9.88071 3 8.5V5.5H17V8.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IcStore = forwardRef(_IcStore);
