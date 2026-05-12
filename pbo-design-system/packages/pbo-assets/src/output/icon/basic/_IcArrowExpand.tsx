/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcArrowExpand = (
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
          d="M11.0049 8.00488L14.8096 4.2002H11.7998V2.7998H16.2002C16.7523 2.79991 17.2001 3.24767 17.2002 3.7998V8.2002H15.7998V5.19043L11.9951 8.99512L11.0049 8.00488ZM4.2002 14.8096L8.00488 11.0049L8.99512 11.9951L5.19043 15.7998H8.2002V17.2002H3.7998C3.24767 17.2001 2.79991 16.7523 2.7998 16.2002V11.7998H4.2002V14.8096Z"
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
        d="M7.5 17H8V16H7.5V16.5V17ZM3.8 16.5V17V16.5ZM3.5 16.2H3V16.2H3.5ZM4 12.5L4 12H3L3 12.5H3.5H4ZM12.5 3L12 3V4L12.5 4V3.5V3ZM16.2 3.5V3V3.5ZM16.5 3.8L17 3.8V3.8L16.5 3.8ZM16 7.5V8L17 8V7.5L16.5 7.5L16 7.5ZM7.5 16.5V16H3.8V16.5V17H7.5V16.5ZM3.5 16.2H4L4 12.5H3.5H3L3 16.2H3.5ZM3.8 16.5V16C3.91046 16 4 16.0895 4 16.2H3.5H3C3 16.6418 3.35817 17 3.8 17V16.5ZM3.5 16.5L3.85356 16.8536L8.85356 11.8536L8.5 11.5L8.14645 11.1464L3.14645 16.1464L3.5 16.5ZM12.5 3.5V4L16.2 4V3.5V3L12.5 3V3.5ZM16.5 3.8L16 3.8L16 7.5L16.5 7.5L17 7.5L17 3.8L16.5 3.8ZM16.2 3.5V4C16.0895 4 16 3.91046 16 3.8L16.5 3.8L17 3.8C17 3.35817 16.6418 3 16.2 3V3.5ZM16.5 3.5L16.1464 3.14645L11.1464 8.14645L11.5 8.5L11.8536 8.85355L16.8536 3.85355L16.5 3.5Z"
        fill={color}
      />
    </svg>
  );
};

export const IcArrowExpand = forwardRef(_IcArrowExpand);
