/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcImage = (
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
          d="M4.2002 11.3096L6.29297 9.2168L6.36914 9.14844C6.76183 8.82833 7.34097 8.85096 7.70703 9.2168L14.29 15.7998H15.7998V4.2002H4.2002V11.3096ZM4.2002 13.29V15.7998H12.3096L7 10.4902L4.2002 13.29ZM13.2998 8C13.2998 7.28203 12.718 6.7002 12 6.7002C11.282 6.7002 10.7002 7.28203 10.7002 8C10.7002 8.71797 11.282 9.2998 12 9.2998C12.718 9.2998 13.2998 8.71797 13.2998 8ZM14.7002 8C14.7002 9.49117 13.4912 10.7002 12 10.7002C10.5088 10.7002 9.2998 9.49117 9.2998 8C9.2998 6.50883 10.5088 5.2998 12 5.2998C13.4912 5.2998 14.7002 6.50883 14.7002 8ZM17.2002 16.2002C17.2001 16.7523 16.7523 17.2001 16.2002 17.2002H3.7998C3.24768 17.2001 2.79991 16.7523 2.7998 16.2002V3.7998C2.79991 3.24768 3.24767 2.79991 3.7998 2.7998H16.2002C16.7523 2.79991 17.2001 3.24767 17.2002 3.7998V16.2002Z"
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
        d="M14 16.5L7.21213 9.71213C7.09497 9.59497 6.90503 9.59497 6.78787 9.71213L3.5 13M14 8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8ZM3.8 16.5H16.2C16.3657 16.5 16.5 16.3657 16.5 16.2V3.8C16.5 3.63431 16.3657 3.5 16.2 3.5H3.8C3.63431 3.5 3.5 3.63431 3.5 3.8V16.2C3.5 16.3657 3.63431 16.5 3.8 16.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcImage = forwardRef(_IcImage);
