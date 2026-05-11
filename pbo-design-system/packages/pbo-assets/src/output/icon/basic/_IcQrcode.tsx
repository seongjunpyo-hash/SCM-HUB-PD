/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcQrcode = (
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
          d="M9.2002 18.2002H1.7998V10.7998H9.2002V18.2002ZM4.5 13.5V15.5H6.5V13.5H4.5Z"
          fill={color}
        />
        <path
          d="M15.2002 13.7998H16.7998V10.7998H18.2002V15.2002H13.7998V12.2002H12.2002V18.2002H10.7998V10.7998H15.2002V13.7998Z"
          fill={color}
        />
        <path d="M15.7002 18.2002H13.7998V16.2998H15.7002V18.2002Z" fill={color} />
        <path d="M18.2002 18.2002H16.2998V16.2998H18.2002V18.2002Z" fill={color} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.2002 9.2002H1.7998V1.7998H9.2002V9.2002ZM4.5 4.5V6.5H6.5V4.5H4.5Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.2002 9.2002H10.7998V1.7998H18.2002V9.2002ZM13.5 4.5V6.5H15.5V4.5H13.5Z"
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
        d="M11.5 17.5V11.5H14.5V14.5H17.5V11.5M4.5 4.5H6.5V6.5H4.5V4.5ZM4.5 13.5H6.5V15.5H4.5V13.5ZM13.5 4.5H15.5V6.5H13.5V4.5ZM14.5 17H15V17.5H14.5V17ZM17 17H17.5V17.5H17V17ZM2.5 2.5H8.5V8.5H2.5V2.5ZM2.5 11.5H8.5V17.5H2.5V11.5ZM11.5 2.5H17.5V8.5H11.5V2.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    </svg>
  );
};

export const IcQrcode = forwardRef(_IcQrcode);
