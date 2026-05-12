/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcThumbsDown = (
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
          d="M12.7451 1.7998C14.8194 1.7998 16.639 3.18312 17.1943 5.18164L18.1562 8.64453C18.6269 10.3388 17.3531 12.0156 15.5947 12.0156H12.3262L12.8535 13.4238C13.3037 14.6243 13.089 15.9734 12.2881 16.9746L11.6064 17.8271C11.2038 18.3304 10.4361 18.323 10.043 17.8125L5.58301 12.0156H1.7998V1.7998H12.7451ZM3.2002 10.6152H5.22852V3.2002H3.2002V10.6152Z"
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
        d="M5.92824 11.3155H2.5V2.5H5.92824M5.92824 11.3155V2.5M5.92824 11.3155L10.5973 17.3853C10.7136 17.5364 10.9406 17.5386 11.0597 17.3897L11.7416 16.5374C12.3884 15.7288 12.562 14.6395 12.1984 13.6699L11.4644 11.7125C11.3923 11.5204 11.5343 11.3155 11.7395 11.3155H15.5946C16.8901 11.3155 17.8289 10.0804 17.4821 8.83217L16.5203 5.36936C16.0492 3.67358 14.5052 2.5 12.7452 2.5H5.92824"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcThumbsDown = forwardRef(_IcThumbsDown);
